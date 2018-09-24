(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('KnowledgeCtrl', ['knowledgeDao', '$scope','Prompt', KnowledgeCtrl]);

    function KnowledgeCtrl(knowledgeDao, $scope,Prompt) {
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

        function update() {

        }

        function deleteById(value) {
            Prompt.promptModifyMessage("是否确认删除该知识点？", function () {
                knowledgeDao.deleteById(value.id,$scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

    }
})();