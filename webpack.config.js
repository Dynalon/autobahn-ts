var path = require('path');

module.exports = {
    entry: 'src/autobahn.js',
    resolve: {
        root: path.resolve('./dist/'),
        extensions: ['', '.json', '.js']
    },
    output: {
        path: __dirname + '/dist/browser/',
        filename: 'autobahn.js'
    },
    externals: {
        "src/transport/rawsocket": true,
        "src/transport/websocket/websocket-node": true,
        "./transport/rawsocket": true,
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
