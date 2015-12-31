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

export default class Event {

    public publication;
    public publisher;
    public topic: string;

    constructor(publication, publisher, topic: string) {
        this.publication = publication;
        this.publisher = publisher;
        this.topic = topic;
    }
}
