(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('RelationCtrl', ['relationDao', '$scope','Prompt', '$uibModal', 'PathUtils',RelationCtrl]);

    function RelationCtrl(relationDao, $scope,Prompt,$uibModal, PathUtils) {
        var vm = this;

        // info-table参数
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["编码","名称","例子"];
        vm.fields = ["code","name","example"];
        vm.btnFuncs = [update, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];

        vm.upload = upload;
        vm.search = search;
        vm.update = update;

        init();

        function init() {
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                search();
            });
        }

        function upload() {
            relationDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            relationDao.findByPage($scope.currentPage, vm.numPerPage, function (res) {
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
                                       return "关系编辑页面";
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
            relationDao.save(value, function (res) {
                search();
            })
        }

        function deleteById(value) {
            Prompt.promptModifyMessage("是否确认删除该关系？", function () {
                relationDao.deleteById(value.id,$scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

    }
})();