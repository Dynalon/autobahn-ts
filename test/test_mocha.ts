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

import * as autobahn from '../src/autobahn';

// increase timeout as we have some long running setTimeout() mocks
// will only affect browsers; we set this in mocha.opts
if (typeof mocha !== 'undefined' && mocha.setup) {
    (mocha as any).setup({ timeout: 10000 });
}

describe('Connection', () => {
    require('./test_connect');
});

describe('RPC', () => {
    require('./test_rpc_complex');
    require('./test_rpc_arguments');
    require('./test_rpc_error');
    require('./test_rpc_options');
    require('./test_rpc_progress');
    require('./test_rpc_slowsquare');
    require('./test_rpc_routing');
    require('./test_rpc_caller_disclose_me');
});

describe('PubSub', () => {
    require('./test_pubsub_basic.js');
    require('./test_pubsub_unsubscribe.js');
    require('./test_pubsub_complex.js');
    require('./test_pubsub_options.js');
    require('./test_pubsub_excludeme.js');
    require('./test_pubsub_exclude.js');
    require('./test_pubsub_eligible.js');
    require('./test_pubsub_prefix_sub.js');
    require('./test_pubsub_wildcard_sub.js');
    require('./test_pubsub_publisher_disclose_me.js');
});
