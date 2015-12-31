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
////////////////////////////////////////////////////////////////////////////

// WAMP "Advanced Profile" support in AutobahnJS per role
//
export default {
   caller: {
      features: {
         caller_identification: true,
         //call_timeout: true,
         //call_canceling: true,
         progressive_call_results: true
      }
   },
   callee: {
      features: {
         caller_identification: true,
         //call_trustlevels: true,
         pattern_based_registration: true,
         shared_registration: true,
         //call_timeout: true,
         //call_canceling: true,
         progressive_call_results: true,
         registration_revocation: true
      }
   },
   publisher: {
      features: {
         publisher_identification: true,
         subscriber_blackwhite_listing: true,
         publisher_exclusion: true
      }
   },
   subscriber: {
      features: {
         publisher_identification: true,
         //publication_trustlevels: true,
         pattern_based_subscription: true,
         subscription_revocation: true
         //event_history: true,
      }
   }
};
