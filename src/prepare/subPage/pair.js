(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('PairCtrl', ['pairDao', '$scope', '$uibModal', 'PathUtils', "FileExport", "Prompt", PairCtrl]);

    function PairCtrl(pairDao, $scope, $uibModal, PathUtils, FileExport, Prompt) {
        var vm = this;
        vm.searchConditon = {};

        // info-table参数
        $scope.currentPage = 1;
        vm.numPerPage = 15;
        vm.titles = ["知识点A", "知识点B", "关系", "句子数量"];
        vm.fields = ["knowledgeA", "knowledgeB", 'relation', 'sentences'];
        vm.btnFuncs = [modify, deleteById];
        vm.btnNames = ["修改", "删除"];
        vm.btnClass = ["btn btn-primary", "btn btn-danger"];
        vm.valueHandler = function (value, index) {
            if (vm.fields[index] == "knowledgeA" || vm.fields[index] == "knowledgeB") {
                return value.name;
            }

            if (vm.fields[index] == "relation") {
                if (value == null) return "待标记";
                return value.name;
            }

            if (vm.fields[index] == "sentences") {
                return value.length;
            }
            return value;
        };

        vm.upload = upload;
        vm.search = search;
        vm.generate = generate;
        vm.exportAll = exportAll;
        vm.allocateSentence = allocateSentence;

        init();

        function init() {
            $scope.$watch('currentPage', function (newValue, oldValue, scope) {
                search();
            });
            getInfo();
        }

        function getInfo() {
            pairDao.getInfo(function (res) {
                vm.info = res;
            });
        }

        function upload() {
            pairDao.upload(vm.file, function (res) {

            });
        }

        function search() {
            pairDao.findByPage($scope.currentPage, vm.numPerPage, vm.searchConditon, function (res) {
                vm.values = res.content;
                vm.totalItems = res.totalElements;
            });
        }

        function generate() {
            pairDao.generate(function () {
                search();
                Prompt.promptSuccessMessage("关系对已生成!")
            });
        }

        function allocateSentence() {
            pairDao.allocateSentences(function (res) {
                Prompt.promptSuccessMessage("共记" + res.data.size + "个实例!")
            });
        }

        function modify(value) {
            pairDao.getGraph(value.id, function (res) {
                // 获取用于画图的数据
                var graphData = res;
                pairDao.getById(value.id, function (res) {
                    vm.pair = res;
                    var splitedWords;
                    for (var i = 0; i < vm.pair.sentences.length; i++) {
                        vm.pair.sentences[i].sentence = "";
                        splitedWords = vm.pair.sentences[i].splited.split(" ");
                        for (var j = 0; j < splitedWords.length; j++) {
                            if (splitedWords[j] == vm.pair.knowledgeA.name)
                                vm.pair.sentences[i].sentence += "<red>" + splitedWords[j] + "</red>";
                            else if (splitedWords[j] == vm.pair.knowledgeB.name)
                                vm.pair.sentences[i].sentence += "<blue>" + splitedWords[j] + "</blue>";
                            else
                                vm.pair.sentences[i].sentence += splitedWords[j];
                        }
                    }
                    $uibModal.open({
                        animation: true,
                        templateUrl: "modifyPanel.html",
                        controller: 'ModifyPanelCtrl',
                        controllerAs: 'modifyPanelCtrl',
                        size: 'lg',
                        resolve: {
                            pair: function () {
                                return vm.pair;
                            },
                            graphData: function () {
                                return graphData;
                            }
                        }
                    });
                });
            });
        }

        function deleteById() {
            Prompt.promptModifyMessage("是否确认删除该知识对？", function () {
                pairDao.deleteById(value.id, $scope.currentPage, vm.numPerPage, function (res) {
                    vm.values = res.content;
                    vm.totalItems = res.totalElements;
                });
            });
        }

        function exportAll() {
            pairDao.exportAll(function (res) {
                FileExport.export(res, "application/csv", "知识对.csv");
            });
        }
    }

    KBHome.controller('ModifyPanelCtrl', ['pairDao', "pair", "graphData", '$uibModalInstance', ModifyPanelCtrl]);

    function ModifyPanelCtrl(pairDao, pair, graphData, $uibModalInstance) {
        var vm = this;
        vm.pair = pair;
        vm.graphData = graphData;

        vm.submitFunc = function () {
            pairDao.tag(vm.pair.id, vm.relationId, function () {
                $uibModalInstance.close();
            });
        };

        vm.close = function () {
            $uibModalInstance.close();
        };
    }
})();