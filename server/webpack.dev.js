const webpack = require('webpack');
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
        new CopyWebpackPlugin({
            patterns: [
                { from: 'livereload.js', to: '[name].[ext]'},
            ],
        }),
        new webpack.EvalSourceMapDevToolPlugin({
            filename: '[name].[ext].map',
            exclude: [
                /node_modules/
            ]
        }),
        new HtmlWebpackTagsPlugin({
            append: false,
            scripts: ['livereload.js'],
        }),
    ],
});
