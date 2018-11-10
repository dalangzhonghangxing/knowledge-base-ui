(function () {
    'use strict';
    var ShowHome = angular.module('ShowHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate',
        'ng-echarts','ngFileUpload']);

    ShowHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/sentence'
        });

        $routeProvider.when('/knowledge-graph', {
            templateUrl: 'subPage/knowledge-graph.html'
        }).when('/result', {
            templateUrl: 'subPage/line-graph.html'
        }).when('/accuracy', {
            templateUrl: 'subPage/accuracy.html'
        }).when('/loss', {
            templateUrl: 'subPage/loss.html'
        });

    }
})();