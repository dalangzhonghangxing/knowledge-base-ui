(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('KnowledgeGraphCtrl', ['$http', 'PathUtils', KnowledgeGraphCtrl]);

    function KnowledgeGraphCtrl($http, PathUtils) {
        var vm = this;
        $http({
                  method: 'GET',
                  url: PathUtils.qualifiedPath("/download/npmdepgraph.json")
              }).then(function (res) {
            vm.data = res.data;
            vm.data.title = "高中数学知识体系图"
        });
    }
})();
