(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('KnowledgeGraphCtrl', ['pairDao', KnowledgeGraphCtrl]);

    function KnowledgeGraphCtrl(pairDao) {
        var vm = this;
        pairDao.getAllGraph(function (res) {
            vm.graphData = res;
        });
    }
})();
