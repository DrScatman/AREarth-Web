module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(glb|obj|mtl)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "models"
                    }
                }
            ]
        }
    },
    publicPath: process.env.NODE_ENV === "production" ? "/~darre/Extended-Reality-Gallery/final/" : "/",
}
