(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('SentenceCtrl', ['sentenceDao', '$scope', SentenceCtrl]);

    function SentenceCtrl(sentenceDao, $scope) {
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

        function update() {

        }

        function deleteById() {

        }

        function split() {
            sentenceDao.split(function (res) {
                search();
            });
        }

    }
})
();