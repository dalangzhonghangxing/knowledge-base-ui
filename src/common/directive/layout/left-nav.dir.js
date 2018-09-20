/**
 * 左侧导航栏
 */
(function () {
    'use strict';

    var utils = angular.module('Utils');
    utils.directive("leftNavPanel", ['PathUtils', footerPanel]);

    function footerPanel(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                "menus":"="
            },
            controller: ['PathUtils', LeftNavPanelCtrl],
            controllerAs: 'leftNavPanelCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/layout/left-nav.html")
        }
    }

    function LeftNavPanelCtrl(PathUtils) {
        var vm = this;

    }

})();