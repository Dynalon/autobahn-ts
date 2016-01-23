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

// Tests "exclude" option on publication.

import * as autobahn from "../src/autobahn";
import * as testutil from "./testutil";
import * as when from "when";
import * as assert from "assert";

it('should exclude subscriptions', function(done) {

    // testcase.expect(4);

    var test = new testutil.Testlog("test/test_pubsub_exclude.txt");

    var dl = testutil.connect_n(3);

    var delay = 100;

    when.all(dl).then(
        function(res) {
            test.log("all sessions connected");

            var session1 = res[0];
            var session2 = res[1];
            var session3 = res[2];

            // cleans up after test
            function onTestFinished() {

                session1.leave();
                session2.leave();
                session3.leave();

                var chk = test.check()
                assert(!chk, chk);

                done();
            }

            // Case 1: "exclude" unset
            //
            // Expected:
            //    - both session2 and session3 receive events

            function case1() {
                test.log("");
                test.log("Case 1: 'exclude' unset");
                test.log("===========================");

                var counter = 0;

                var t1 = setInterval(function() {
                    session1.publish('com.myapp.topic1', [counter]);
                    counter += 1;
                }, delay);

                var received2 = 0;
                var received3 = 0;

                var session2Finished = when.defer();
                var session3Finished = when.defer();
                var testLog2 = [];
                var testLog3 = [];


                function onevent2(args) {
                    testLog2.push("Session 2 got event: " + args[0]);

                    received2 += 1;
                    if (received2 > 5) {
                        session2Finished.resolve(true);
                    }
                }

                function onevent3(args) {
                    testLog3.push("Session 3 got event: " + args[0]);

                    received3 += 1;
                    if (received3 > 5) {
                        session3Finished.resolve(true);
                    }
                }

                when.all([session2Finished.promise, session3Finished.promise]).then(function() {

                    clearInterval(t1);

                    assert(true, "Case 1: Both clients received events");

                    // write the log
                    var logs = [testLog2, testLog3];
                    logs.forEach(function(log) {
                        test.log("-----------")
                        log.forEach(function(line) {
                            test.log(line);
                        })
                        test.log("----------");
                    })

                    case2();
                });

                // both sessions subscribe
                session2.subscribe('com.myapp.topic1', onevent2);
                session3.subscribe('com.myapp.topic1', onevent3);

            }



            // Case 2: "exclude" session 2
            //
            // Expected:
            //    - session3 receives events

            function case2() {
                test.log("");
                test.log("Case 2: 'exclude' session2 ");
                test.log("===========================");

                var counter = 0;

                var t2 = setInterval(function() {
                    session1.publish('com.myapp.topic2', [counter], {}, { exclude: [session2.id] });
                    counter += 1;
                }, delay);

                var received3 = 0;
                var session2Received = false;

                // Should not be called
                function onevent2(args) {
                    session2Received = true;
                    test.log("Session 2 got event even though it should have been excluded.");
                }

                // Should be called
                function onevent3(args) {
                    // console.log("case 2 started - 3");
                    test.log("Session 3 got event:", args[0]);

                    received3 += 1;
                    if (received3 > 5) {
                        test.log("");
                        test.log("");
                        test.log("");

                        clearInterval(t2);

                        if (!session2Received) {
                            assert(true, "Case 2: Session 2 did not receive any events!");
                        } else {
                            assert(false, "Case 2: Session 2 received one or more events!");
                        }

                        case3();
                    }
                }

                // both sessions subscribe
                session2.subscribe('com.myapp.topic2', onevent2);
                session3.subscribe('com.myapp.topic2', onevent3);

            }



            // Case 3: "exclude" both session 2 and session 3
            //
            // Expected:
            //    - neither receives events

            function case3() {
                test.log("");
                test.log("Case 3: 'exclude' sessions 2 and 3");
                test.log("==================================");

                var counter = 0;

                var t3 = setInterval(function() {
                    session1.publish('com.myapp.topic3', [counter], {}, { exclude: [session2.id, session3.id] });
                    counter += 1;

                    if (counter > 5) {
                        session1.publish('com.myapp.topic3', [counter]);
                        clearInterval(t3);
                    }
                }, delay);


                var received2 = 0;
                var received3 = 0;

                var session2Finished = when.defer();
                var session3Finished = when.defer();

                var testLog2 = [];
                var testLog3 = [];


                function onevent2(args) {
                    received2 += 1;

                    // testLog2.push("Session 2 got stopper event");
                    session2Finished.resolve(true);
                }

                function onevent3(args) {
                    received3 += 1;

                    // testLog3.push("Session 3 got stopper event");
                    session3Finished.resolve(true);
                }

                when.all([session2Finished.promise, session3Finished.promise]).then(function() {

                    // clearInterval(t3);

                    assert(received2 === 1 && received3 === 1, "Case 3: Both clients received final event");

                    onTestFinished();
                });

                // both sessions subscribe
                session2.subscribe('com.myapp.topic3', onevent2);
                session3.subscribe('com.myapp.topic3', onevent3);


            }

            case1();


        },
        function(err) {
            console.log("connections failed");
            test.log(err);
        }
    );
});
