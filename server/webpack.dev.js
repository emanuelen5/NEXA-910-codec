const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "development",
    devtool: false,
    devServer: {
        contentBase: './.build',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Website main entry point',
            // Load a custom template (lodash by default)
            template: './client/index.html',
            
        }),
    ],
});
