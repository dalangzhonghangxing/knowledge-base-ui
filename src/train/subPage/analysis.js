(function () {
    'use strict';

    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('AnalysisCtrl', ['pairDao', AnalysisCtrl]);

    function AnalysisCtrl(pairDao) {
        var vm = this;

        init();

        function init() {
            pairDao.getCountData(function (res) {
                vm.data = res;
                vm.data.title = "知识点数量统计";
            });
        }

    }
})();
