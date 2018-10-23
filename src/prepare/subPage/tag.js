(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('TagCtrl', ['pairDao', 'relationDao', TagCtrl]);

    function TagCtrl(pairDao, relationDao) {
        var vm = this;
        vm.values = [];
        vm.pair = {};
        vm.defaultRelation = null;
        vm.preQueue = [];// 记录以打标签的队列

        vm.next = next;
        vm.pre = pre;

        init();

        function init() {
            getUntagedPair();
        }

        // 获取未标记的pair
        function getUntagedPair() {
            pairDao.getUntagedPair(1, 10, function (res) {
                for (var i = 0; i < res.content.length; i++)
                    vm.values.push(res.content[i]);
                if (vm.pair.name == null) {
                    getNext();
                }
            });
        }

        // 上一个pair，并将该pair从队列中移除
        function pre() {
            if (vm.preQueue.length > 0) {
                vm.relationId = vm.defaultRelation;
                vm.pair = vm.preQueue[vm.preQueue.length - 1];
                vm.preQueue.splice(vm.preQueue.length - 1, 1);
            }
        }

        // 提交并获取下一个未打标签的piar
        function next() {
            if (vm.relationId != null)
                pairDao.tag(vm.pair.id, vm.relationId, function (res) {
                    pushPreQueue(vm.pair);
                    vm.values.splice(0, 1);
                    getNext();
                });
            else{// 如果没有打，则直接跳到下一个
                pushPreQueue(vm.pair);
                vm.values.splice(0, 1);
                getNext();
            }
        }

        function getNext() {
            vm.relationId = vm.defaultRelation;
            vm.pair = vm.values[0];

            pairDao.getGraph(vm.pair.id, function (res) {
                vm.graphData = res;
            });

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
            // 缓存的未标记对长度<=3，则再从后台拿
            if (vm.values.length <= 3)
                getUntagedPair();
        }

        // 将一个pair放入preQueue队列。
        function pushPreQueue(pair) {
            // preQueue值存放10个pair
            if (vm.preQueue.length >= 10)
                vm.preQueue.splice(0, 1);
            vm.preQueue.push(pair);
        }
    }
})();