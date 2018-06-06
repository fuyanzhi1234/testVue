/**
 * @file lavas config
 * @author yourname(someone@somecompany.com)
 */

'use strict';

const path = require('path');
const BUILD_PATH = path.resolve(__dirname, 'dist');
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const AppCachePlugin = require('appcache-webpack-plugin');

console.log(process.env.APPCACHE)

module.exports = {
    build: {
        ssr: false,
        path: BUILD_PATH,
        // publicPath: '/lavasdist/',
        publicPath: '/',
        ssrCopy: isDev ? [] : [
            {
                src: 'server.prod.js'
            },
            {
                src: 'package.json'
            }
        ],
        /**
         * alias for webpack
         *
         * @type {Object.<string, Object>}
         */
        alias: {
            server: {
                'iscroll/build/iscroll-lite$': path.join(__dirname, 'core/iscroll-ssr.js')
            }
        },
        /**
         * node externals
         *
         * @type {Array.<string|RegExp>}
         */
        nodeExternalsWhitelist: [
            /iscroll/
        ],
        plugins: {
            client: [
                new AppCachePlugin({
                //   cache: ['/manifest.appcache'],
                //   network: ['/static/manifest.json'],  // No network access allowed!
                //   fallback: ['failwhale.jpg'],
                  settings: ['fast'],
                  exclude: ['file.txt', /.*\.json$/],  // Exclude file.txt and all .js files(, /.*\.js$/)
                  output: 'manifest.appcache'
                })
            ]
        }
    },
    router: {
        mode: 'history',
        // base: '/lavasdist',
        base: '/',
        pageTransition: {
            type: 'slide',
            transitionClass: 'slide'
        }
    },
    serviceWorker: {
        swSrc: path.join(__dirname, 'core/service-worker.js'),
        swDest: path.join(BUILD_PATH, 'service-worker.js'),
        // swPath: '/custom_path/', // specify custom serveice worker file's path, default is publicPath
        globDirectory: BUILD_PATH,
        globPatterns: [
            '**/*.{html,js,css,eot,svg,ttf,woff,woff2,ico,png,jpg,jpeg}'
        ],
        globIgnores: [
            'sw-register.js',
            '**/*.map'
        ],
        appshellUrl: '/appshell',
        dontCacheBustUrlsMatching: /\.\w{8}\./
    },
};
