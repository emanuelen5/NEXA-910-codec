const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  entry: './client/index.js',
  mode: "development",
  devtool: "eval-source-map",
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
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/.build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './.build'
  },
  externals: {
    jquery: 'jQuery',
    bootstrap: 'bootstrap',
  },
  plugins: [
	new CopyWebpackPlugin({
	  patterns: [
		{ from: 'node_modules/bootstrap/dist/css', to: 'css/'},
		{ from: 'node_modules/bootstrap/dist/js/', to: 'js/'},
		{ from: 'node_modules/jquery/dist/', to: 'js/'},
	  ],
    }),
    new HtmlWebpackPlugin({
      title: 'Website main entry point',
      // Load a custom template (lodash by default)
      template: './client/index.html'
    }),
	new HtmlWebpackTagsPlugin({
      links: ['css/bootstrap.min.css'],
	}),
	new HtmlWebpackTagsPlugin({
	  append: false,
	  scripts: ['js/jquery.min.js', 'js/bootstrap.bundle.min.js'],
    }),
  ],
};
