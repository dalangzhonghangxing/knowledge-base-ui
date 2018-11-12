(function () {
    'use strict';

    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('ResultManageCtrl', ['resultDao', '$uibModal','Prompt', ResultManageCtrl]);

    function ResultManageCtrl(resultDao, $uibModal,Prompt) {
        var vm = this;
        vm.models = [];

        vm.titles = ["模型名称"];
        vm.fields = ["name"];
        vm.btnNames = ["查看", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];
        vm.btnFuncs = [preview, delet];

        init();

        function init() {
            resultDao.getModelNames(function (res) {
                for (var modelName of res) {
                    vm.models.push({"name": modelName});
                }
            });
        }

        function preview(value) {
            $uibModal.open({
                animation: true,
                templateUrl: "result.html",
                controller: 'ResultCtrl',
                controllerAs: 'ctrl',
                size: 'lg',
                resolve: {
                    modelName: function () {
                        return value.name;
                    }
                }
            });

        }

        function delet(value) {
            Prompt.promptModifyMessage("是否确认删除改模型？删除后不可恢复！", function () {
                resultDao.deleteByModelName(value.name, function (res) {
                    vm.models = [];
                    for (var modelName of res) {
                        vm.models.push({"name": modelName});
                    }
                });
            });
        }

    }

    TrainHome.controller('ResultCtrl', ['$uibModalInstance', 'modelName', 'resultDao', ResultCtrl]);

    function ResultCtrl($uibModalInstance, modelName, resultDao) {
        var vm = this;

        vm.modelName = modelName;

        search(modelName);

        function search(modelName) {
            resultDao.getLineByModelName(modelName, function (res) {
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
                vm.accuracy["yAxisName"] = "accuracy";
                vm.accuracy["series"] = res.accuracySeries;

                vm.show = true;

            });
        }

    }
})();
