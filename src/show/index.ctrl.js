(function () {
    'use strict';
    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('ShowCtrl', ["PathUtils",ShowCtrl]);

    function ShowCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"知识体系图","type":"knowledge-graph","href":"#/knowledge-graph"},
            {"name":"单模型结果","type":"result","href":"#/result"},
            {"name":"accuracy对比","type":"accuracy","href":"#/accuracy"},
            {"name":"loss对比","type":"loss","href":"#/loss"},
        ];

        vm.minHeight = window.screen.height-307;
    }
})();