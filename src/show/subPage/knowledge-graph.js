(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('KnowledgeGraphCtrl', ['pairDao', 'relationDao', KnowledgeGraphCtrl]);

    function KnowledgeGraphCtrl(pairDao, relationDao) {
        var vm = this;

        vm.relations = [];

        vm.getGraph = getGraph;

        init();

        function init() {
            relationDao.getAll(function (res) {
                vm.relations = res;
            });
        }

        function getGraph() {
            var ids = [];
            for (var i = 0; i < vm.relations.length; i++)
                if (vm.relations[i].$checked)
                    ids.push(vm.relations[i].id);
            pairDao.getAllGraph(ids, function (res) {
                vm.graphData = res;
            });
        }
    }
})();
