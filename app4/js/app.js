var app = angular.module('app', []);

app.controller('AppCtrl',[
    '$scope', '$timeout', '$filter',
    function($scope, $timeout, $filter){
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
        $scope.edicionNodo = null;
        $scope.nodo = {
            add: function(){
                $scope.trayecto.push({id: ''});
            },
            remove: function(){
                if ($scope.trayecto.length > 2) {
                    $scope.trayecto.pop();
                }
            },
            getSeleccionado: function(){
                $timeout(function(){
                    $scope.edicionNodo = $scope.nodes.get(network.getSelectedNodes()[0]);
                    if ($scope.edicionNodo.tipo === undefined) {
                        $scope.edicionNodo.tipo = 1;
                    }
                },0);
            },
            setCambios: function(){
                $scope.nodes.update($scope.edicionNodo);
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
            },

            savePositions: function(){
                network.storePositions();
                window.alert('Se guardaron las posiciones de los nodos');
            },

            restorePositions: function(){
                angular.forEach($scope.nodes.getIds(), function(value, key){
                    if ($scope.nodes.get(value).x) {
                        network.moveNode($scope.nodes.get(value).id, $scope.nodes.get(value).x, $scope.nodes.get(value).y);
                    }
                });
            }
        };

        // Detección de Eventos en la red
        network.on('selectEdge', function(){
            $scope.arco.getSeleccionado();
        });

        network.on('selectNode', function(){
            $scope.nodo.getSeleccionado();
        });

        network.on('click', function(){
            if (network.getSelectedEdges().length === 0) {
                $timeout(function(){
                    $scope.edicionArco = null;
                },0);
            }
            if (network.getSelectedNodes().length === 0) {
                $timeout(function(){
                    $scope.edicionNodo = null;
                },0);
            }
        });

        // Funcion de Manipulación de Arcos
        $scope.edicionArco = null;
        $scope.arco = {
            getSeleccionado: function(){
                if (network.getSelectedEdges().length == 1) {
                    $timeout(function(){
                        $scope.edicionArco = $scope.edges.get(network.getSelectedEdges()[0]);
                    },0);
                }else{
                    $timeout(function(){
                        $scope.edicionArco = null;
                    },0);
                    console.log('se selecciono varios');
                }
            },

            setDistancia: function(){
                $scope.edicionArco.label = $scope.edicionArco.distancia;
                $scope.edges.update($scope.edicionArco);
            }
        };

        // Calculo del Camino mas Corto con Libreria de Dijkstra
        addConexion = function(nodoInicial, nodoFinal, valorDistancia){
            buscarNodo = $filter('filter')(grafoDijkstra, {origen: nodoInicial });
            if (buscarNodo.length === 0) {
                conexion = [];
                conexion.push({
                    destino: nodoFinal,
                    distancia: valorDistancia
                });
                grafoDijkstra.push({origen: nodoInicial, conexiones: conexion });
            }else{
                buscarNodo[0].conexiones.push({destino: nodoFinal, distancia: valorDistancia});
            }
            
        };
        
        $scope.shortestPath = function(){
            grafoDijkstra = [];
            angular.forEach($scope.edges._data, function(value, key){
                addConexion(value.from, value.to, value.label);
                addConexion(value.to, value.from, value.label);
            });
        };
    }
]);

