(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('TrainCtrl', [TrainCtrl]);

    function TrainCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"数据集","type":"dataset","href":"#/dataset"},
            {"name":"结果管理","type":"result-manage","href":"#/result-manage"},
            {"name":"accuracy对比","type":"accuracy","href":"#/accuracy"},
            {"name":"loss对比","type":"loss","href":"#/loss"},
            {"name":"PR对比","type":"pr","href":"#/pr"}
        ];

        vm.minHeight = window.screen.height-307;
    }
})();