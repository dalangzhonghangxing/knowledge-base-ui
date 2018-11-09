(function () {
    'use strict';
    var utils = angular.module('Utils');

    utils.service("resultDao", ["connection", 'QUERY_PARAMS', relationDao]);

    function relationDao(connection, QUERY_PARAMS) {

        var vm = this;

        var API = "/result";

        vm.getLineByModelName = getLineByModelName;
        vm.getModelNames = getModelNames;

        function getLineByModelName(modelName, callback) {
            connection.get(API + "/line", {"modelName": modelName}, callback);
        }

        function getModelNames(callback) {
            connection.get(API + "/modelNames", {}, callback);
        }

    }
})();