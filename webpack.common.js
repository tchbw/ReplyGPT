const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => {
  return {
    entry: {
      index: "./src/index.ts",
      twitter: "./src/twitter.ts",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.tsx?$/,
          loader: "esbuild-loader",
          exclude: path.join(__dirname, "node_modules"),
          options: {
            loader: "ts",
          },
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/icons/icon-*.png",
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "manifest.json",
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
    ],
  };
};
