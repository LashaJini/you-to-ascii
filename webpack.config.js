const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = (env, arg) => {
  const outDir = "build";
  const PORT = 3000;

  return {
    entry: "./www/index",
    output: {
      path: path.join(__dirname, outDir),
      filename: "[name].bundle.js",
      publicPath: "/",
    },
    devServer: {
      contentBase: path.join(__dirname, "static"),
      contentBasePublicPath: "/static",
      port: PORT,
      compress: true,
    },
    devtool: "source-map",
    resolve: {
      extensions: [".js"],
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
          include: /\.module\.css$/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
          exclude: /\.module\.css$/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Create `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(jpe?g|png|gif|glb|gltf)$/,
          use: ["file-loader"],
        },
        {
          test: /\.(csv)$/,
          use: ["file-loader"],
        },
        {
          test: /\.(mp3|wav|mp4|webm)$/,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./www/public/index.html",
      }),
      new MiniCssExtractPlugin(),
    ],
  };
};

module.exports = config;
