const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {Regulator: './app/javascripts/Regulator.js',
          Operator: './app/javascripts/Operator.js',
          Vehicle: './app/javascripts/Vehicle.js',
          ExitTollBooth: './app/javascripts/ExitTollBooth.js'
  }, 
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].app.js"
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/Regulator.html', to: "Regulator.html" }
    ]),new CopyWebpackPlugin([
      { from: './app/Operator.html', to: "Operator.html" }
    ]),new CopyWebpackPlugin([
      { from: './app/Vehicle.html', to: "Vehicle.html" }
    ]),new CopyWebpackPlugin([
      { from: './app/ExitTollBooth.html', to: "ExitTollBooth.html" }
    ])

  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  devServer: {
    host: '127.0.0.1',
    port: 8000
  }
}
