const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.glsl$/,
        loader: "webpack-glsl-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "public/assets", to: "assets" }],
    }),
  ],
  devServer: {
    compress: true,
    port: 8080,
    host: "localhost",
    hot: true,
    allowedHosts: "all"
  },
};
