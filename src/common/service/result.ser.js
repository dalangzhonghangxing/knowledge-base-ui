(function () {
    'use strict';
    var utils = angular.module('Utils');

    utils.service("resultDao", ["connection", 'QUERY_PARAMS', relationDao]);

    function relationDao(connection, QUERY_PARAMS) {

        var vm = this;

        var API = "/result";

        vm.getLineByModelName = getLineByModelName;
        vm.getModelNames = getModelNames;
        vm.getAccuraciesByModelNames = getAccuraciesByModelNames;
        vm.getLossesByModelNames = getLossesByModelNames;
        vm.getPRsByModelNames = getPRsByModelNames;
        vm.deleteByModelName = deleteByModelName;

        function getLineByModelName(modelName, callback) {
            connection.get(API + "/line", {"modelName": modelName}, callback);
        }

        function getModelNames(callback) {
            connection.get(API + "/modelNames", {}, callback);
        }

        function getAccuraciesByModelNames(modelNames, callback) {
            connection.get(API + "/accuracy", {"modelNames": modelNames}, callback);
        }

        function getLossesByModelNames(modelNames,callback) {
            connection.get(API + "/loss", {"modelNames": modelNames}, callback);
        }

        function getPRsByModelNames(modelNames,callback) {
            connection.get(API + "/pr", {"modelNames": modelNames}, callback);
        }

        function deleteByModelName(modelName,callback) {
            connection.delete(API, {"modelName": modelName}, callback);
        }
    }
})();