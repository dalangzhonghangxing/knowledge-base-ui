(function () {
    'use strict';
    var utils = angular.module('Utils');

    utils.service("knowledgeDao", ["connection", 'QUERY_PARAMS', knowledgeDao]);

    function knowledgeDao(connection, QUERY_PARAMS) {

        var vm = this;

        var API = "/knowledge";

        vm.upload = upload;
        vm.findByPage = findByPage;
        vm.deleteById = deleteById;
        vm.save = save;
        vm.exportAll = exportAll;

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

        function save(value, callback) {
            var id = 0;
            if (value.id != null)
                id = value.id;
            connection.postByBody(API + "/" + id, value, callback);
        }

        function exportAll(callback) {
            connection.get(API + "/export", {}, callback,
                     {responseType: 'arraybuffer'});
        }
    }
})();