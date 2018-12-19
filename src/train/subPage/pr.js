(function () {
    'use strict';

    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('PRCtrl', ['resultDao', PRCtrl]);

    function PRCtrl(resultDao) {
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
                resultDao.getPRsByModelNames(modelNames, function (res) {
                    vm.data = {};
                    vm.accuracy = {};
                    vm.data["title"] = "Precision-Recall对比";
                    vm.data["legendData"] = res.legendData;
                    vm.data["xAxisName"] = "recall";
                    vm.data["xAxisData"] = [];
                    vm.data["yAxisName"] = "precision";
                    vm.data["series"] = res.series;
                    vm.data["xAxisType"] = "value";
                    vm.show = true;
                });
        }
    }
})();
