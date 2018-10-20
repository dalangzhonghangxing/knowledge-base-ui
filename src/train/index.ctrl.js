(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('TrainCtrl', ["PathUtils",TrainCtrl]);

    function TrainCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"数据集","type":"dataset","href":"#/dataset"},
            {"name":"特征工程","type":"feature","href":"#/feature"},
            {"name":"模型","type":"model","href":"#/model"}
        ];

        vm.minHeight = window.screen.height-307;
    }
})();