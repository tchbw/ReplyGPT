const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => {
  return {
    entry: {
      twitter: "./src/twitter.ts",
      options: "./src/options.tsx",
      background: "./src/background.ts",
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
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunks: ["options"],
        filename: "./options.html",
        templateContent: `
          <html>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/icons/icon*.png",
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/popup.html",
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src/"), // added this
      },
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    },
  };
};
