(function () {
    'use strict';
    var TrainHome = angular.module('TrainHome');

    TrainHome.controller('DataSetCtrl', ['pairDao', 'Prompt', DataSetCtrl]);

    function DataSetCtrl(pairDao, Prompt) {
        var vm = this;

        vm.generateDataset = generateDataset;

        function generateDataset() {
            pairDao.generateDataset(function () {
                Prompt.promptSuccessMessage("数据集已生成");
            });
        }

    }
})();