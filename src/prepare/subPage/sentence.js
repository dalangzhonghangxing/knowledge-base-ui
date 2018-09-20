(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('SentenceCtrl', ['sentenceDao', SentenceCtrl]);

    function SentenceCtrl(sentenceDao) {
        var vm = this;

        // info-table参数
        vm.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["原句", "分词后的句子"];
        vm.fields = ["original", "splited"];
        vm.btnFuncs = [update, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];

        vm.upload = upload;
        vm.search = search;

        init();
        function init() {
            search();
        }

        function upload() {
            sentenceDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            sentenceDao.findByPage(vm.currentPage,vm.numPerPage, function (res) {
                vm.values = res.content;
                vm.totalItems = res.totalElements;
            });
        }
        
        function update() {
            
        }
        
        function deleteById() {
            
        }

    }
})();