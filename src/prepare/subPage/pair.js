(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('PairCtrl', ['pairDao','$scope', PairCtrl]);

    function PairCtrl(pairDao,$scope) {
        var vm = this;

        // info-table参数
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["知识点A", "知识点B", "关系", "句子数量"];
        vm.fields = ["knowledgeA", "knowledgeB", 'relation', 'sentences'];
        vm.btnFuncs = [update, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];
        vm.valueHandler = function (value, index) {
            if (vm.fields[index] == "knowledgeA" || vm.fields[index] == "knowledgeB") {
                return value.name;
            }

            if (vm.fields[index] == "relation") {
                if(value == null) return "待标记";
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

        init();

        function init() {
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                search();
            });
        }

        function upload() {
            pairDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            pairDao.findByPage($scope.currentPage, vm.numPerPage, function (res) {
                vm.values = res.content;
                vm.totalItems = res.totalElements;
            });
        }

        function generate() {
            pairDao.generate(function () {
                search();
            });
        }

        function update() {

        }

        function deleteById() {

        }

    }
})();