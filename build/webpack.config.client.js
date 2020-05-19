const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'
const defaultPlugin = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  }),
  new VueClientPlugin()
]

let config
const devServer = {
  port: 8002,
  host: '0.0.0.0',
  overlay: {
    errors: false
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: {
    index: '/public/index.html'
  },
  proxy: {
    '/api': 'http://127.0.0.1:3332/',
    '/user': 'http://127.0.0.1:3332/'
  },
  hot: true
  // open: true,
  // historyFallback: {}
}
if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugin.concat([
      new webpack.HotModuleReplacementPlugin()
      // new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/client-entry.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: '/public/'
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
    plugins: defaultPlugin.concat([
      // 把css分离成一个文件
      new MiniCssExtractPlugin({
        filename: '[name]-styles.[hash:8].css'
      })
    ])
  })
}

config.resolve = {
  alias: {
    model: path.join(__dirname, '../client/model/client-model.js')
  }
}

module.exports = config
