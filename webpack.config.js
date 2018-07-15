// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

// see http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/
// for future multi entry config
module.exports = {
  entry: {
    dashboard: [
      "./src/dashboard/index.js",
      "./src/reamaze.js",
    ],
    payment: "./src/payment-provider.js",
    session: "./src/session.js"
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/dist/",
    filename: "[name]-bundle.js"
  },
}
