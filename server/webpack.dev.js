const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
    return merge(common(env, true), {
        mode: "development",
        devtool: false,
        devServer: {
            contentBase: './.build',
        },
        plugins: [
            new webpack.EvalSourceMapDevToolPlugin({
                filename: '[name].[ext].map',
                exclude: [
                    /node_modules/
                ]
            }),
        ],
    });
};
