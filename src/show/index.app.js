(function () {
    'use strict';
    var ShowHome = angular.module('ShowHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate',
        'ng-echarts','ngFileUpload']);

    ShowHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/knowledge-graph', {
            templateUrl: 'subPage/knowledge-graph.html'
        }).when('/concept-query', {
            templateUrl: 'subPage/concept-query.html'
        });

    }
})();