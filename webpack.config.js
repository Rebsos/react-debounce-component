var path = require('path');

module.exports = {
  entry: './src/debounce.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        exclude: /(node_modules)/,
        use: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: 'debounce.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: 'react',
  }
}
