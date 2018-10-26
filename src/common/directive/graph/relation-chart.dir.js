(function () {
    "use strict";

    var Utils = angular.module('Utils');
    Utils.directive('relationChart', [
        function () {
            return {
                restrict: 'AE',
                template: '<div class="relation-chart"></div>',
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
                            var option = {
                                title: {
                                    text: json.title
                                },
                                animationDurationUpdate: 1500,
                                animationEasingUpdate: 'quinticInOut',
                                series: [
                                    {
                                        type: 'graph',
                                        layout: 'force',
                                        // progressiveThreshold: 700,
                                        label: {
                                            normal: {
                                                show: true,
                                                textStyle: {
                                                    color: "#000"
                                                }
                                            }
                                        },
                                        edgeSymbol: ['circle', 'arrow'],
                                        edgeSymbolSize: [0, 5],
                                        roam: true,
                                        focusNodeAdjacency: true,
                                        draggable: true,
                                        force: {
                                            repulsion: 100,//斥力，越大越松散
                                            edgeLength: [20, 60],//边长
                                            gravity: 0.5//引力，越大越聚集
                                        },
                                        edgeLabel: {
                                            normal: {
                                                textStyle: {
                                                    fontSize: 20
                                                }
                                            }
                                        },
                                        data: json.nodes.map(function (node) {
                                            return {
                                                x: node.x,
                                                y: node.y,
                                                id: node.id + "",
                                                name: node.label,
                                                symbolSize: node.size,
                                                itemStyle: {
                                                    normal: {
                                                        color: node.color
                                                    }
                                                },
                                                fixed: true
                                            };
                                        }),
                                        edges: json.edges.map(function (edge) {
                                            return {
                                                source: edge.sourceID + "",
                                                target: edge.targetID + "",
                                                label: {
                                                    normal: {
                                                        formatter: edge.r,
                                                        show: true,
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [
                                                                {
                                                                    offset: 0, color: "yellow" // 0% 处的颜色
                                                                }, {
                                                                    offset: 1, color: "yellow" // 100% 处的颜色
                                                                }
                                                            ],
                                                            globalCoord: false // 缺省为 false
                                                        },
                                                        fontWeight: "lighter",
                                                    },
                                                    // emphasis:{
                                                    //     formatter: edge.r,
                                                    //     show: true,
                                                    //     color: "red"
                                                    // }
                                                },
                                                lineStyle: {
                                                    normal: {
                                                        width: 2,
                                                        curveness: 0.3,
                                                        opacity: 0.5,
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [
                                                                {
                                                                    offset: 0, color: edge.c // 0% 处的颜色
                                                                }, {
                                                                    offset: 1, color: edge.c // 100% 处的颜色
                                                                }
                                                            ]
                                                        }
                                                    },

                                                }
                                            };
                                        })
                                    }
                                ]
                            };
                            myChart.setOption(option, true);
                        }
                    }, true);
                }
            };
        }
    ]);
})();