const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const smart = require('webpack-merge').smart
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const cdnConfig = require('../app.config').cdn




const isDev = process.env.NODE_ENV === 'development'


const config = {
  entry: {
    app: path.resolve(__dirname,'../client/client-entry.js')
  },
  output: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'../client/template.html'),
      filename: 'template.html'
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.resolve(__dirname,'../client/server.template.ejs'),
      filename: 'server.template.ejs'
    }),
    new CleanWebpackPlugin()
  ]
}

if (isDev) {
  config.devServer = {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    contentBase: './dist/',
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/template.html',
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  config.output.publicPath = cdnConfig.host
}

module.exports = smart(baseConfig,config)

