module.exports = {
    entry: 'mocha!../../dist/test/test_mocha.js',
    output: {
        path: __dirname,
        filename: 'tests.js'
    },
    // what modules should not be included but be considered 'external' to the bundle.
    // If the modules that are external are not surrounded in a try/catch and the modules are not
    // available during runtime, the loading will fail.
    externals: {
        'net': true,
        'fs': true
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
