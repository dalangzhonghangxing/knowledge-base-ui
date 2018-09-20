/**
 * 在当前文件中执行一些浏览前兼容性相关的处理
 */

(function () {
    //额外定义这个module,只是为了保证它在所有其它文件之前被引用
    var BrowserCheck = angular.module('BrowserCheck', []);

    if (String.prototype.hasOwnProperty("startsWith") == false) {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    if (String.prototype.hasOwnProperty("endsWith") == false) {
        String.prototype.endsWith = function (str) {
            return this.lastIndexOf(str) === this.length - str.length;
        };
    }

})();