"use strict";

import dotenv from "dotenv";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import validate from "webpack-validator";
dotenv.config();

const PATHS = {
  app: path.join(__dirname, "app"),
  data: path.join(__dirname, "data"),
  build: path.join(__dirname, "public")
};

const config = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: "[name].js"
  },
  plugins: [
    new CleanWebpackPlugin([PATHS.build], {
      root: process.cwd()
    }),
    new HtmlWebpackPlugin({
      title: "Quartermaster Journal",
      template: "./app/index.html.template"
    })
  ],
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ["babel?cacheDirectory"],
        include: PATHS.app
      },
      {
        test: /\.json$/,
        loaders: ["json"],
        include: PATHS.data
      }
    ]
  },
  devtool: "eval-source-map",
  devServer: {
    historyApiFallback: true,
    stats: "errors-only",
    host: process.env.HOST,
    port: process.env.PORT
  }
};

module.exports = validate(config);
