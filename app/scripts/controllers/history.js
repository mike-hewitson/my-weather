'use strict';



function buildChart(sensor, readings) {

    function buildRows(sensor, readings) {
        function getSensorByName(name, sensors) {
            return sensors.filter(
                function(sensor) {
                    return sensor.sensor === name;
                }
            );
        }

        var rows = [];

        for (var i = 0; i < readings.length; i++) {
            var data = getSensorByName(sensor, readings[i].sensors)[0];
            if (data) {
               rows.push({ c: [{ v: new Date(readings[i].date) },
                { v: data.temp.toFixed(1) },
                { v: data.wind.toFixed(1) },
                { v: data.cloud.toFixed(1) },
                // { v: data.pressure.toFixed(1) },
                { v: data.hum.toFixed(1) }] });
            }
        }
        return rows;
    }

    var chartObject = {};
    var cols = [
        { id: 't', label: 'Date', type: 'datetime' },
        { id: 's', label: 'Temperature', type: 'number' },
        { id: 's', label: 'Wind Speed', type: 'number' },
        { id: 's', label: 'Cloud Cover', type: 'number' },
        { id: 's', label: 'Humidity', type: 'number' }
        // { id: 's', label: 'Pressure', type: 'number' }
    ];
    var rows = buildRows(sensor, readings);
    var title = sensor + ' Conditions';
    chartObject.type = 'LineChart';
    chartObject.data = {
        'cols': cols,
        'rows': rows
    };

    chartObject.options = {
        'title': title,
        curveType: 'function',
        smoothLine: true,
        series: {
            0: { targetAxisIndex: 0, type: 'line' },
            1: { targetAxisIndex: 0, type: 'line' },
            2: { targetAxisIndex: 1, type: 'line' },
            3: { targetAxisIndex: 1, type: 'line' }
        },
        vAxes: [
            { title: 'Degrees C' },
            { title: 'Percentage' }
        ]
    };
    return chartObject;

}

/**
 * @ngdoc function
 * @name fridgesApp.controller:MainCtrl
 * @description
 * # HistoryCtrl
 * Controller of the fridgesApp
 */
angular.module('fridgesApp')
    .controller('HistoryChartCtrl', ['$scope', 'historyFactory', function($scope, historyFactory) {

        $scope.loadHistory = function() {

            $scope.showData = false;
            $scope.message = 'Loading ...';
            historyFactory.getHistory().get( { id: $scope.days }).$promise.then(
                function(response) {
                    $scope.readings = response;
                    $scope.showData = true;
                    $scope.message = '';

                    $scope.chartObject1 = {};

                    /* istanbul ignore next */
                    function hideSeries(selectedItem) {
                        var col = selectedItem.column;
                        if (selectedItem.row === null) {
                            if ($scope.chartObject1.view.columns[col] === col) {
                                $scope.chartObject1.view.columns[col] = {
                                    label: $scope.chartObject1.data.cols[col].label,
                                    type: $scope.chartObject1.data.cols[col].type,
                                    calc: function() {
                                        return null;
                                    }
                                };
                            } else {
                                $scope.chartObject1.view.columns[col] = col;
                            }
                        }
                    }

                    $scope.hideSeries = hideSeries;

                    $scope.chartObject1 = buildChart('Sandton', $scope.readings);
                    $scope.chartObject1.view = {
                        columns: [0, 1, 2, 3, 4]
                    };

                    // Hide humidity column
                    $scope.chartObject1.view.columns[4] = {
                        label: $scope.chartObject1.data.cols[4].label,
                        type: $scope.chartObject1.data.cols[4].type,
                        /* istanbul ignore next */
                        calc: function() {
                             /* istanbul ignore next */
                            return null;
                        }
                    };

                    $scope.chartObject2 = buildChart('Paradise Beach', $scope.readings);
                    $scope.chartObject2.view = {
                        columns: [0, 1, 2, 3, 4]
                    };

                    // Hide humidity column
                    $scope.chartObject2.view.columns[4] = {
                        label: $scope.chartObject2.data.cols[4].label,
                        type: $scope.chartObject2.data.cols[4].type,
                        /* istanbul ignore next */
                        calc: function() {
                             /* istanbul ignore next */
                            return null;
                        }
                    };
                },
                /* istanbul ignore next */
                function(response) {
                    $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
                });
        };

        $scope.days = 7;
        $scope.loadHistory();


    }]);
