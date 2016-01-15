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


let _Factory;

// Test below used to be via the 'window' object in the browser.
// This fails when running in a Web worker.
//
// running in Node.js
//
if (global.process && global.process.versions.node) {
    try {
        _Factory = require("./websocket-node").Factory;
    }
    catch (err) {}
} else {
    try {
        _Factory = require("./websocket-browser").Factory;
    }
    catch (err) {}
}

if (!_Factory) {
    throw "No WebSocket implementation could be loaded!";
}

export var Factory = _Factory;
