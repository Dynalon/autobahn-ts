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

import {Promise, Deferred} from "when";
import * as when from "when";

import Event from "./event";
import Session from "./session";

export interface SubscriptionHandler {
    // TODO find out which args are optional
    (args, kwargs, ed: Event): void;
}

export class Subscription {

    public topic: string;
    public handler: SubscriptionHandler;
    public options;
    public session: Session;
    public id: number;
    public active: boolean = true;

    public get on_unsubscribe(): Promise<any> {
        return this._on_unsubscribe.promise;
    }

    public _on_unsubscribe: Deferred<any>;

    constructor(topic: string, handler: SubscriptionHandler, options, session: Session, id: number) {

        this.topic = topic;
        this.handler = handler;
        this.options = options || {};
        this.session = session;
        this.id = id;

        // this will fire when the handler is unsubscribed
        this._on_unsubscribe = when.defer<any>();
    }

    unsubscribe() {
        return this.session.unsubscribe(this);
    }
}
