var app = angular.module('app', []);

app.controller('AppCtrl',[
    '$scope', '$timeout', '$filter',
    function($scope, $timeout, $filter){

        // =============================
        // Definición de Grafo con VisJs
        // =============================
        $scope.nodes = new vis.DataSet([]);
        $scope.edges = new vis.DataSet([]);
        $scope.options = {};
        $scope.container = document.getElementById('network');
        $scope.data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };
        network = new vis.Network($scope.container, $scope.data, $scope.options);

        // =======================
        // Definición de Variables
        // =======================
        dbg = {
            nodes: $scope.nodes,
            edges: $scope.edges,
            data: $scope.data,
            options: $scope.options,
            container: $scope.container
        };

        $scope.nodoEdit = null;
        $scope.arcoEdit = null;
        $scope.cantidadNodos = 0;
        $scope.cantidadArcos = 0;

        // ==============================
        // Detección de Eventos en la red
        // ==============================
        network.on('selectEdge', function(){
            $scope.arco.getSelected();
        });

        network.on('selectNode', function(){
            $scope.nodo.getSelected();
        });

        network.on('click', function(){
            if (network.getSelectedEdges().length === 0) {
                $timeout(function(){
                    $scope.arcoEdit = null;
                },0);
            }
            if (network.getSelectedNodes().length === 0) {
                $timeout(function(){
                    $scope.nodoEdit = null;
                },0);
            }
        });

        // ===========
        // Trayectoria
        // ===========
        $scope.trayecto = [
            {id: ''},
            {id: ''}
        ];

        $scope.trayectoria = {
            addField: function(){
                $scope.trayecto.push({id: ''});
            },
            removeField: function(){
                if ($scope.trayecto.length > 2) {
                    $scope.trayecto.pop();
                }
            },
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

        // ========================
        // Comportamiento del Grafo
        // ========================
        $scope.comportamiento = {
            movimiento: false,
            
            toggleMovimiento: function(){
                if ($scope.comportamiento.movimiento) {
                    network.setOptions({nodes: {physics: false }});
                }else{
                    network.setOptions({nodes: {physics: true }});
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

        // =================
        // Edición de la Red
        // =================
        $scope.nodo = {
            getSelected: function(){
                $timeout(function(){
                    $scope.nodoEdit = $scope.nodes.get(network.getSelectedNodes()[0]);
                    if ($scope.nodoEdit.tipo === undefined) {
                        $scope.nodoEdit.tipo = 1;
                    }
                    $scope.nodo.conexiones = network.getConnectedNodes($scope.nodoEdit.id);
                },0);
            },

            remove: function(){
                if (window.confirm('¿Esta seguro de que quiere eliminar el nodo '+network.getSelectedNodes()+' ?')) {
                    console.log(network.getSelectedNodes());
                    console.log('Eliminando Nodo');
                    $scope.nodes.remove(network.getSelectedNodes());
                }
            },

            update: function(){
                $scope.nodes.update($scope.nodoEdit);
            }
        };

        $scope.arco = {
            getSelected: function(){
                if (network.getSelectedEdges().length == 1) {
                    $timeout(function(){
                        $scope.arcoEdit = $scope.edges.get(network.getSelectedEdges()[0]);
                    },0);
                }else{
                    $timeout(function(){
                        $scope.arcoEdit = null;
                    },0);
                    console.log('se selecciono varios');
                }
            },

            remove: function(){
                if (window.confirm('¿Esta seguro de que quiere elimnar los arcos seleccionados?')) {
                    console.log(network.getSelectedEdges());
                    console.log('Eliminando Arco');
                    $scope.edges.remove(network.getSelectedEdges());
                }
            },


            setDistancia: function(){
                $scope.arcoEdit.label = $scope.arcoEdit.distancia;
                $scope.edges.update($scope.arcoEdit);
            }
        };

        // ============================
        // Calculo del Camino mas Corto
        // ============================
        addConexion = function(nodoInicial, nodoFinal, valorDistancia){
            valorDistancia = parseInt(valorDistancia,10);
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

        $scope.camino = [];

        $scope.shortestPath = function(){
            grafoDijkstra = [];
            angular.forEach($scope.edges._data, function(value, key){
                addConexion(value.from, value.to, value.label);
                addConexion(value.to, value.from, value.label);
            });

            g = new Graph();
            angular.forEach(grafoDijkstra, function(value, key){
                enlaces = {};
                angular.forEach(value.conexiones, function(conexion, i){
                    enlaces[conexion.destino] = conexion.distancia;
                });
                g.addVertex(value.origen, enlaces);
            });
            var i = $scope.nodoInicial.id.toString();
            var f = $scope.nodoFinal.id.toString();
            console.log(g.shortestPath(i, f).concat(i).reverse());
            $scope.camino = g.shortestPath(i, f).concat(i).reverse();
        };

        // ===========
        // Orientación
        // ===========
        $scope.orientacion = {
            updateVecinos: function(){
                angular.forEach($scope.nodoEdit.conexiones, function(value, key){
                    console.log(value + '<=' + key);
                    $filter('filter')($scope.nodoEdit.conexiones, {$: value});
                });
            }
        };



    }
]);

