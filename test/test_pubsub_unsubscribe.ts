///////////////////////////////////////////////////////////////////////////////
//
//  AutobahnJS - http://autobahn.ws, http://wamp.ws
//
//  A JavaScript library for WAMP ("The Web Application Messaging Protocol").
//
//  Copyright (C) 2011-2014 Tavendo GmbH, http://tavendo.com
//  Copyright (C) 2016 Timo Dörr <timo@latecrew.de>
//
//  Licensed under the MIT License.
//  http://www.opensource.org/licenses/mit-license.php
//
///////////////////////////////////////////////////////////////////////////////

import * as autobahn from "../src/autobahn";
import * as testutil from "./testutil";
import * as when from "when";
import * as assert from "assert";

it('should unsubscribe a subscriber', function(done) {

    // testcase.expect(1);

    var test = new testutil.Testlog("test/test_pubsub_unsubscribe.txt");

    var dl = testutil.connect_n(2);

    when.all(dl).then(
        function(res) {
            test.log("all sessions connected");

            var session1 = res[0];
            var session2 = res[1];

            var payload = "Hello world!";

            function publish() {
                test.log("publishing to topic 'com.myapp.topic1': " + payload);
                session1.publish('com.myapp.topic1', [payload]);
            }

            var already_received = false;
            var sub;

            function onevent1(args) {
                test.log("Got event:", args[0]);
                if (already_received) {
                    assert(false, "Subscription callback invoced after calling unsubscribe");
                    done();
                    return;
                }
                already_received = true;

                test.log("Unsubscribing...");
                sub.then(function(subscription) {
                    var unsubscribe_finished = subscription.unsubscribe();

                    unsubscribe_finished.then(function() {
                        publish();
                        setTimeout(function() {
                            // nothing received after 250ms means we were successful unsubscribed
                            all_went_well();
                        }, 250);
                    });
                });
            }

            function all_went_well() {
                session1.leave();
                session2.leave();
                let chk = test.check();
                assert(!chk, chk);
                done();
            }

            setTimeout(publish, 250);
            sub = session2.subscribe('com.myapp.topic1', onevent1);
        },
        function(err) {
            test.log(err);
        }
    );
});
