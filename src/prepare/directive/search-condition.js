/**
 * 用于信息展示的表格指令，提供分页。
 * 能够对按钮与表格中每个属性值进行精准控制。
 * 计划加入排序功能。
 *
 */
(function () {
    'use strict';
    var Utils = angular.module('Utils');
    Utils.directive("searchCondition", ['PathUtils', SearchCondition]);

    function SearchCondition(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                config: "=",// 配置
                condition: "=ngModel"//查询条件
            },
            controller: ['relationDao', SearchConditionCtrl],
            controllerAs: 'searchConditionCtrl',
            templateUrl: PathUtils.qualifiedPath("/prepare/directive/search-condition.html")
        }
    }

    function SearchConditionCtrl(relationDao) {
        var vm = this;

        init();
        function init() {
            if (vm.config.pair) {
                relationDao.getAll(function (res) {
                    vm.relations = res;
                })
            }
        }
    }

})();