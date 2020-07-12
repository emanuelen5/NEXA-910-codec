const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new HtmlWebpackPlugin({
      title: 'Website main entry point',
      // Load a custom template (lodash by default)
      template: './client/index.html'
    })
  ],
};
