const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ConcatPlugin = require('@mcler/webpack-concat-plugin');
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  /// background script
  entry: {
    background: "./src/background.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"
  },
  plugins: [
    /// content scripts
    new ConcatPlugin({
      name: 'index',
      outputPath: './',
      fileName: '[name].js',
      filesToConcat: [
        "./src/configs.js",
        "./src/index.js",
      ]
    }),
    /// static files
    new CopyPlugin({
      patterns: [
        "src/index.css",
        { from: "src/_locales", to: "_locales" },
        { from: "assets", to: "assets" },
        { from: "src/options", to: "options" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/configs.js", to: "configs.js" },
      ],
    }),
  ],
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), 
      new CssMinimizerPlugin(),
      new JsonMinimizerPlugin(),
    ],
  },
};