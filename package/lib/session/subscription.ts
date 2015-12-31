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

import {Deferred, Promise} from "when";

export default class Subscription {

    public topic: string;
    public handler;
    public options;
    public session;
    public id: string;
    public active: boolean = true;

    public on_unsubscribe: Promise<any>;
    private _on_unsubscribe: Deferred<any>;

    constructor(topic, handler, options, session, id) {

        this.topic = topic;
        this.handler = handler;
        this.options = options || {};
        this.session = session;
        this.id = id;

        // this will fire when the handler is unsubscribed
        this._on_unsubscribe = session._defer();

        if (this._on_unsubscribe.promise.then) {
            // whenjs has the actual user promise in an attribute
            this.on_unsubscribe = this._on_unsubscribe.promise;
        } else {
            this.on_unsubscribe = this._on_unsubscribe as any;
        }
    }

    unsubscribe() {
        return this.session.unsubscribe(this);
    }
}
