/**
 * 左侧导航栏
 */
(function () {
    'use strict';

    var utils = angular.module('Utils');
    utils.directive("leftNavPanel", ['PathUtils', leftNavPanel]);

    function leftNavPanel(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                "menus": "=",
                "parent": "@"
            },
            controller: ['PathUtils', LeftNavPanelCtrl],
            controllerAs: 'leftNavPanelCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/layout/left-nav.html")
        }
    }

    function LeftNavPanelCtrl(PathUtils) {
        var vm = this;

        init();

        function init() {
            var route = window.location.href.split("#/")[1];
            vm.currentType = route;
        }

    }

})();