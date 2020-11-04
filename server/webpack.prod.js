const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "production",
    devtool: "none",
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Website main entry point',
            // Load a custom template (lodash by default)
            template: './client/index.html'
        }),
    ],
});
