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

export default class Registration {

    public procedure;
    public endpoint;
    public options;
    public session;
    public id;
    public active: boolean = true;

    public on_unregister: Promise<any>;
    // TODO make private
    public _on_unregister: Deferred<any>;

    constructor(procedure, endpoint, options, session, id) {

        this.procedure = procedure;
        this.endpoint = endpoint;
        this.options = options || {};
        this.session = session;
        this.id = id;

        // this will fire when the endpoint is unregistered
        this._on_unregister = session._defer();

        if (this._on_unregister.promise.then) {
            // whenjs has the actual user promise in an attribute
            this.on_unregister = this._on_unregister.promise;
        } else {
            this.on_unregister = this._on_unregister as any;
        }
    }

    unregister() {
        return this.session.unregister(this);
    }
}
