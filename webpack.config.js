module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  devServer: {
    static: "./dist",
    hot: true
  },
  resolve: {
    extensions:  [".js",".glsl"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(glsl|vs|fs)$/,
        type: "asset/source",
        generator: {
          filename: "assets/images/[hash][ext]",
        }
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader","css-loader"],
      }
    ]
  }
}