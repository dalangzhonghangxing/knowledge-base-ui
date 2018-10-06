(function () {
    "use strict";

    var Utils = angular.module('Utils');
    Utils.directive('relationChart', [ function () {
            return {
                restrict: 'AE',
                template: '<div class="relation-chart"></div>',
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
                                animationDurationUpdate: 1500,
                                animationEasingUpdate: 'quinticInOut',
                                series: [
                                    {
                                        type: 'graph',
                                        layout: 'none',
                                        // progressiveThreshold: 700,
                                        data: json.nodes.map(function (node) {
                                            return {
                                                x: node.x,
                                                y: node.y,
                                                id: node.id,
                                                name: node.label,
                                                symbolSize: node.size,
                                                itemStyle: {
                                                    normal: {
                                                        color: node.color
                                                    }
                                                }
                                            };
                                        }),
                                        edges: json.edges.map(function (edge) {
                                            return {
                                                source: edge.sourceID,
                                                target: edge.targetID
                                            };
                                        }),
                                        label: {
                                            emphasis: {
                                                position: 'right',
                                                show: true
                                            }
                                        },
                                        roam: true,
                                        focusNodeAdjacency: true,
                                        lineStyle: {
                                            normal: {
                                                width: 0.5,
                                                curveness: 0.3,
                                                opacity: 0.7
                                            }
                                        }
                                    }
                                ]
                            };
                            myChart.setOption(option, true);
                        }
                    },true);
                }
            };
        }
    ]);
})();