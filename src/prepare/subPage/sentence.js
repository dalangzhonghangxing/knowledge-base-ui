(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('SentenceCtrl', ['sentenceDao', '$scope', '$uibModal', 'PathUtils',"FileExport",'Prompt', SentenceCtrl]);

    function SentenceCtrl(sentenceDao, $scope, $uibModal, PathUtils,FileExport,Prompt) {
        var vm = this;

        // info-table参数
        // vm.currentPage = 1;
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["原句", "分词后的句子"];
        vm.fields = ["original", "splited"];
        vm.btnFuncs = [update, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];

        vm.upload = upload;
        vm.search = search;
        vm.split = split;
        vm.exportAll = exportAll;

        init();

        function init() {
            search();
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                if (newValue != oldValue)
                    search();
            });
        }

        function upload() {
            sentenceDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            sentenceDao.findByPage($scope.currentPage, vm.numPerPage, function (res) {
                vm.values = res.content;
                vm.totalItems = res.totalElements;
            });
        }

        function update(value) {
            $uibModal.open({
                animation: true,
                templateUrl: PathUtils.qualifiedPath("/common/directive/text-modify.modal.html"),
                controller: 'TextModifyCtrl',
                controllerAs: 'textModifyCtrl',
                resolve: {
                    head: function () {
                        return "句子编辑页面";
                    },
                    value: function () {
                        return value;
                    },
                    fields: function () {
                        return ["original"];
                    },
                    labels: function () {
                        return ["原句"];
                    },
                    func: function () {
                        return doUpdate;
                    }
                }
            });
        }

        function doUpdate(value) {
            sentenceDao.save(value, function (res) {
                search();
            })
        }

        function deleteById() {
            Prompt.promptModifyMessage("是否确认删除该句子？句子强烈不建议删除！", function () {
                sentenceDao.deleteById(value.id, $scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

        function split() {
            sentenceDao.split(function (res) {
                search();
            });
        }

        function exportAll() {
            sentenceDao.exportAll(function (res) {
                FileExport.export(res, "application/csv", "句子.csv");
            });
        }

    }
})
();