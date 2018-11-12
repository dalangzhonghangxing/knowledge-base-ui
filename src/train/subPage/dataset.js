(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('DataSetCtrl', ['pairDao', 'Prompt', DataSetCtrl]);

    function DataSetCtrl(pairDao, Prompt) {
        var vm = this;

        vm.generateDataset = generateDataset;

        init();

        function init() {
            pairDao.getCountData(function (res) {
                vm.data = res;
                vm.data.title = "知识点数量统计";
            });
        }

        function generateDataset() {
            pairDao.generateDataset(function () {
                Prompt.promptSuccessMessage("数据集已生成");
            });
        }

    }
})();