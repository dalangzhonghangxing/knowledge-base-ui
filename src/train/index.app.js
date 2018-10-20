(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate','ngFileUpload','ngFileSaver']);

    TrainHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/dataset'
        });

        $routeProvider.when('/dataset', {
            templateUrl: 'subPage/dataset.html'
        }).when('/feature', {
            templateUrl: 'subPage/feature.html'
        }).when('/model', {
            templateUrl: 'subPage/model.html'
        });

    }
})();