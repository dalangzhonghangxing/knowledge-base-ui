(function () {
    "use strict";

    var Utils = angular.module('Utils');
    Utils.directive('barChart', [ function () {
        return {
            restrict: 'AE',
            template: '<div class="bar-chart"></div>',
            replace: true,
            scope:{
                chartData:"="
            },
            link: function ($scope, element, attrs) {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(element[0]);

                $scope.$watch(function () { return $scope.chartData; }, function () {
                    var json = $scope.chartData;
                    if (json != null) {
                        var option = {
                            title: {
                                text: json.title
                            },
                            color: ['#3398DB'],
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : json.xAxisData,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    splitLine: {lineStyle:{type:'dashed'}}
                                }
                            ],
                            series : json.series
                        };
                        myChart.setOption(option, true);
                    }
                },true);
            }
        };
    }
    ]);
})();