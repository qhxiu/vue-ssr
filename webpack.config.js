const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HTMLPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"',
      },
    }),
    new HTMLPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "[name]-aaa.[ext]",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks (chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'my-excluded-chunk';
      }
    }
  }
};

if (isDev) {
  config.module.rules.push({
    test: /\.styl/,
    use: [
      "vue-style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true,
        },
      },
      "stylus-loader",
    ],
  });
  config.devtool = "#cheap-module-eval-source-map";
  (config.devServer = {
    port: "8000",
    host: "0.0.0.0",
    overlay: {
      errors: true,
    },
    hot: true,
    // open: true,
    // historyFallback: {}
  }),
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    );
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.styl/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it uses publicPath in webpackOptions.output
          publicPath: './',
          hmr: process.env.NODE_ENV === 'development',
        },
      },
      'css-loader',
      { 
        loader: 'postcss-loader', 
        options: { sourceMap: true } 
      },
      'stylus-loader'
    ]
  });
  config.plugins.push(
    // 把css分离成一个文件
    new MiniCssExtractPlugin({
      filename: 'styles.[hash:8].[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, 
    }),
  )
}

module.exports = config;
