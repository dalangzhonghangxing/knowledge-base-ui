(function () {
    'use strict';
    var KBHome = angular.module('KBHome');

    KBHome.controller('KBCtrl', ["PathUtils",KBCtrl]);

    function KBCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"句子","href":"#/sentence.html"},
            {"name":"知识点","href":"#"},
            {"name":"关系对","href":"#"},
            {"name":"标注","href":"#"},
        ];
    }
})();