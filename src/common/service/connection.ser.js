/**
 * 发起http请求的基本方法
 */

(function () {
    'use strict';
    var utils = angular.module('Utils');
    utils.service('connection',
        [
            '$http',
            'SessionByCookie',
            'Upload',
            'PathUtils',
            'Prompt',
            'FileExport',
            '$interval',
            connection
        ]);

    /**
     * @description 服务器连接的类
     */
    function connection($http, SessionByCookie, Upload, PathUtils, Prompt, FileExport, $interval) {
        var conn = {};
        var vm = {};
        var getProgress;
        conn.errorHandler = errorHandler;
        conn.uploadErrorHandler = uploadErrorHandler;
        conn.post = post;
        conn.get = get;
        conn.delete = deleteImpl;
        conn.patch = patch;
        conn.put = put;
        conn.upload = upload;
        conn.putByRequestBody = putByRequestBody;
        conn.postByBody = postByBody;
        conn.getWithHeaders = getWithHeaders;
        conn.uploadWithAnimation = uploadWithAnimation;
        conn.postWithProgress = postWithProgress;
        // conn.uploadAndCheck = uploadAndCheck;

        return conn;

        function invoke(method, args) {
            var url = PathUtils.qualifiedAPIPath(args[0]);
            var httpCfg = args[1];
            var callback = args[2];
            httpCfg["url"] = url;
            httpCfg["method"] = method;
            httpCfg["headers"] = {
                'Content-Type': 'application/json'
            };
            if (SessionByCookie.getItem('XSRF-TOKEN') != null)
                httpCfg.headers['X-CSRF-TOKEN'] = SessionByCookie.getItem('XSRF-TOKEN');

            if (args.length > 3) {
                var additionalCfg = args[3];
                for (var fieldName in additionalCfg) {
                    httpCfg[fieldName] = additionalCfg[fieldName];
                }
            }

            $http(httpCfg).success(function (response) {
                callback(response);
            }).error(conn.errorHandler);
        }

        function invokeWithHeaders(method, args) {
            var url = PathUtils.qualifiedAPIPath(args[0]);
            var httpCfg = args[1];
            var callback = args[2];
            httpCfg["url"] = url;
            httpCfg["method"] = method;
            // httpCfg["headers"] = {
            //     'Access-Control-Allow-Origin': '*'
            // };
            if (SessionByCookie.getItem('XSRF-TOKEN') != null)
                httpCfg.headers['X-CSRF-TOKEN'] = SessionByCookie.getItem('XSRF-TOKEN');

            if (args.length > 3) {
                var additionalCfg = args[3];
                for (var fieldName in additionalCfg) {
                    httpCfg[fieldName] = additionalCfg[fieldName];
                }
            }
            $http(httpCfg).success(function (response) {
                callback(response);
            }).error(conn.errorHandler);
        }

        function post(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("post", arguments)
        }

        function postByBody(url, params, callback) {
            arguments[1] = {
                data: params
            };
            invoke("post", arguments)
        }

        function postWithProgress(url, params, callback) {
            var random = new Date().getTime().toString();
            params["tag"] = random;

            getProgress = $interval(function () {
                $http({
                    'url': PathUtils.qualifiedAPIPath("/global/progress") + "?tag=" + random,
                    'method': "get",
                    "headers":{
                        "withCredentials":true
                    }
                }).success(function (res) {
                    document.getElementById("mask-progress").innerHTML = res + '%';
                }).error(function () {
                    $interval.cancel(getProgress);
                })
            }, 500);

            $http({
                'url': PathUtils.qualifiedAPIPath(url),
                'data': params,
                'method': "post"
            }).then(function (res) {
                if (getProgress != null)
                    $interval.cancel(getProgress);
                callback(res);
            }, function (error) {
                conn.uploadErrorHandler(error.data, error.status, function () {
                    if (getProgress != null)
                        $interval.cancel(getProgress);
                })
            }, progress);

        }

        function get(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("get", arguments)
        }

        function putByRequestBody(url, params, callback) {
            arguments[1] = {
                data: params
            };
            invoke("put", arguments)
        }

        function put(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("put", arguments)
        }

        function deleteImpl(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("delete", arguments)
        }

        function patch(url, params, callback) {
            arguments[1] = {
                data: params
            };
            invoke("patch", arguments)
        }

        function getWithHeaders(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invokeWithHeaders("get", arguments)
        }


        function upload(url, param, callback) {
            var random = new Date().getTime().toString();
            param["tag"] = random;
            getProgress = $interval(function () {
                $http({
                    'url': PathUtils.qualifiedAPIPath("/global/progress") + "?tag=" + random,
                    'method': "get"
                }).success(function (res) {
                    document.getElementById("mask-progress").innerHTML = res + '%';
                }).error(function () {
                    $interval.cancel(getProgress);
                })
            }, 500);


            var headers = {
                'Access-Control-Allow-Origin': '*'
            };
            if (SessionByCookie.getItem('XSRF-TOKEN') != null)
                headers['X-CSRF-TOKEN'] = SessionByCookie.getItem('XSRF-TOKEN');
            Upload.upload(
                {
                    url: PathUtils.qualifiedAPIPath(url),
                    headers: headers,
                    data: param,
                    method: 'post',
                    arrayKey: ''
                }).then(function (res) {
                success(res);
                callback(res);
            }, function (error) {
                conn.uploadErrorHandler(error.data, error.status, function () {
                    if (getProgress != null)
                        $interval.cancel(getProgress);
                })
            }, progress);
        }

        // 进度条功能
        function progress() {
            if (document.getElementById("mask") != null) {
                document.getElementById("mask").style.display = 'block';
                getProgress.then(function () {
                    // console.log("success");
                });
            }
        }

        function uploadWithAnimation(url, params, callback) {
            Upload.upload({
                url: PathUtils.qualifiedAPIPath(url),
                data: params,
                arrayKey: ''
            }).then(function (response) {
                    document.getElementById("mask").style.display = 'none';
                    callback(response.data);
                }, function (error) {
                    document.getElementById("mask").style.display = 'none';
                    Prompt.promptErrorMessage({"msg": error.data.message});
                },
                function () {
                    document.getElementById("mask").style.display = 'block';
                    document.getElementById("mask-progress").innerHTML = "申请提交中...";
                });
        }


        function success(response) {
            document.getElementById("mask").style.display = 'none';
            $interval.cancel(getProgress);

            Prompt.promptSuccessMessage("上传成功，总共上传" + response.data.size + "条数据。");
        }

        function uploadErrorHandler(error, status, cancelProgress) {
            if (document.getElementById("mask") != null)
                document.getElementById("mask").style.display = 'none';
            if (error != null && error.message != null)
                Prompt.promptErrorMessage({"msg": error.message});
            cancelProgress();
        }
    }

    function errorHandler(error, status, cancelProgress) {
        if (document.getElementById("mask") != null)
            document.getElementById("mask").style.display = 'none';
        Prompt.promptErrorMessage({"msg": error.message});
        cancelProgress();
    }
})();