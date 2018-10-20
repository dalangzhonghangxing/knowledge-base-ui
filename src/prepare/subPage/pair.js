(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('PairCtrl', ['pairDao', '$scope', '$uibModal', 'PathUtils',"FileExport", PairCtrl]);

    function PairCtrl(pairDao, $scope, $uibModal, PathUtils,FileExport) {
        var vm = this;
        vm.searchConditon = {};

        // info-table参数
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["知识点A", "知识点B", "关系", "句子数量"];
        vm.fields = ["knowledgeA", "knowledgeB", 'relation', 'sentences'];
        vm.btnFuncs = [deleteById];
        vm.btnNames = ["删除"];
        vm.btnClass = ["btn btn-danger"];
        vm.valueHandler = function (value, index) {
            if (vm.fields[index] == "knowledgeA" || vm.fields[index] == "knowledgeB") {
                return value.name;
            }

            if (vm.fields[index] == "relation") {
                if (value == null) return "待标记";
                return value.name;
            }

            if (vm.fields[index] == "sentences") {
                return value.length;
            }
            return value;
        };

        vm.upload = upload;
        vm.search = search;
        vm.generate = generate;
        vm.exportAll = exportAll;

        init();

        function init() {
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                search();
            });
            getInfo();
        }

        function getInfo() {
            pairDao.getInfo( function (res) {
                vm.info = res;
            });
        }

        function upload() {
            pairDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            pairDao.findByPage($scope.currentPage, vm.numPerPage,vm.searchConditon, function (res) {
                vm.values = res.content;
                vm.totalItems = res.totalElements;
            });
        }

        function generate() {
            pairDao.generate(function () {
                search();
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
                                       return "知识对编辑页面";
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
            // pairDao.save(value, function (res) {
            //     search();
            // })
        }

        function deleteById() {
            Prompt.promptModifyMessage("是否确认删除该知识对？", function () {
                pairDao.deleteById(value.id, $scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

        function exportAll() {
            pairDao.exportAll(function (res) {
                FileExport.export(res, "application/csv", "知识对.csv");
            });
        }

    }
})();