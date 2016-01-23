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

Start crossbar with the crossbar_testserver configuration in the root of this project,
which will not only start the required crossbar broker instance, but also a static
webserver that serves the tests html files.

Then point your browser at `http://localhost:8080/browser/` to run the tests

**IMPORTANT NOTE:** When running in the browser, do not hide the tab or windows the tests
run in. Hiding the tab will mess with the setTimeout() timers resolution (min resolution will be 1000ms)
and might produce wrong tests result. Leave the tab open and visisble to avoid this.
