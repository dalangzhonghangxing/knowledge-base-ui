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

        function generate(callback) {
            connection.postWithProgress(API + "/generate", {}, callback)
        }

        function upload(file, callback) {
            var param = {};
            param["file"] = file;
            connection.upload(API + "/upload", param, callback);
        }

        function findByPage(page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
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
    }
})();