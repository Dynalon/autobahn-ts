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

// Polyfills for <= IE9
require('./polyfill.js');

if ('AUTOBAHN_DEBUG' in global && AUTOBAHN_DEBUG) {
   // https://github.com/cujojs/when/blob/master/docs/api.md#whenmonitor
   require('when/monitor/console');
   if ('console' in global) {
      console.log("AutobahnJS debug enabled");
   }
}

var pjson = require('../package.json');
export var version = pjson.version;
export { default as Connection } from './connection';
export { default as transports } from './transports';
export { default as Session } from './session/session';
export { default as Result } from './session/result';
export { default as Error } from './session/error';


var persona = require('./auth/persona.js');
var cra = require('./auth/cra.js');

export var auth_persona = persona.auth;
export var auth_cra = cra;

// These are not really accessible from the outside
// (at least not their constructor functions should not be)

// exports.Invocation = session.Invocation;
// exports.Event = session.Event;
// exports.Subscription = session.Subscription;
// exports.Registration = session.Registration;
// exports.Publication = session.Publication;
// exports.log = log;

