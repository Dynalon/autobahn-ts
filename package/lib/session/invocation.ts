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

export default class Invocation {

    public caller;
    public progress;
    public procedure;

    constructor(caller, progress, procedure) {

        this.caller = caller;
        this.progress = progress;
        this.procedure = procedure;
    }
}
