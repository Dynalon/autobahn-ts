///////////////////////////////////////////////////////////////////////////////
//
//  AutobahnJS - http://autobahn.ws, http://wamp.ws
//
//  A JavaScript library for WAMP ("The Web Application Messaging Protocol").
//
//  Copyright (C) 2011-2014 Tavendo GmbH, http://tavendo.com
//
//  Licensed under the MIT License.
//  http://www.opensource.org/licenses/mit-license.php
//
///////////////////////////////////////////////////////////////////////////////

declare var Promise;

import * as when from 'when';
import * as util from './util';
import * as log from './log';
import allTransports from './transports';
import Session from './session/session';

interface ITransport {
    type: string;
    url: string;
    info: ITransportInfo;
    protocol: string;
    send: Function;
    close: Function;
    onmessage: Function;
    onopen: Function;
    onclose: Function;
}

interface ITransportInfo {
    type: string;
    url: string;
    protocol: string;
}

interface ITransportFactory {
    type: string;
    create: () => ITransport;
}

export default class Connection {

    public get session() {
        return this._session;
    }

    public get isOpen() {
        return this._session && this._session.isOpen;
    }

    public get isConnected() {
        return !!this._transport;
    }

    public get transport(): ITransport {
        if (this._transport) {
            return this._transport;
        } else {
            return {
                info: {
                    type: 'none',
                    url: null,
                    protocol: null
                }
            } as any;
        }
    }

    public get isRetrying() {
        return this._is_retrying;
    }

    public onclose: Function;
    public onopen: Function;

    private _options: any;

    private _transport: ITransport = null;
    private _transport_factories: Array<ITransportFactory> = [];

    private _session: Session = null;

    // string?
    private _session_close_reason = null;
    private _session_close_message = null;

    private _retry_if_unreachable: boolean = true;
    private _max_retries: number = 15;
    private _initial_retry_delay: number = 1.5;
    private _max_retry_delay: number = 300;
    private _retry_delay_growth: number = 1.5;
    private _retry_delay_jitter: number = 0.1;

    // reconnection tracking

    private _is_retrying: boolean = false;

    // total number of successful connections
    private _connect_successes: number = 0;

    // controls if we should try to reconnect
    private _retry: boolean = false;

    // current number of reconnect cycles we went through
    private _retry_count = 0;

    // the current retry delay
    private _retry_delay: number;

    // flag indicating if we are currently in a reconnect cycle
    private _is_rerying: boolean = false;

    // when retrying, this is the timer object returned from window.setTimeout()
    private _retry_timer: number = null;

    constructor(options: any) {
        this._options = options || {};

        if (this._options.use_es6_promises || this._options.use_deferred) {
            console.log("WARNING: use_es6_promises and use_deferred flags are obsolete and ignored");
        }

        // WAMP transport
        //
        // backward compatiblity
        if (!this._options.transports) {
            this._options.transports = [
                {
                    type: 'websocket',
                    url: this._options.url
                }
            ];
        }

        this._init_transport_factories();

        // enable automatic reconnect if host is unreachable
        if (this._options.retry_if_unreachable !== undefined) {
            this._retry_if_unreachable = this._options.retry_if_unreachable;
        }

        // maximum number of reconnection attempts
        if (typeof this._options.max_retries === 'number') {
            this._max_retries = this._options.max_retries || 15;
        }

        if (typeof this._options.initial_retry_delay === 'number') {
            this._initial_retry_delay = this._options.initial_retry_delay;
        }
        if (typeof this._options.max_retry_delay === 'number') {
            this._max_retry_delay = this._options.max_retry_delay;
        }
        if (typeof this._options.retry_delay_growth === 'number') {
            this._retry_delay_growth = this._options.retry_delay_growth;
        }
        if (typeof this._options.retry_delay_jitter === 'number') {
            this._retry_delay_jitter = this._options.retry_delay_jitter;
        }

        this._retry_delay = this._initial_retry_delay;
    }

    private _create_transport = () => {

        for (let transport_factory of this._transport_factories) {
            log.debug("trying to create WAMP transport of type: " + transport_factory.type);
            try {
                let transport = transport_factory.create();
                if (transport) {
                    log.debug("using WAMP transport type: " + transport_factory.type);
                    return transport;
                }
            } catch (e) {
                // ignore
                log.debug("could not create WAMP transport '" + transport_factory.type + "': " + e);
            }
        }

        // could not create any WAMP transport
        return null;
    }

    private _init_transport_factories = () => {
        util.assert(this._options.transports, "No transport.factory specified");

        // WAMP transport
        //
        let transports = this._options.transports;
        //if(typeof transports === "object") {
        //    this._options.transports = [transports];
        //}
        for (let transport_options of this._options.transports) {
            // cascading transports until we find one which works
            if (!transport_options.url) {
                // defaulting to options.url if none is provided
                transport_options.url = this._options.url;
            }
            if (!transport_options.protocols) {
                transport_options.protocols = this._options.protocols;
            }
            util.assert(transport_options.type, "No transport.type specified");
            util.assert(typeof transport_options.type === "string", "transport.type must be a string");
            try {
                let transport_factory_klass = allTransports.get(transport_options.type);
                if (transport_factory_klass) {
                    let transport_factory = new transport_factory_klass(transport_options);
                    this._transport_factories.push(transport_factory);
                }
            } catch (exc) {
                console.error(exc);
            }
        }
    }

    private _autoreconnect_reset_timer() {

        if (this._retry_timer) {
            clearTimeout(this._retry_timer);
        }
        this._retry_timer = null;
    }

    private _autoreconnect_reset() {

        this._autoreconnect_reset_timer();

        this._retry_count = 0;
        this._retry_delay = this._initial_retry_delay;
        this._is_retrying = false;
    }

    private _autoreconnect_advance() {

        // jitter retry delay
        if (this._retry_delay_jitter) {
            this._retry_delay = util.rand_normal(this._retry_delay, this._retry_delay * this._retry_delay_jitter);
        }

        // cap the retry delay
        if (this._retry_delay > this._max_retry_delay) {
            this._retry_delay = this._max_retry_delay;
        }

        // count number of retries
        this._retry_count += 1;

        var res;
        if (this._retry && (this._max_retries === -1 || this._retry_count <= this._max_retries)) {
            res = {
                count: this._retry_count,
                delay: this._retry_delay,
                will_retry: true
            };
        } else {
            res = {
                count: null,
                delay: null,
                will_retry: false
            }
        }

        // retry delay growth for next retry cycle
        if (this._retry_delay_growth) {
            this._retry_delay = this._retry_delay * this._retry_delay_growth;
        }

        return res;
    }

    public open() {

        if (this._transport) {
            throw "connection already open (or opening)";
        }

        this._autoreconnect_reset();
        this._retry = true;

        let retry = () => {

            // create a WAMP transport
            this._transport = this._create_transport();

            if (!this._transport) {
                // failed to create a WAMP transport
                this._retry = false;
                if (this.onclose) {
                    var details = {
                        reason: null,
                        message: null,
                        retry_delay: null,
                        retry_count: null,
                        will_retry: false
                    };
                    this.onclose("unsupported", details);
                }
                return;
            }

            // create a new WAMP session using the WebSocket connection as transport
            this._session = new Session(this._transport, undefined, this._options.onchallenge);
            this._session_close_reason = null;
            this._session_close_message = null;

            this._transport.onopen = () => {

                // reset auto-reconnect timer and tracking
                this._autoreconnect_reset();

                // log successful connections
                this._connect_successes += 1;

                // start WAMP session
                this._session.join(this._options.realm, this._options.authmethods, this._options.authid);
            };

            this._session.onjoin = (details) => {
                if (this.onopen) {
                    try {
                        this.onopen(this._session, details);
                    } catch (e) {
                        log.debug("Exception raised from app code while firing Connection.onopen()", e);
                    }
                }
            };

            //
            // ... WAMP session is now attached to realm.
            //

            this._session.onleave = (reason, details) => {
                this._session_close_reason = reason;
                this._session_close_message = details.message || "";
                this._retry = false;
                this._transport.close(1000);
            };

            this._transport.onclose = (evt) => {

                // remove any pending reconnect timer
                this._autoreconnect_reset_timer();

                this._transport = null;

                var reason = null;
                if (this._connect_successes === 0) {
                    reason = "unreachable";
                    if (!this._retry_if_unreachable) {
                        this._retry = false;
                    }

                } else if (!evt.wasClean) {
                    reason = "lost";

                } else {
                    reason = "closed";
                }

                var next_retry = this._autoreconnect_advance();

                // fire app code handler
                //
                if (this.onclose) {
                    var details = {
                        reason: this._session_close_reason,
                        message: this._session_close_message,
                        retry_delay: next_retry.delay,
                        retry_count: next_retry.count,
                        will_retry: next_retry.will_retry
                    };
                    try {
                        // Connection.onclose() allows to cancel any subsequent retry attempt
                        var stop_retrying = this.onclose(reason, details);
                    } catch (e) {
                        log.debug("Exception raised from app code while firing Connection.onclose()", e);
                    }
                }

                // reset session info
                //
                if (this._session) {
                    this._session = null;
                    this._session_close_reason = null;
                    this._session_close_message = null;
                }

                // automatic reconnection
                //
                if (this._retry && !stop_retrying) {

                    if (next_retry.will_retry) {

                        this._is_retrying = true;

                        log.debug("retrying in " + next_retry.delay + " s");
                        this._retry_timer = setTimeout(retry, next_retry.delay * 1000);

                    } else {
                        log.debug("giving up trying to reconnect");
                    }
                }
            }
        }

        retry();
    }

    public close(reason, message) {
        if (!this._transport && !this._is_retrying) {
            throw "connection already closed";
        }

        // the app wants to close .. don't retry
        this._retry = false;

        if (this._session && this._session.isOpen) {
            // if there is an open session, close that first.
            this._session.leave(reason, message);
        } else if (this._transport) {
            // no session active: just close the transport
            this._transport.close(1000);
        }
    }
}
