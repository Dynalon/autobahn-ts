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

var pjson = require('../package.json');

import * as when from 'when';

import Transports from './transports';

//var fn = require("when/function");

if ('AUTOBAHN_DEBUG' in global && AUTOBAHN_DEBUG) {
   // https://github.com/cujojs/when/blob/master/docs/api.md#whenmonitor
   require('when/monitor/console');
   if ('console' in global) {
      console.log("AutobahnJS debug enabled");
   }
}

import * as util from './util';
import * as log from './log';
import * as session from './session/session';
export { default as Connection } from './connection';

var persona = require('./auth/persona.js');
var cra = require('./auth/cra.js');

exports.version = pjson.version;

exports.transports = Transports;

exports.Session = session.Session;
exports.Error = session.Error;
exports.Result = session.Result;

exports.auth_persona = persona.auth;
exports.auth_cra = cra;

// These are not really accessible from the outside
// (at least not their constructor functions should not be)

// exports.Invocation = session.Invocation;
// exports.Event = session.Event;
// exports.Subscription = session.Subscription;
// exports.Registration = session.Registration;
// exports.Publication = session.Publication;
// exports.log = log;

