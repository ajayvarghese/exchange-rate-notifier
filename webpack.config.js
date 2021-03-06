const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "public/template.html",
    favicon: "public/favicon.ico",
  }),
  new CleanWebpackPlugin(),
  new CopyPlugin([
    { from: "images", to: "images" },
    { from: "public/manifest.json", to: "manifest.json" },
  ]),
  new InjectManifest({
    swSrc: "./public/serviceWorker.js",
    swDest: "serviceWorker.js",
  }),
  new webpack.DefinePlugin({
    PROD: JSON.stringify(process.env.NODE_ENV === "production"),
  }),
];

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.js",
  output: {
    filename: "[name]-[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.html$/, use: ["html-loader"] }],
  },
  devServer: {
    contentBase: "./dist",
    compress: true,
    port: 3002,
    stats: "errors-only",
    open: true,
    hot: true,
  },
  plugins,
};
