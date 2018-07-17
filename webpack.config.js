const path = require('path');

var webpack = require("webpack");

// TODO: proxy static pages directly from webflow
// https://github.com/chimurai/http-proxy-middleware

// see http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/
// for future multi entry config
module.exports = {

  mode: "development",

  watch: true,

  // collections of files that should be concatenated to produce a single
  // entry file as end result
  entry: {
    dashboard: [
      "./src/dashboard/index.js",
      "./src/reamaze.js",
    ],
    payment: "./src/payment-provider.js",
    session: "./src/session.js"
  },

  // dont let dependen tmoduels include it in the runtime
  // since it is provided by webflow
  externals: {
    jquery: 'jQuery'
  },

  // where files should be output
  output: {
    path: __dirname + "/dist",
    publicPath: "/dist/",
    filename: "[name]-bundle.js"
  },

  // config of dev server
  serve: {
    contentBase: __dirname,
    compress: true,
    port: 9000,
    // host: "dev.troovebird.com",
    // openPath: "dev.troovebird.com/privatesale",
    // mode: "development"
  }
}
