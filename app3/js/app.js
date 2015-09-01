var app = angular.module('app', []);

app.controller('AppCtrl',[
    '$scope',
    function($scope){
        // Definición de Grafo con VisJs
        $scope.nodes = new vis.DataSet([]);
        $scope.edges = new vis.DataSet([]);
        $scope.options = {};
        $scope.container = document.getElementById('network');
        $scope.data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };
        network = new vis.Network($scope.container, $scope.data, $scope.options);

        // Definición de Variables para la depuración por Consola
        deb = {
            nodes: $scope.nodes,
            edges: $scope.edges,
            data: $scope.data,
            options: $scope.options,
            container: $scope.container
        };

        // Definición de Datos Iniciales para la creación del Trayecto
        $scope.trayecto = [
            {id: ''},
            {id: ''}
        ];

        // Funciones para los controles de creación de Trayecto
        $scope.nodo = {
            add: function(){
                $scope.trayecto.push({id: ''});
            },
            remove: function(){
                if ($scope.trayecto.length > 2) {
                    $scope.trayecto.pop();
                }
            }
        };

        $scope.trayectoria = {
            clean: function(){
                angular.forEach($scope.trayecto, function(value, key){
                    value.id = '';
                });
            },
            reestablecer: function(){
                $scope.trayecto = [
                    {id: ''},
                    {id: ''}
                ];
            },
            crear: function(){
                console.log('creando trayecto');

                // Creación de Nodo unicamente si no existe
                angular.forEach($scope.trayecto, function(value, key){
                    if (!$scope.nodes.get(value.id)) {
                        node = {
                            id: value.id,
                            label: 'N-'+value.id
                        };
                        $scope.nodes.add(node);
                    }
                });

                // Creación de Arcos
                for (var i = 0 ; i < $scope.trayecto.length - 1; i++) {
                    // Evita crear nodos que van a un mismo nodo
                    if ($scope.trayecto[i].id !== $scope.trayecto[i+1].id ) {
                        // Verificamos si existe un arco entre un nodo y el nodo siguiente
                        if ($.inArray($scope.trayecto[i+1].id, network.getConnectedNodes($scope.trayecto[i].id)) == -1) {
                            edge = {
                                from: $scope.trayecto[i].id,
                                to: $scope.trayecto[i+1].id
                            };
                            $scope.edges.add(edge);
                        }
                    }
                }
            }
        };

        // Funciones para los controles del comportamiento del Grafo.
        $scope.comportamiento = {
            movimiento: false,
            
            toggleMovimiento: function(){
                if ($scope.comportamiento.movimiento) {
                    network.setOptions({nodes: {physics: false }});
                }else{
                    network.setOptions({nodes: {physics: true }});
                }
            },

            removeNode: function(){
                if (window.confirm('¿Esta seguro de que quiere eliminar el nodo '+network.getSelectedNodes()+' ?')) {
                    console.log(network.getSelectedNodes());
                    console.log('Eliminando Nodo');
                    $scope.nodes.remove(network.getSelectedNodes());
                }
            },

            removeEdge: function(){
                if (window.confirm('¿Esta seguro de que quiere elimnar los arcos seleccionados?')) {
                    console.log(network.getSelectedEdges());
                    console.log('Eliminando Arco');
                    $scope.edges.remove(network.getSelectedEdges());
                }
            }

        };
    }
]);