// Karma configuration
// Generated on Fri May 05 2017 14:19:46 GMT+0100 (GMT Daylight Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            'results/libs/jquery-3.1.1.min.js',
            'results/libs/knockout-3.4.1.debug.js',
            'results/libs/knockout.mapping-latest.js',
            'results/libs/bootstrap/js/bootstrap.min.js',
            'results/libs/require.js',
            'node_modules/karma-requirejs/lib/adapter.js',
            {pattern: 'results/*.js', included: false},
            {pattern: 'results/[!libs]**/*.js', included: false},
            {pattern: 'tests/results/**/*Spec.js', included: false},
            'tests/test-main.js'
        ],


        // list of files to exclude
        exclude: [],
        client: {
            mocha: {
                ui: 'tdd'
            }
        },


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
