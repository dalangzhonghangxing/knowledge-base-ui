(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('ConceptQueryCtrl', ['pairDao', 'relationDao', ConceptQueryCtrl]);

    function ConceptQueryCtrl(pairDao, relationDao) {
        var vm = this;


        vm.relations = [];

        vm.query = query;

        init();

        function init() {
            relationDao.getAll(function (res) {
                vm.relations = res;
            });
        }

        function query() {
            pairDao.conceptQuery(vm.knowledgeA,vm.knowledgeB, function (res) {
                vm.graphData = res;
            });
        }
    }
})();
