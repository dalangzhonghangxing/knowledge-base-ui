(function () {
    'use strict';
    var KBHome = angular.module('KBHome');

    KBHome.controller('KBCtrl', ["PathUtils",KBCtrl]);

    function KBCtrl() {
        var vm = this;

        vm.menus = [
            {"name":"句子","type":"sentence","href":"#/sentence"},
            {"name":"知识点","type":"knowledge","href":"#/knowledge"},
            {"name":"关系","type":"relation","href":"#/relation"},
            {"name":"关系对","type":"pair","href":"#/pair"},
            {"name":"标注","type":"tag","href":"#/tag"}
        ];

        vm.minHeight = window.screen.height-307;
    }
})();