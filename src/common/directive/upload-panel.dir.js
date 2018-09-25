/**
 * 文件上传组件
 */
(function () {
    'use strict';

    var Utils = angular.module('Utils');
    Utils.directive("uploadPanel", ['PathUtils', uploadPanel]);

    function uploadPanel(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                "maxFileSize":"=",
                "template": '=',
                "file": '=',
                "uploadBtnName": '<',
                "uploadFunction": '&',
                "checkFunction":"&",
                "ischeck":'<',
                "downloadFunction":'&?',
                "addWord":'=?'
            },
            scope: {},
            controller: ['PathUtils', UploadCtrl],
            controllerAs: 'uploadCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/upload-panel.html")
        }
    }

    function UploadCtrl(PathUtils) {
        var vm = this;
        var count = 2;

        vm.invalid = false;

        vm.downloadTemplate = downloadTemplate;
        vm.chooseFile = chooseFile;
        vm.upload = upload;
        vm.check = check;
        vm.cancel = cancel;
        vm.invalidFile = invalidFile;

        if (vm.uploadBtnName == null)
            vm.uploadBtnName = "选择文件";
        if(vm.ischeck == null || vm.ischeck == false)
            vm.showIscheck = false;
        else
            vm.showIscheck = true;

        function downloadTemplate() {
            if(vm.downloadFunction== null)
                window.location.href = PathUtils.qualifiedPath(vm.template);
            else{
                vm.downloadFunction();
            }
        }

        function chooseFile() {
            vm.invalid = false;
            document.getElementById('hiddenFile').click();
        }

        function upload() {
            vm.uploadFunction();
            cancel();
        }

        function check() {
            vm.checkFunction();
        }

        function cancel() {
            vm.file = null;
        }

        function invalidFile() {
            if (count % 2 != 0) {
                count = count + 1;
                return;
            }
            if (vm.file != null) {
                vm.invalid = false;
            }
            else {
                vm.invalid = true;
            }
            count = 1;
        }


    }
})();