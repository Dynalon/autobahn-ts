var path = require('path');
// TODO: browsers tests with actual autobahn.js bundled by the build tool
// (not identic copy)
module.exports = {
    target: 'web',
    entry: 'src/autobahn-browser.js',
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
        'net': true,
        'fs': true,
        'ws': true,
        'crypto-js': true,

        // HACK to make webpack happy - we don't include these at all for
        // browser builds
        'nonexistingmodule': true,
        './transport/rawsocket': 'nonexistingmodule',
        './websocket-node': 'nonexistingmodule',
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
