(function () {
    'use strict';
    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('ShowCtrl', ["PathUtils",ShowCtrl]);

    function ShowCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"知识体系图","type":"knowledge-graph","href":"#/knowledge-graph"}
        ];

        vm.minHeight = window.screen.height-307;
    }
})();