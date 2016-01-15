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

export interface ITransport {
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

export interface ITransportInfo {
    type: string;
    url: string;
    protocol: string;
}

export interface ITransportFactory {
    type: string;
    create: () => ITransport;
}

class Transports {
    private _repository = {};

    register(name: string, factory) {
        this._repository[name] = factory;
    }

    isRegistered() {
        return this._repository[name] !== undefined;
    }

    get(name: string) {
        if (this._repository[name] !== undefined) {
            return this._repository[name];
        } else {
            throw "no such transport: " + name;
        }
    }

    list() {
        var items = [];
        for (var name in this._repository) {
            items.push(name);
        }
        return items;
    }
}

export var transports = new Transports();

// register default transports
try {
    var websocket = require('./transport/websocket/websocket');
    transports.register("websocket", websocket.Factory);
} catch (err) { };

try {
    var longpoll = require('./transport/longpoll');
    transports.register("longpoll", longpoll.Factory);
} catch (err) { };

try {
    var rawsocket = require('./transport/rawsocket');
    transports.register("rawsocket", rawsocket.Factory);
} catch (err) { };

