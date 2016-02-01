var path = require('path');

module.exports = {
    entry: 'src/autobahn.js',
    resolve: {
        root: path.resolve('./dist/'),
        extensions: ['', '.json', '.js']
    },
    output: {
        path: __dirname + '/dist/browser/',
        filename: 'autobahn.js',

        // will be the global variable that the autobahn.js file exports to
        library: 'autobahn',
        libraryTarget: 'var'
    },
    externals: {
        // This *has* to exactly match the string as used in the require() statement including
        // the leading .
        "./transport/rawsocket": true,
        "./websocket-node": true,
        'net': true,
        'fs': true,
        'ws': true,
        'crypto-js': true,
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
};
