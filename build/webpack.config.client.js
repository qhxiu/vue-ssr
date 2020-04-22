const path = require("path");
const webpack = require("webpack");
// 合并webpack配置
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const baseConfig = require("./webpack.config.base");
const createVueLoaderOptions = require("./vue-loader.config");

const isDev = process.env.NODE_ENV === "development";
const defaultPlugin = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: isDev ? '"development"' : '"production"',
    },
  }),
  new HTMLPlugin(),
];

let config;
const devServer = {
  port: "8000",
  host: "0.0.0.0",
  overlay: {
    errors: true,
  },
  hot: true,
  // open: true,
  // historyFallback: {}
};
if (isDev) {
  config = merge(baseConfig, {
    devtool: "#cheap-module-eval-source-map",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "vue-style-loader",
            {
              loader: "css-loader",
              options: {
                // 开启 CSS Modules
                modules: true,
                // 自定义生成的类名
                localIdentName: "[local]_[hash:base64:8]",
              },
            },
          ],
        },
        {
          test: /\.styl/,
          use: [
            "vue-style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  mode: 'local',
                  auto: true,
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
              },
            },
            "stylus-loader",
          ],
        },
      ],
    },
    devServer,
    plugins: defaultPlugin.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]),
  });
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, "../client/index.js"),
      vendor: ["vue"],
    },
    output: {
      filename: "[name].[hash].js",
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "./",
                hmr: process.env.NODE_ENV === "development",
              },
            },
            "css-loader",
            {
              loader: "postcss-loader",
              options: { sourceMap: true },
            },
            "stylus-loader",
          ],
        },
      ],
    },
    plugins: defaultPlugin.concat([
      // 把css分离成一个文件
      new MiniCssExtractPlugin({
        filename: "styles.[hash].css",
        chunkFilename: "[id].css",
        ignoreOrder: false,
      }),
    ]),
  });
}

module.exports = config;
