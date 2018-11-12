(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate','ngFileUpload','ngFileSaver','ng-echarts']);

    TrainHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/dataset'
        });

        $routeProvider.when('/dataset', {
            templateUrl: 'subPage/dataset.html'
        }).when('/analysis', {
            templateUrl: 'subPage/analysis.html'
        }).when('/result-manage', {
            templateUrl: 'subPage/result-manage.html'
        }).when('/accuracy', {
            templateUrl: 'subPage/accuracy.html'
        }).when('/loss', {
            templateUrl: 'subPage/loss.html'
        });

    }
})();