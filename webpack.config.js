// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

// see http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/
// for future multi entry config
module.exports = {
  entry: {
    dashboard: [
      "./src/util.js",
      "./src/dashboard/referrer.js",
      "./src/dashboard/ui.js",
      "./src/dashboard/components/dialogs.js",
      "./src/dashboard/components/template.js",
      "./src/dashboard/components/balance.js",
      "./src/dashboard/components/calculator.js",
      "./src/dashboard/components/supply.js",
      "./src/dashboard/db.js",
      // "./src/dashboard/business.js",
      "./src/dashboard/index.js",
      "./src/reamaze.js",
    ],
    payment: "./src/payment-provider.js",
    // common: "./src/base.js"
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/dist/",
    filename: "[name]-bundle.js"
  },
}
