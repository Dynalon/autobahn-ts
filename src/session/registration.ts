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
import * as when from "when";

import Session from "./sessionimpl";

export default class Registration {

    public procedure: string;
    public endpoint: Function;
    public options: any;
    public session: Session;
    public id: number;
    public active: boolean = true;

    public on_unregister: Promise<any>;
    // TODO make private
    public _on_unregister: Deferred<any>;

    constructor(
        procedure: string,
        endpoint: Function,
        options: any,
        session: Session,
        id: number
    ) {

        this.procedure = procedure;
        this.endpoint = endpoint;
        this.options = options || {};
        this.session = session;
        this.id = id;

        // this will fire when the endpoint is unregistered
        this._on_unregister = when.defer<any>();
        this.on_unregister = this._on_unregister.promise;
    }

    unregister() {
        return this.session.unregister(this);
    }
}
