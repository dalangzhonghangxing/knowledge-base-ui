(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('KnowledgeCtrl', ['knowledgeDao', '$scope', 'Prompt', "$uibModal", "PathUtils","FileExport", KnowledgeCtrl]);

    function KnowledgeCtrl(knowledgeDao, $scope, Prompt, $uibModal, PathUtils,FileExport) {
        var vm = this;

        // info-table参数
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["名称"];
        vm.fields = ["name"];
        vm.btnFuncs = [update, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];

        vm.upload = upload;
        vm.search = search;
        vm.exportAll = exportAll;

        init();

        function init() {
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                search();
            });
        }

        function upload() {
            knowledgeDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            knowledgeDao.findByPage($scope.currentPage, vm.numPerPage, function (res) {
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
                                       return "知识点编辑页面";
                                   },
                                   value: function () {
                                       return value;
                                   },
                                   fields: function () {
                                       return vm.fields;
                                   },
                                   labels: function () {
                                       return vm.titles;
                                   },
                                   func: function () {
                                       return doUpdate;
                                   }
                               }
                           });
        }

        function doUpdate(value) {
            knowledgeDao.save(value, function (res) {
                search();
            })
        }

        function deleteById(value) {
            Prompt.promptModifyMessage("是否确认删除该知识点？", function () {
                knowledgeDao.deleteById(value.id, $scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

        function exportAll() {
            relationDao.exportAll(function (res) {
                FileExport.export(res, "application/csv", "知识点.csv");
            });
        }

    }
})();