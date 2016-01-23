///////////////////////////////////////////////////////////////////////////////
//
//  AutobahnJS - http://autobahn.ws, http://wamp.ws
//
//  A JavaScript library for WAMP ("The Web Application Messaging Protocol").
//
//  Copyright (C) 2011-2015 Tavendo GmbH, http://tavendo.com
//
//  Licensed under the MIT License.
//  http://www.opensource.org/licenses/mit-license.php
//
///////////////////////////////////////////////////////////////////////////////


import * as testutil from "./testutil";
import * as when from "when";
import * as assert from "assert";
import * as autobahn from "../src/autobahn";
import { Session } from "../src/autobahn";

it('should connect with 10 clients and leave the session afterwards', function(done) {

    var test = new testutil.Testlog("test/test_connect.txt");
    var N = 10;

    test.log("connecting " + N + " sessions ...");

    var dl = testutil.connect_n(N);

    when.all(dl).then(
        function(sessions: Array<Session>) {
            test.log("all " + sessions.length + " sessions connected");

            for (var i = 0; i < sessions.length; ++i) {
                test.log("leaving session " + i);
                sessions[i].leave();
            }

            var chk = test.check();
            assert(chk === null, chk);
            done();
        },
        function(err) {
            test.log(err);
            assert(false, "Could not connect all clients");
            done();
        }
    );
});
