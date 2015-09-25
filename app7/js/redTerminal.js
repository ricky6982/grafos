$('document').ready(function(){
    angular.forEach(nodesTerminal, function(value, key){
        dbg.nodes.add(value);
    });
    angular.forEach(edgesTerminal, function(value, key){
        dbg.edges.add(value);
    });

    network.setOptions({nodes: {physics: false }});

});