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

it('should route RPC requests', function(done) {

    // testcase.expect(3);

    var test = new testutil.Testlog("test/test_rpc_routing.txt");

    var dl = testutil.connect_n(2);

    when.all(dl).then(
        function(res) {
            test.log("all sessions connected");

            var session1 = res[0];
            var session2 = res[1];

            function square(args, kwargs, details) {
                var x = args[0];
                test.log("square() called from session 2", x);
                assert(details.caller == session2.id);
                return x * x;
            }

            session1.register('com.math.square', square).then(
                function(res) {

                    test.log("square() registered on session 1");

                    session2.call('com.math.square', [23], {}, { disclose_me: true }).then(
                        function(res) {
                            test.log("result:", res);

                            session1.leave();
                            session2.leave();

                            assert(res == (23 * 23));

                            var chk = test.check()
                            assert.ok(!chk, chk);

                            done();
                        })
                }
            );
        },
        function(err) {
            test.log(err);
        }
    );
});
