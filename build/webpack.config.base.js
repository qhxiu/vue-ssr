const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'
const config = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: path.join(__dirname, '../client/client-entry.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../public'),
    publicPath: 'http://127.0.0.1:8002/public/'
  },
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.(js|jsx|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules'),
        include: path.join(__dirname, 'client'),
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.css/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg|ttf|woff)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'resouces/[path][name]-[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
