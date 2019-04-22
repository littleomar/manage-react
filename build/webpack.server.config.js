const path = require('path')
const smart = require('webpack-merge')
const webpack = require('webpack')


const baseConfig = require('./webpack.base.config')


const config = {
  target: 'node',
  entry: path.resolve(__dirname,'../client/server-entry.js'),
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname,'../dist'),
    libraryTarget: 'commonjs2'
  }
}


module.exports = smart(baseConfig,config)
