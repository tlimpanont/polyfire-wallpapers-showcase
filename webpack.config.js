var webpack = require('webpack');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var config = {
    entry: './src/index.ts',
    output: {
        filename: './dist/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, loader: 'ts-loader'}
        ]
    },
    plugins: [
        new LiveReloadPlugin({})
    ],
    devtool: 'source-map',
    devServer: {
        hot: true
    }
};
module.exports = config;
