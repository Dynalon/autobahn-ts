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

import * as when from "when";
import * as autobahn from "../src/autobahn";
import { Promise } from "when";
import { Session} from "../src/autobahn";
/*
// fully qualified config
var config = {
   transports: [
      {
         type: 'websocket',
         url: 'ws://127.0.0.1:8080/ws',
         protocols: ['wamp.2.json']
      }
   ],
   realm: 'realm1'
}
*/

// shortcut config
export var config = {
    url: 'ws://127.0.0.1:8080/ws',
    realm: 'realm1'
}

export function connect_n(n): Array<Promise<Session>> {
    var dl = [];
    for (var i = 0; i < n; ++i) {
        (function(idx) {
            var d = when.defer();
            var connection = new autobahn.Connection(config);

            connection.onopen = function(session) {
                d.resolve(session);
            };

            connection.open();

            dl.push(d.promise);
        })(i);
    }
    return dl;
}


export var Testlog = function(filename) {

    var self = this;

    self._filename = filename;
    self._log = [];
};


Testlog.prototype.log = function() {

    var self = this;

    //console.log.apply(this, arguments);
    self._log.push(arguments);
};


Testlog.prototype.stringify = function() {

    var self = this;

    var s = '';
    for (var i = 0; i < self._log.length; ++i) {
        s += i;
        let args = self._log[i];
        for (let arg in args) {

            // stringify with dict attributes ordered
            s += ' ' + self.stringifyWithOrderedKeys(args[arg]);
            //s += ' ' + JSON.stringify(args[arg]);
        }
        s += "\n";
    }
    return s;
};

Testlog.prototype.stringifyWithOrderedKeys = function(arg) {
    var self = this;
    if (arg != null && typeof (arg) == "object") {
        var clazz = Object.prototype.toString.call(arg).toLowerCase();
        if (clazz.indexOf("array") != -1) {
            var retval = "[";
            for (var i = 0; i < arg.length; i++) {
                if (i > 0) retval += ',';
                retval += self.stringifyWithOrderedKeys(arg[i]);
            }
            retval += "]";
            return retval;
        } else {
            var retval = "{";
            var keys = Object.keys(arg).sort();
            for (var i = 0; i < keys.length; i++) {
                if (i > 0) retval += ',';
                retval += '"' + keys[i] + '":' + self.stringifyWithOrderedKeys(arg[keys[i]]);
            }
            retval += "}";
            return retval;
        }
    } else {
        return JSON.stringify(arg);
    }
};


Testlog.prototype.check = function() {

    var self = this;
    var slog = self.stringify();

    if (global === undefined) {
        // running in browser, fetch log via synchronous ajax
        let xhr = new XMLHttpRequest();
        xhr.open("GET", self._filename, false);
        xhr.send(null);
        let slog_baseline = xhr.responseText;
        if (slog != slog_baseline) {
            return "\nExpected:\n\n" + slog_baseline + "\n\n\nGot:\n\n" + slog + "\n\n";
        } else {
            return null;
        }
    } else {
        // running in node, use fs module
        let fs = require("fs");
        if (fs.existsSync(self._filename)) {
            let slog_baseline = fs.readFileSync(self._filename);
            if (slog != slog_baseline) {
                return "\nExpected:\n\n" + slog_baseline + "\n\n\nGot:\n\n" + slog + "\n\n";
            } else {
                return null;
            }
        } else {
            fs.writeFileSync(self._filename, slog);
            console.log("Know-good log file created", self._filename, slog.length);
            return null;
        }
    }
}


