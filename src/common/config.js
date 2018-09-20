/**
 * 配置文件
 */

(function () {
    //额外定义这个module,只是为了保证它在所有其它文件之前被引用
    var config = angular.module('Config', ['BrowserCheck']);

    /* 以下代码在加载当前js文件后执行，这样可以获得当前js代码的位置 */
    var scripts = document.getElementsByTagName("script");
    scripts = scripts[scripts.length - 1].src;
    var ROOT_PATH = scripts.substring(0, scripts.lastIndexOf('/'));
    ROOT_PATH = ROOT_PATH.substring(0, ROOT_PATH.lastIndexOf('/'));
    // SERVICE_API_ROOT: "http://219.228.60.212:16666/api/",
    var ENDPOINTS = {
        ROOT_PATH: ROOT_PATH,
        SERVICE_API_ROOT: "http://219.228.60.212:16666/api/",
        STATIC_PATH: "http://localhost:8888"
    };
    Object.freeze(ENDPOINTS);
    config.constant("ENDPOINTS", ENDPOINTS);

    var QUERY_PARAMS = {
        //---------------以下为默认值---------------
        VALUE_SET_ALL: "所有",
        VALUE_STRING_ALL: "所有",

        //---------------以下分页相关---------------

        PAGE_SIZE: "size",

        PAGE: "page",

        //------------以下为上传文件相关-------------
        FILE: "file",
        TYPE: "type",

    };
    Object.freeze(QUERY_PARAMS);
    //定义与后端传递的参数名
    config.constant("QUERY_PARAMS", QUERY_PARAMS);

})();