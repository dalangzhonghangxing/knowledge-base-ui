(function () {
    'use strict';

    var ShowHome = angular.module('ShowHome');

    ShowHome.controller('AccuracyCtrl', ['resultDao', AccuracyCtrl]);

    function AccuracyCtrl(resultDao) {
        var vm = this;
        vm.models = [];

        vm.search = search;
        init();

        function init() {
            resultDao.getModelNames(function (res) {
                for (var modelName of res) {
                    vm.models.push({"name": modelName});
                }
            });
        }

        function search() {
            var modelNames = [];
            for (var model of vm.models) {
                if (model.$checked)
                    modelNames.push(model.name);
            }
            if (modelNames.length > 0)
                resultDao.getAccuraciesByModelNames(modelNames, function (res) {
                    vm.data = {};
                    vm.accuracy = {};
                    vm.data["title"] = "Accuracy对比";
                    vm.data["legendData"] = res.legendData;
                    vm.data["xAxisName"] = "epoch";
                    vm.data["xAxisData"] = [];
                    vm.data["yAxisName"] = "accuracy";
                    vm.data["series"] = res.series;

                    vm.show = true;
                });
        }
    }
})();
