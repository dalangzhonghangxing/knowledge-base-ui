/**
 * 页脚指令
 */
(function () {
    'use strict';

    var utils = angular.module('Utils');
    utils.directive("footerPanel", ['PathUtils', footerPanel]);

    function footerPanel(PathUtils) {
        return {
            restrict: 'E',
            bindToController: {},
            scope: {},
            controller: ['PathUtils', FooterCtrl],
            controllerAs: 'footerCtrl',
            templateUrl: PathUtils.qualifiedPath("/common/directive/layout/footer.html")
        }
    }

    function FooterCtrl(PathUtils) {
        var vm = this;
    }

})();