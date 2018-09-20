(function () {
    'use strict';
    var utils = angular.module('Utils');

    utils.service("relationDao", ["connection", 'QUERY_PARAMS', relationDao]);

    function relationDao(connection, QUERY_PARAMS) {

        var vm = this;

        var API = "/relation";

        vm.upload = upload;
        vm.findByPage = findByPage;
        vm.deleteById = deleteById;

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
    }
})();