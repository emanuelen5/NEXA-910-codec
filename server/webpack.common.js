const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './client/index.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: ['raw-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/.build',
        publicPath: '/',
        filename: '[name].js'
    },
    externals: {
        jquery: 'jQuery',
        bootstrap: 'bootstrap',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js{,.map}', to: 'js/[name].[ext]' },
                { from: 'node_modules/jquery/dist/jquery.min.*', to: 'js/[name].[ext]' },
                { from: 'node_modules/font-awesome/css/font-awesome.{css.map,min.css}', to: 'css/[name].[ext]' },
                { from: 'node_modules/font-awesome/fonts/*.woff2', to: 'fonts/[name].[ext]' },
                { from: './static/*', to: 'static/[name].[ext]' },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Website main entry point',
            // Load a custom template (lodash by default)
            template: './client/index.html'
        }),
        new HtmlWebpackTagsPlugin({
            links: ['css/font-awesome.min.css'],
        }),
        new HtmlWebpackTagsPlugin({
            append: false,
            scripts: ['js/jquery.min.js', 'js/bootstrap.bundle.min.js'],
        }),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['!index.html'],
        }),
    ],
};
