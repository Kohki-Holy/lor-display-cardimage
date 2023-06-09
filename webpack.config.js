const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    content_scripts: path.join(__dirname, "src/content_scripts.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "../src", 
          to: "../dist",
          context: "public",
          globOptions: {
            ignore: ["**/*.ts"],
          }
        }
      ]
    })
  ],
  devtool: 'cheap-module-source-map',
  cache: true,
  watchOptions:{
    poll: true,
  }
};
