/**
 * 工具类
 */
(function () {
    'use strict';
    var utils = angular.module('Utils');

    /* 操作url路径的一些服务 */
    utils.service('PathUtils', ['ENDPOINTS', PathUtils]);
    function PathUtils(ENDPOINTS) {
        var vm = this;

        // 将给定路径加上项目的根路径
        vm.getRootPath = getRootPath;

        // 获取给定路径的上级路径
        vm.getParentPath = getParentPath;

        // 与getRootPath类似
        vm.qualifiedPath = qualifiedPath;
        vm.qualifiedAPIPath = qualifiedAPIPath;
        vm.qualifiedStaticPath = qualifiedStaticPath;
        vm.removeParams = removeParams;
        vm.getPathFromUrl = getPathFromUrl;
        vm.getRelativePath = getRelativePath;

        function getRootPath() {
            return ENDPOINTS.ROOT_PATH;
        }

        //path that removes the domain
        function getRelativePath(path) {
            if (path.startsWith(ENDPOINTS.ROOT_PATH)) {
                return path.substring(ENDPOINTS.ROOT_PATH.length, path.length);
            } else {
                return path;
            }
        }

        function getParentPath(path) {
            return path.substring(0, path.lastIndexOf('/'));
        }

        function qualifiedPath(path) {
            return ENDPOINTS.ROOT_PATH + path;
        }

        function removeParams(path) {
            if (path.lastIndexOf('?') > 0) {
                var ret = path.substring(0, path.indexOf('?'));
                var params = path.substring(path.indexOf('?'));
                if (ret.indexOf('#') == -1 && params.lastIndexOf("#/") != -1) {
                    ret = ret + params.substring(params.lastIndexOf("#/"));
                }
                return ret;
            }

            return path;
        }

        function getPathFromUrl(url) {
            url = url.substring(ROOT_PATH.length, url.length);
            return this.removeParams(url);
        }

        function qualifiedStaticPath(path) {
            if (path.indexOf('/') == 0)
                return ENDPOINTS.STATIC_PATH + path;
            else
                return ENDPOINTS.STATIC_PATH + "/" + path;
        }

        function qualifiedAPIPath(path) {
            return ENDPOINTS.SERVICE_API_ROOT + path;
        }
    }

    /* 页面之间传递session数据的服务 */
    utils.service('SessionByCookie', ['$cookies', SessionByCookie]);
    function SessionByCookie($cookieStore) {
        var vm = this;

        vm.setItem = setItem;
        vm.getItem = getItem;
        vm.remove = remove;

        function setItem(key, value) {
            $cookieStore.put(key, value);
        }

        function getItem(key) {
            return $cookieStore.get(key);
        }

        function remove(key) {
            $cookieStore.remove(key);
        }
    }


    utils.service('LocalStorage', ['$localStorage', LocalStorage]);
    function LocalStorage($localStorage) {
        var vm = this;

        vm.setItem = setItem;
        vm.getItem = getItem;

        function setItem(key, value) {
            $localStorage[key] = value;
        }

        function getItem(key) {
            return $localStorage[key];
        }
    }

    /**导出数据服务**/
    utils.service('FileExport', FileExport);
    function FileExport() {
        this.export = function (data, type, filename) {
            var blob = new Blob([data], {type: type});
            saveAs(blob, filename);
        }
    }

    /**加载图片,常用类型有image/jpeg**/
    utils.service('LoadImage', LoadImage);
    function LoadImage() {
        this.loadImage = function (data, type) {
            var blob = new Blob([data], {type: type});
            return blob;
        }
    }

    // 弹框组件
    utils.service("Prompt", ['$uibModal', 'PathUtils', Prompt]);
    function Prompt($uibModal, PathUtils) {
        var vm = this;

        var buttonNames = {"names": ['关闭']};
        var buttons = [
            function () {
            }
        ];

        vm.promptCustomMessage = promptCustomMessage;
        vm.promptInfoMessage = promptInfoMessage;
        vm.promptWarnMessage = promptWarnMessage;
        vm.promptErrorMessage = promptErrorMessage;
        vm.promptSuccessMessage = promptSuccessMessage;
        vm.promptModifyMessage = promptModifyMessage;//修改统一用这个
        vm.exportErrors = exportErrors;
        vm.exportCheckResult = exportCheckResult;

        function promptCustomMessage(icon, message, buttonFunctions, buttonNames) {
            if(typeof message === "string"){
                message = {"msg":message};
            }
            return $uibModal.open({
                                      animation: true,
                                      templateUrl: PathUtils.qualifiedPath(
                                          "/common/directive/propmtMessage-panel.html"),
                                      controller: 'PromptMessageCtrl',
                                      controllerAs: 'promptMessageCtrl',
                                      windowClass: 'app-modal-window',
                                      resolve: {
                                          icon: icon,
                                          message: message,
                                          buttonFunctions: function () {
                                              return buttonFunctions
                                          },
                                          buttonNames: buttonNames
                                      }
                                  });
        }

        function promptInfoMessage(proMessage) {
            var type = {'type': 'fa-info-circle'};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function promptWarnMessage(proMessage) {
            var type = {'type': 'fa-exclamation-triangle'};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function promptErrorMessage(proMessage) {
            var type = {'type': 'fa-times-circle'};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function promptSuccessMessage(proMessage) {
            var type = {'type': 'fa-check-circle'};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function promptModifyMessage(proMessage, callback) {
            var buttons = [
                callback, function () {

                }
            ];
            var type = {'type': 'fa-exclamation-triangle'};
            var buttonNames = {"names": ['确认', '取消']};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function exportErrors(proMessage, callback) {
            var buttons = [
                callback, function () {

                }
            ];
            var type = {'type': 'fa-exclamation-triangle'};
            var buttonNames = {"names": ['导出失败条目', '取消']};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

        function exportCheckResult(proMessage, callback) {
            var buttons = [
                callback, function () {}
            ];
            var type = {'type': 'fa-exclamation-triangle'};
            var buttonNames = {"names": ['导出核对结果', '取消']};
            return promptCustomMessage(type, proMessage, buttons, buttonNames);
        }

    }

    utils.service("exportStudent", ['$uibModal', 'PathUtils', exportStudent]);
    function exportStudent($uibModal, PathUtils) {

        this.showExportStudentPanel = showExportStudentPanel;

        function showExportStudentPanel(searchCondition) {
            $uibModal.open({
                               animation: true,
                               backdrop: 'static',
                               size: "lg",
                               templateUrl: PathUtils.qualifiedPath(
                                   "/common/directive/exportStudentPanel.html"),
                               controller: 'ExportPanelCtrl',
                               controllerAs: 'exportPanelCtrl',
                               windowClass: 'exportPanel',
                               resolve: {
                                   searchCondition: function () {
                                       return searchCondition;
                                   }
                               }
                           });
        }
    }

})();
