const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  entry: './client/index.js',
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
  plugins: [
	new CopyWebpackPlugin({
	  patterns: [
		{ from: 'node_modules/bootstrap/dist/css', to: 'css/'},
	  ],
    }),
    new HtmlWebpackPlugin({
      title: 'Website main entry point',
      // Load a custom template (lodash by default)
      template: './client/index.html'
    }),
	new HtmlWebpackTagsPlugin({
      links: ['css/bootstrap.min.css']
    }),
  ],
};
