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


import * as util from "../../util";
import * as log from "../../log";
import {ITransportFactory, ITransport} from "../../transports";

export class Factory implements ITransportFactory {

    public type: string = "websocket";

    private _options: any;

    constructor(options: any) {

        util.assert(options.url !== undefined, "options.url missing");
        util.assert(typeof options.url === "string", "options.url must be a string");

        if (!options.protocols) {
            options.protocols = ['wamp.2.json'];
        } else {
            util.assert(Array.isArray(options.protocols), "options.protocols must be an array");
        }

        this._options = options;
    }

    public create = (): ITransport => {

        var self = this;

        // the WAMP transport we create
        var transport: ITransport = {} as any;

        // these will get defined further below
        transport.protocol = undefined;
        transport.send = undefined;
        transport.close = undefined;

        // these will get overridden by the WAMP session using this transport
        transport.onmessage = function() { };
        transport.onopen = function() { };
        transport.onclose = function() { };

        transport.info = {
            type: 'websocket',
            url: null,
            protocol: 'wamp.2.json'
        };

        var websocket;

        // Chrome, MSIE, newer Firefox
        // TODO: At least Chrome does not expose a "global" variable anymore?
        if ("WebSocket" in global) {

            if (self._options.protocols) {
                websocket = new (global as any).WebSocket(self._options.url, self._options.protocols);
            } else {
                websocket = new (global as any).WebSocket(self._options.url);
            }

            // older versions of Firefox prefix the WebSocket object
        } else if ("MozWebSocket" in global) {

            if (self._options.protocols) {
                websocket = new (global as any).MozWebSocket(self._options.url, self._options.protocols);
            } else {
                websocket = new (global as any).MozWebSocket(self._options.url);
            }
        } else {
            throw "browser does not support WebSocket or WebSocket in Web workers";
        }

        websocket.onmessage = function(evt) {
            log.debug("WebSocket transport receive", evt.data);

            var msg = JSON.parse(evt.data);
            transport.onmessage(msg);
        }

        websocket.onopen = function() {
            transport.info.url = self._options.url;
            transport.onopen();
        }

        websocket.onclose = function(evt) {
            var details = {
                code: evt.code,
                reason: evt.message,
                wasClean: evt.wasClean
            }
            transport.onclose(details);
        }

        // do NOT do the following, since that will make
        // transport.onclose() fire twice (browsers already fire
        // websocket.onclose() for errors also)
        //websocket.onerror = websocket.onclose;

        transport.send = function(msg) {
            var payload = JSON.stringify(msg);
            log.debug("WebSocket transport send", payload);
            websocket.send(payload);
        }

        transport.close = function(code, reason) {
            websocket.close(code, reason);
        };

        return transport;
    }
}
