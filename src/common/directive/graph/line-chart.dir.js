(function () {
    "use strict";

    var Utils = angular.module('Utils');
    Utils.directive('lineChart', [function () {
        return {
            restrict: 'AE',
            template: '<div class="line-chart"></div>',
            replace: true,
            scope: {
                chartData: "="
            },
            link: function ($scope, element, attrs) {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(element[0]);

                $scope.$watch(function () {
                    return $scope.chartData;
                }, function () {
                    var json = $scope.chartData;
                    if (json != null) {
                        var xAxisType = "category";
                        if (json.xAxisType != null)
                            xAxisType = json.xAxisType;
                        var option = {
                            title: {
                                text: json.title,
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: json.legendData
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                name: json.xAxisName,
                                nameLocation: "middle",
                                type: xAxisType,
                                boundaryGap: false,
                                data: json.xAxisData
                            },
                            yAxis: {
                                name: json.yAxisName,
                                type: 'value',
                                min: 0.6,
                                max: 1

                            },
                            series: json.series
                        };
                        myChart.setOption(option, true);
                    }
                }, true);
            }
        };
    }
    ]);
})();