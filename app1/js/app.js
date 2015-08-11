var app = angular.module('app',[]);

app.controller('AppCtrl', [
    '$scope',
    function($scope){
        // Inicialización de Red
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();
        $scope.options = {};
        $scope.container = document.getElementById('network');
        $scope.data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };
        network = new vis.Network($scope.container, $scope.data, $scope.options);

        // Variables para Depuración en la consola
        nodes = $scope.nodes;
        edges = $scope.edges;

        // Funciones de Control de Creación de Red
        $scope.trayectoria = [{id: 0},{id: 0}];

        $scope.addNodo = function(){
            $scope.trayectoria.push({id: 0});
        };

        $scope.quitarNodo = function(){
            if ($scope.trayectoria.length > 2) {
                $scope.trayectoria.pop();
            }
        };

        $scope.crearTrayecto = function(){
            // Creación de Nodo unicamente si no existe
            angular.forEach($scope.trayectoria, function(value, key){
                if (!$scope.nodes.get(value.id)) {
                    node = {
                        id: value.id,
                        label: 'N-'+value.id
                    };
                    $scope.nodes.add(node);
                }
            });

            // Creación de Arcos
            for (var i = 0 ; i < $scope.trayectoria.length - 1; i++) {
                // Evita crear nodos que van a un mismo nodo
                if ($scope.trayectoria[i].id !== $scope.trayectoria[i+1].id ) {
                    // Verificamos si existe un arco entre un nodo y el nodo siguiente
                    if ($.inArray($scope.trayectoria[i+1].id, network.getConnectedNodes($scope.trayectoria[i].id)) == -1) {
                        edge = {
                            from: $scope.trayectoria[i].id,
                            to: $scope.trayectoria[i+1].id
                        };
                        $scope.edges.add(edge);
                    }
                }
            }
        };
    }
]);