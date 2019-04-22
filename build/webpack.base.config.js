const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDev = process.env.NODE_ENV === 'development'


const config = {
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname,'../dist'),
    publicPath: '/public/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash:8].css',
    }),
    new webpack.IgnorePlugin(/\.\/locale/,/moment/),
    new webpack.DefinePlugin({
      //'process.env.API_BASE': isDev ? '"http://127.0.0.1:3000"':'"http://127.0.0.1:3000"'    //这里网址修改为本站域名
      'process.env.API_BASE': '"http://127.0.0.1:3000"'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(m?js|jsx)$/,
        exclude: /node_module/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env',"@babel/preset-react"],
            plugins: [ ["import", {"libraryName":"antd","libraryDirectory":'es',"style":"css"}],["@babel/plugin-proposal-decorators", { "legacy": true }],["@babel/plugin-proposal-class-properties", { "loose": true }],"@babel/plugin-transform-runtime",'react-hot-loader/babel']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(jpg|png|gif|woff|svg|eot|ttf)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 2
          }
        }
      },

    ]
  },
  resolve: {
    extensions: ['.js','.jsx','json'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
}


module.exports = config
