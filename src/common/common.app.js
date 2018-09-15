/**
 * @author xiafan
 */

(function () {
    'use strict';

    var utils = angular.module('ecnuUtils',
        [
            'ngCookies', 'ngStorage', 'ui.bootstrap', 'ngFileUpload', 'angular-timeline'
            , 'ecnuConfig', 'ecnuBrowserCheck', 'LocalStorageModule', 'ngHopscotch'
        ]);

    utils.config(['$httpProvider', '$cookiesProvider', config]);
    function config($httpProvider, $cookiesProvider) {
        $httpProvider.defaults.withCredentials = true;
        $cookiesProvider.defaults.path = '/';
    }

    utils.filter("parseHTML", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    });

    utils.run([
        '$http',
        '$route',
        'SessionByCookie',
        'EcnuConnection',
        'PageState',
        'Prompt',
        'loginUtil',
        'systemExecutor',
        run
    ]);
    function run($http, $route, SessionByCookie, EcnuConnection, PageState, Prompt, loginUtil, systemExecutor) {
        // 下面这行代码用于保证route模块总是能够捕捉到url变化的事件
        $route.reload();

        $http.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
        if (SessionByCookie.getItem('XSRF-TOKEN') != null)
            $http.defaults.headers.common['X-CSRF-TOKEN'] = SessionByCookie.getItem('XSRF-TOKEN');

        EcnuConnection.errorHandler = function (err, status) {
            // FIXME: 目前对于options和preflight请求被403的时候, err为null, status为-1。
            // 但是不能确定是否能够通过这个组合就将用户重定向到登录页面
            var reason = "服务无法访问";
            if (status != -1 && err != null) {
                reason = err.message;
            }

            var proMessage = {"msg": reason};
            var instance = Prompt.promptErrorMessage(proMessage);
            instance.result.then(function (res) {
            }, function (res) {
                if (status == 401 || status == 403) {
                    PageState.clearSession(err.data.loginUrl);
                }

                if (status >= 400 && status < 500) {
                    //PageState.clearSession(err.data.loginUrl);
                }
            });
            if (document.getElementById("mask") != null)
                document.getElementById("mask").style.display = 'none';
        };

        //自动进行cas登录，如果成功了设置系统的状态
        loginUtil.casLogin(function (res) {
            //根据res设置初始化角色
            //不管成功与否,都要表示为系统初始化ok
            //systemExecutor.setCondition(systemExecutor.LOGIN_COMPLETE, true);
            if (res != null) {
                //选择一个权限最高的角色访问当前页面
                PageState.chooseSafestPageType(function () {
                    systemExecutor.setCondition(systemExecutor.READY, true);
                });
            } else {
                //验证当前角色是否有权限访问当前页面
                PageState.verifyPageAccesibility();
                systemExecutor.setCondition(systemExecutor.READY, true);
            }
        });

        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        // 例子：
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;

        }
    }
})();