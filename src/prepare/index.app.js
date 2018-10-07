(function () {
    'use strict';
    var KBHome = angular.module('KBHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate','ngFileUpload','ngFileSaver']);

    KBHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/sentence'
        });

        $routeProvider.when('/sentence', {
            templateUrl: 'subPage/sentence.html'
        }).when('/knowledge', {
            templateUrl: 'subPage/knowledge.html'
        }).when('/pair', {
            templateUrl: 'subPage/pair.html'
        }).when('/relation', {
            templateUrl: 'subPage/relation.html'
        }).when('/tag', {
            templateUrl: 'subPage/tag.html'
        });

    }
})();