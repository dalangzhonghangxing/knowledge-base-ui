/**
 * top导航栏指令
 */
(function () {
    'use strict';

    var utils = angular.module('Utils');
    utils.directive("topNavPanel", ['PathUtils', footerPanel]);

    function footerPanel(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                "currentType":"@"
            },
            scope: {},
            controller: ['PathUtils', TopNavPanelCtrl],
            controllerAs: 'topNavPanelCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/layout/top-nav.html")
        }
    }

    function TopNavPanelCtrl(PathUtils) {
        var vm = this;
        vm.menus = [
            {"name": "准备",type:"prepare", "href": PathUtils.qualifiedPath("/prepare/index.html#/sentence")},
            {"name": "训练",type:"train", "href": PathUtils.qualifiedPath("/train/index.html#/dataset")},
            {"name": "预测",type:"predict", "href": PathUtils.qualifiedPath("/predict/index.html#/")},
            {"name": "展示",type:"show", "href": PathUtils.qualifiedPath("/show/index.html#/knowledge-graph")}
        ];

        vm.click = click;

        function click(event) {
            event.class.push("active");
        }
    }

})();