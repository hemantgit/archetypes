module.exports = function (buildConfig, grunt) {
    'use strict';

    var glob = require("glob");

    //expose folders and build friendly urls into statics
    var proxySingleBundle = function (callback) {
            var pxys = grunt.config('connect.proxyServer.proxies'),
                rewrite = {};

            //Route all calls to the portalserver statics first to myproject
            rewrite[buildConfig.portalServer.url + '/static/' + buildConfig.companyNameSpace] = '/' + buildConfig.companyNameSpace;

            pxys.push({
                context: buildConfig.portalServer.url + '/static',
                host: 'localhost',
                port: buildConfig.servers.proxyServer.port,
                rewrite: rewrite
            });

            grunt.config('connect.proxyServer.proxies', pxys);

            callback();
        },
    //Traverse project folders and build friendly urls
        proxyMultipleBundle = function (callback) {
            glob(buildConfig.bundlesDir + '/' + buildConfig.companyNameSpace + '-*', function (er, files) {

                var pxys = [];

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = buildConfig.portalServer.url + '/static' + bundleName,
                        myEndpoint = f.replace(buildConfig.bundlesDir, ''),
                        object = {};

                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        rewrite: object
                    });
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
    //Traverse themes folders and build a different friendly urls
        proxyThemes = function (callback) {
            var pxys = grunt.config('connect.proxyServer.proxies'),
                rewrite = {};

            rewrite[buildConfig.portalServer.url + '/static/themes/lp-default'] = '/themes/';
            rewrite[buildConfig.portalServer.url + '/static/themes/default'] = '/themes/default/';
            rewrite[buildConfig.portalServer.url + '/static/themes/bootstrap'] = '/themes/bootstrap/';
            rewrite[buildConfig.portalServer.url + '/static/themes/gulfbank'] = '/themes/gulfbank/';


            pxys.push({
                context: buildConfig.portalServer.url + '/static/themes',
                host: 'localhost',
                port: buildConfig.servers.proxyServer.port,
                rewrite: rewrite
            });

            grunt.config('connect.proxyServer.proxies', pxys);

            callback();
        },
    //Traverse config-info folders and build friendly urls
        proxyConfigInfo = function (callback) {
            glob(buildConfig.bundlesDir + '/**/config-info/' + buildConfig.companyNameSpace + '-*', function (er, files) {

                var pxys = grunt.config('connect.proxyServer.proxies');

                files.forEach(function (f) {

                    var bundleName = f.substring(f.lastIndexOf('/'), f.length),
                        myContext = buildConfig.portalServer.url + '/static/config-info' + bundleName,
                        myEndpoint = f.replace(buildConfig.bundlesDir, '');

                    var object = {};
                    object[myContext] = myEndpoint;

                    pxys.push({
                        context: myContext,
                        host: 'localhost',
                        port: buildConfig.servers.proxyServer.port,
                        rewrite: object
                    });
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
    //Traverse import folders and build friendly urls
        proxyXmlImport = function (callback) {
            glob(buildConfig.bundlesDir + '/**/config-info/import/**/*.xml', function (er, files) {

                var pxys = grunt.config('connect.proxyServer.proxies'),
                    myContext = buildConfig.portalServer.url + '/static/config-info/import',
                    object = {};

                files.forEach(function (f) {
                    var myEndpoint = f.replace(buildConfig.bundlesDir, ''),
                        myStartPoint = myContext + myEndpoint.substring(myEndpoint.lastIndexOf('/'), myEndpoint.length);

                    object[myStartPoint] = myEndpoint;
                    console.log(myStartPoint + ',');
                });

                pxys.push({
                    context: myContext,
                    host: 'localhost',
                    port: buildConfig.servers.proxyServer.port,
                    rewrite: object
                });

                grunt.config('connect.proxyServer.proxies', pxys);

                callback();

            });
        },
    //Proxy the portal sever
        proxyPortalServer = function (callback) {

            var pxys = grunt.config('connect.proxyServer.proxies');

            pxys.push({
                context: buildConfig.portalServer.url,
                host: 'localhost',
                port: buildConfig.portalServer.port
            });

            grunt.config('connect.proxyServer.proxies', pxys);

            callback();
        },
        proxyYapiFromMosaic = function (callback) {

            var pxys = grunt.config('connect.proxyServer.proxies'),
                rewrite = {};

            rewrite[buildConfig.portalServer.url + '/static/mosaic-tools/yapi-2.0/'] = buildConfig.portalServer.url + '/static/mosaic-tools/yapi-2.0/';


            pxys.push({
                context: buildConfig.portalServer.url + '/static/mosaic-tools/',
                host: 'mosaiced.backbase.com',
                port: 8888,
                rewrite: rewrite
            });

            grunt.config('connect.proxyServer.proxies', pxys);

            callback();
        };

    //CONFIG: You must add any of the functions above to be returned in the array else it will be ignored
    return [
        proxyMultipleBundle,
        //proxyYapiFromMosaic,
        proxyPortalServer
    ];
};
