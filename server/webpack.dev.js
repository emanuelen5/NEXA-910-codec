const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: "development",
    devtool: "eval",
    devServer: {
        host: "0.0.0.0",
        port: 5000,
        // public: 'http://localhost:5000',
        static: {
        	directory: path.join(__dirname, './.build'),
        	publicPath: '/',
        },
        proxy: {
            '/api': 'http://localhost:5001',
        }
    },
    plugins: [
        new webpack.EvalSourceMapDevToolPlugin({
            filename: '[name].[ext].map',
            exclude: [
                /node_modules/
            ]
        })
    ],
});
