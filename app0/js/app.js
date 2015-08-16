var app = angular.module('app',[]);

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

        $scope.nodo = {
            add: function(tipo){
                if (tipo == 'int') {
                    color = '#CCCDC5';
                    label = 'I-';
                }else{
                    color = '#F8D2AD';
                    label = 'PR-';
                }
                nodo = {
                    id: nodoId,
                    label: label+nodoId,
                    color: color
                };
                nodoId += 1;
                $scope.nodes.add(nodo);
            }
        };

        $scope.arco = {
            add: function(){
                arco = {
                    from: $scope.arco_from,
                    to: $scope.arco_to,
                    label: $scope.arco_from+'-'+$scope.arco_to
                };
                $scope.edges.add(arco);
            }
        };
    }
]);