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

export default class Error {

    public error;
    public args: Array<any>;
    public kwargs: Object;

    constructor(error, args?: Array<any>, kwargs?: Object) {
        this.error = error;
        this.args = args || [];
        this.kwargs = kwargs || {};
    }
}
