(function () {
    'use strict';

    var KBHome = angular.module('KBHome');

    KBHome.controller('TagCtrl', ['pairDao', 'relationDao', TagCtrl]);

    function TagCtrl(pairDao, relationDao) {
        var vm = this;
        vm.values = [];
        vm.pair = {};
        vm.defaultRelation;

        vm.next = next;
        document.onkeydown = keydown;

        init();

        function init() {
            getUntagedPair();
            getRelation();
        }

        function getRelation() {
            relationDao.findByPage(1, 1024, function (res) {
                vm.relations = res.content;
                for (var index in vm.relations)
                    if (vm.relations[index].name == "无关")
                        vm.defaultRelation = vm.relations[index].id;
                vm.relationId = vm.defaultRelation;
                getFocus();
            })
        }


        function getUntagedPair() {
            pairDao.getUntagedPair(1, 10, function (res) {
                for (var i = 0; i < res.content.length; i++)
                    vm.values.push(res.content[i]);
                if (vm.pair.name == null) {
                    getNext();
                }
            });
        }

        function next() {
            pairDao.tag(vm.pair.id, vm.relationId, function (res) {
                getNext();
            })
        }

        function getNext() {
            vm.relationId = vm.defaultRelation;
            vm.pair = vm.values[0];
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
            vm.values.splice(0, 1);
            if (vm.values.length <= 3)
                getUntagedPair();
        }

        function getFocus() {
            if (document.getElementsByClassName("relation-radio")[2] != null)
                (document.getElementsByClassName("relation-radio")[2]).focus();
        }

        function keydown() {
            // 方向键
            if (event.keyCode >= 37 && event.keyCode <= 40)
                getFocus();

            // 回车
            if (event.keyCode == 13)
                next();
        }
    }
})();