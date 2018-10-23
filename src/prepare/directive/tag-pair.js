/**
 * 打标签指令
 */
(function () {
    'use strict';
    var KBHome = angular.module('KBHome');
    KBHome.directive("tagPair", ['PathUtils', tagPair]);

    function tagPair(PathUtils) {
        return {
            restrict: 'E',
            transclude: true,
            bindToController: {
                relationId: "=ngModel", // 关系类型
                pair: "=",//待标记关系对
                graphData: "=",//关系图数据
                submitFunc: "=" // 提交按钮响应方法
            },
            controller: ['relationDao', TagPairCtrl],
            controllerAs: 'tagPairCtrl',
            templateUrl: PathUtils.qualifiedPath("/prepare/directive/tag-pair.html")
        }
    }

    function TagPairCtrl(relationDao) {
        var vm = this;
        // 添加对键盘的监听
        document.onkeydown = keydown;

        vm.submit = submit;

        init();

        function init() {
            relationDao.getAll(function (res) {
                vm.relations = res;
            })
        }

        function getFocus() {
            if (document.getElementsByClassName("relation-radio")[2] != null)
                (document.getElementsByClassName("relation-radio")[2]).focus();
        }

        function submit() {
            if (vm.submitFunc != null)
                vm.submitFunc();
        }

        function keydown() {
            // 方向键
            if (event.keyCode >= 37 && event.keyCode <= 40)
                getFocus();

            // 回车
            if (event.keyCode == 13)
                submit();
        }

    }

})();