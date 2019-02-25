(function () {
    'use strict';
    var utils = angular.module('Utils');

    utils.service("pairDao", ["connection", 'QUERY_PARAMS', pairDao]);

    function pairDao(connection, QUERY_PARAMS) {

        var vm = this;

        var API = "/pair";

        vm.upload = upload;
        vm.findByPage = findByPage;
        vm.deleteById = deleteById;
        vm.generate = generate;
        vm.getUntagedPair = getUntagedPair;
        vm.tag = tag;
        vm.exportAll = exportAll;
        vm.getInfo = getInfo;
        vm.getById = getById;
        vm.getGraph = getGraph;
        vm.getAllGraph = getAllGraph;
        vm.generateDataset = generateDataset;
        vm.getCountData = getCountData;
        vm.allocateSentences = allocateSentences;
        vm.getInstanceCountData = getInstanceCountData;
        vm.getEntityPairSentenceCountData = getEntityPairSentenceCountData;
        vm.conceptQuery = conceptQuery;


        function generate(callback) {
            connection.postWithProgress(API + "/generate", {}, callback);
        }

        function generateDataset(callback) {
            connection.postWithProgress(API + "/generate-dataset", {}, callback);
        }

        function allocateSentences(callback) {
            connection.postWithProgress(API + "/sentences", {}, callback);
        }

        function upload(file, callback) {
            var param = {};
            param["file"] = file;
            connection.upload(API + "/upload", param, callback);
        }

        function findByPage(page, size, condition, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = condition;
            connection.get(API + "/page", param, callback)
        }

        function deleteById(id, page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            connection.delete(API + "/" + id, param, callback)
        }

        function getUntagedPair(page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            connection.get(API + "/untaged", param, callback)
        }

        function tag(id, relationId, callback) {
            var param = {};
            param["relationId"] = relationId;
            connection.post(API + "/" + id, param, callback);
        }

        function exportAll(callback) {
            connection.get(API + "/export", {}, callback,
                {responseType: 'arraybuffer'});
        }

        function getInfo(callback) {
            connection.get(API + "/info", {}, callback)
        }

        function getById(id, callback) {
            connection.get(API + "/" + id, {}, callback)
        }

        function getGraph(id, callback) {
            connection.get(API + "/graph/" + id, {}, callback)
        }

        function getAllGraph(relationIds, callback) {
            connection.get(API + "/graph", {"relationIds": relationIds}, callback)
        }

        function getCountData(callback) {
            connection.get(API + "/count", {}, callback)
        }

        function getInstanceCountData(callback) {
            connection.get(API + "/instance-count", {}, callback)
        }

        function getEntityPairSentenceCountData(callback) {
            connection.get(API + "/entity-pair-sentence-count", {}, callback)
        }

        function conceptQuery(knowledgeA,knowledgeB, callback) {
            var param = {};
            param["knowledgeA"] = knowledgeA;
            param["knowledgeB"] = knowledgeB;
            connection.get(API + "/concept-query", param, callback)
        }
    }
})();