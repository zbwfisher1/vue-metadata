'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

var target = 'http://172.17.170.212:8110';

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/search': {
                target
            },
            '/login': {
                target
            },
            '/api': {
                target
            },
            '/tree': {
                target
            },
            '/authenticate': {
                target
            },
            '/logout': {
                target
            },
            '/datasource': {
                target
            },
            '/job': {
                target
            },
            '/lifecycle': {
                target
            },
            '/dataset': {
                target
            },
            '/datasets': {
                target
            },
            '/flow': {
                target
            },
            '/topic': {
                target
            },
            '/privilege': {
                target
            },
            '/project': {
                target
            },
            '/changereport': {
                target
            },
            '/appEntry': {
                target
            },
            '/changepw': {
                target
            },
            '/space': {
                target
            },
            '/lang': {
                target
            },
            '/excelMetadataInfo': {
                target
            },
            '/private': {
                target
            },
            '/systemImport': {
                target
            },
            '/lineage': {
                target
            },
            '/autocomplete': {
                target
            },
            '/manage': {
                target
            },
            '/tag': {
                target
            },
        },

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8110, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'eval',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../../index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../..'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};

