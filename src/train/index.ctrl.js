(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('TrainCtrl', [TrainCtrl]);

    function TrainCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"数据集","type":"dataset","href":"#/dataset"},
            {"name":"单模型结果","type":"result","href":"#/result"},
            {"name":"accuracy对比","type":"accuracy","href":"#/accuracy"},
            {"name":"loss对比","type":"loss","href":"#/loss"},

        ];

        vm.minHeight = window.screen.height-307;
    }
})();