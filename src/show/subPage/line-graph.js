(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('LineChartCtrl', ['resultDao', LineChartCtrl]);

    function LineChartCtrl(resultDao) {
        var vm = this;
        vm.modelNames = [];

        vm.search = search;
        init();

        function init() {
            resultDao.getModelNames(function (res) {
                vm.modelNames = res;
            });
        }

        function search() {
            resultDao.getLineByModelName(vm.modelName, function (res) {
                vm.loss = {};
                vm.accuracy = {};
                vm.loss["title"] = "loss";
                vm.loss["legendData"] = res.legendData;
                vm.loss["xAxisName"] = "epoch";
                vm.loss["xAxisData"] = [];
                vm.loss["yAxisName"] = "loss";
                vm.loss["series"] = res.lossSeries;

                vm.accuracy["title"] = "accuracy";
                vm.accuracy["legendData"] = res.legendData;
                vm.accuracy["xAxisName"] = "epoch";
                vm.accuracy["xAxisData"] = [];
                vm.accuracy["yAxisName"] = "loss";
                vm.accuracy["series"] = res.accuracySeries;

                vm.show = true;

            });
        }
    }
})();
