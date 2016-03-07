'use strict';

window.requireJS = require;
require = window.requireJS;
require.nodeRequire = window.requireNode;

var globalEvents = {};
require.config({
    waitSeconds : 0,
    //baseUrl: 'main/',
    paths: {
        text: '../libs/text',
        jquery: '../libs/jquery-1.12.0.min',
        underscore: '../libs/underscore-min',
        backbone: '../libs/backbone',
        bootstrap: '../libs/bootstrap.min',
        bootbox: '../libs/bootbox.min',
        bootstrapdatepicker: '../libs/bootstrap-datepicker.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            'deps': ['jquery']
        },
        bootbox: {
            'deps': ['jquery', 'bootstrap']
        },
        bootstrapdatepicker: {
            'deps': ['jquery', 'bootstrap']
        },
        backbone: {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        },
        underscore: {
            'exports': '_'
        }
    }
});


require(['jquery', 'underscore', 'backbone',  'app', 'bootstrap', 'bootstrapdatepicker'], function($, _, Backbone, APP, bootstrap) {
    _.extend(globalEvents, Backbone.Events);
	APP.start();
});
