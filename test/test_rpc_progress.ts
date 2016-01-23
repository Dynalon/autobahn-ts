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

import * as autobahn from "../src/autobahn";
import * as testutil from "./testutil";
import * as when from "when";
import * as assert from "assert";

it('submits progress on RPC calls', function(done) {

    // TODO decrease this tests overall runtime so we don't need the timeout
    this.timeout(25000);

    var test = new testutil.Testlog("test/test_rpc_progress.txt");

    var connection = new autobahn.Connection(testutil.config);

    connection.onopen = function(session) {

        test.log('Connected');

        function longop(args, kwargs, details) {

            test.log("longop()", args, kwargs);

            var n = args[0];
            var interval_id = null;

            if (details.progress) {
                var i = 0;
                details.progress([i]);
                i += 1;
                interval_id = setInterval(function() {
                    if (i < n) {
                        test.log("longop() - progress", i);
                        details.progress([i]);
                        i += 1;
                    } else {
                        clearInterval(interval_id);
                    }
                }, 100);
            }

            var d = when.defer();

            setTimeout(function() {
                d.resolve(n);
            }, 1000 * n);

            return d.promise;
        }

        var endpoints = {
            'com.myapp.longop': longop
        };

        var pl1 = [];

        for (var uri in endpoints) {
            pl1.push(session.register(uri, endpoints[uri]));
        }

        when.all(pl1).then(
            function() {
                test.log("All registered.");

                var pl2 = [];

                pl2.push(session.call('com.myapp.longop', [3], {}, { receive_progress: true }).then(
                    function(res) {
                        test.log("Final:", res);
                    },
                    function(err) {
                        test.log("Error:", err);
                    },
                    function(progress) {
                        test.log("Progress:", progress);
                    }
                ));

                when.all(pl2).then(function() {
                    test.log("All finished.");
                    connection.close();

                    var chk = test.check()
                    assert(!chk, chk);
                    done();
                });
            },
            function() {
                test.log("Registration failed!", arguments);
            }
        );
    };

    connection.open();
});
