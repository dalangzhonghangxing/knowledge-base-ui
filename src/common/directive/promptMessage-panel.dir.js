/**
 * 弹框指令
 */
(function () {
    "use strict";

    var utils = angular.module('Utils');
    //icon-type有fa-check-circle（成功） fa-times-circle（错误） fa-exclamation-triangle(警告) fa-info-circle（信息
    //button样式 取消、关闭：白色   其他为蓝色
    utils.controller('PromptMessageCtrl',
        [
            '$uibModalInstance',
            '$sce',
            'icon',
            'message',
            'buttonFunctions',
            'buttonNames',
            PromptMessageCtrl
        ]);

    function PromptMessageCtrl($uibModalInstance, $sce, icon, message, buttonFunctions, buttonNames) {
        var vm = this;

        vm.show = new Array(4);
        vm.buttonName = new Array(4);
        vm.button = new Array(4);
        vm.buttonClass = new Array(4);

        vm.close = close;

        init();

        function close() {
            $uibModalInstance.dismiss("cancle");
        }

        function init() {
            for (var i = 0; i < 4; i++) {
                vm.show[i] = false;
            }
            vm.iconYype = "fa " + icon.type + " fa-3x";
            vm.proMessage = $sce.trustAsHtml(message.msg);
            for (var i = 0; i < buttonNames.names.length; i++) {
                vm.show[i] = true;
                vm.buttonName[i] = buttonNames.names[i];
                if (vm.buttonName[i] == "取消" || vm.buttonName[i] == "关闭")
                    vm.buttonClass[i] = "btn btn-sm btn-default";
                else
                    vm.buttonClass[i] = "btn btn-sm btn-primary";
                vm.button[i] = function (index) {
                    buttonFunctions[index]();
                    close();
                };
            }
        }
    }
})();
