(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('LineChartCtrl', ['$http', 'PathUtils', LineChartCtrl]);

    function LineChartCtrl($http, PathUtils) {
        var vm = this;
        // $http({
        //     method: 'GET',
        //     url: PathUtils.qualifiedPath("/download/npmdepgraph.json")
        // }).then(function (res) {
        //     vm.data = res.data;
        //     vm.data.title = "高中数学知识体系图"
        // });
        vm.data = {};
    }
})();
