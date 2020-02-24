// Inside webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/app.html"
        }),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.png$/,
                loader: "file-loader",
                options: {
                    outputPath: "images"
                }
            },
            {
                test: /\.(glb|obj|mtl)$/,
                loader: "file-loader",
                options: {
                    outputPath: "models"
                }
            }
        ]
    }
};
