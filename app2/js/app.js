var app = angular.module('app', []);

app.controller('AppCtrl',[
    '$scope',
    function($scope){
        $scope.nodes = new vis.DataSet([]);
        $scope.edges = new vis.DataSet([]);
        nodoId = 1;

        container = document.getElementById('network');
        data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };
        options = {};

        network = new vis.Network(container, data, options);

        $scope.trayecto = [
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0},
            {'id': 0}
        ];
    }
]);