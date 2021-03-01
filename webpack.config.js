const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    // double check the routes
    entry: "./public/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    // this will need to be changed to production later
    mode: "development",
    plugins: [new WebpackPwaManifest({
        filename: "manifest.json",
        fingerprints: false,
        inject: false,
        name: "Budget Tracker",
        shortname: "Budget Tracker",
        theme_color: "",
        background_color: "",
        start_url: "/",
        display: "standalone",
        icons: [{
            src: path.resolve("./public/icons/icon-512x512.png"),
            sizes: [72, 96, 128, 144, 152, 192, 384, 512]
        }]
    })]
};

module.exports = config;