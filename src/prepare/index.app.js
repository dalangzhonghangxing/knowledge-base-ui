(function () {
    'use strict';
    var KBHome = angular.module('KBHome', ['Utils', 'ui.bootstrap', 'ngRoute', 'ngAnimate',
        'ng-echarts','ngFileUpload']);

    KBHome.config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/sentence.html'
        });

        $routeProvider.when('/sentence.html', {
            templateUrl: 'subPage/sentence.html'
        });

    }
})();