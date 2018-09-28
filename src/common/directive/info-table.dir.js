/**
 * 用于信息展示的表格指令，提供分页。
 * 能够对按钮与表格中每个属性值进行精准控制。
 * 计划加入排序功能。
 *
 */
(function () {
    'use strict';
    var Utils = angular.module('Utils');
    Utils.directive("infoTable", ['PathUtils', infoTable]);

    function infoTable(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                titles: "=",//表头名称，传入一个list
                fields: "=",//数据的属性，要与head对应
                values: "=",//所有的元数据
                valueHandler: "=?",//用处对某些不能直接显示的值进行处理
                totalItems: "=",//记录总条
                currentPage: "=",//当前页面
                numPerPage: "=",//每页显示记录数
                search: "&",//搜索方法，无参
                btnNames: "=?",//操作按钮的名称，应该与方法列表长度一致
                btnFuncs: "=?",//操作按钮的方法列表，每个方法都需要接收object对象与callback
                btnClass: "=?",//每个按钮的class，默认都是btn-primary
                btnDisableFunc: "=?",//控制每个按钮是否disable,默认false
                btnShowFunc: "=?"//控制每个按钮是否可见，默认true
            },
            controller: [InfoTableCtrl],
            controllerAs: 'infoTableCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/info-table.view.html")
        }
    }

    function InfoTableCtrl() {
        var vm = this;

        vm.maxSize = 5;

        vm.pageChange = pageChange;
        vm.callback = callback;
        vm.checkAll = checkAll;

        init();

        function init() {
            if (vm.btnDisableFunc == null)
                vm.btnDisableFunc = function (obj, index) {
                    return false;
                };
            if (vm.btnShowFunc == null)
                vm.btnShowFunc = function (obj, index) {
                    return true;
                };
            if (vm.valueHandler == null) {
                vm.valueHandler = function (obj, index) {
                    return obj;
                }
            }
            if (vm.btnClass == null) {
                vm.btnClass = [];
                for (var i = 0; i < vm.btnNames.length; i++)
                    vm.btnClass.push("btn btn-primary")
            }
        }

        function pageChange() {
            // vm.search();
        }

        function callback(index, value) {
            var func = vm.btnFuncs[index];
            func(value);
        }

        function checkAll() {
            for (var i = 0; i < vm.values.length; i++) {
                vm.values[i].$checked = vm.allChecked;
            }
        }
    }

})();