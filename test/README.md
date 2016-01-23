# Tests for AutobahnJS functionality

Tests run using NodeJS and in the browser using the mocha unittesting framework.

For both setups, ensure that a Crossbar instance using the crossbar_testserver config in the
project root folder is running on localhost:8080 .

# Testing with NodeJS

Open a terminal and run `npm test` (after having run npm install of course).
(this will perform npm run build-test and npm run run-test).

# Testing in the browser

Build the tests:

    npm run build-test

Start a webserver (i.e. http-server, npm install -g http-server) in the test/ directory:

    http-server -c-1 -p 10102

Point your browser at `http://localhost:10102/browser/index.html` to run the tests
