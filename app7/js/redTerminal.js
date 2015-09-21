$('document').ready(function(){
    angular.forEach(nodesTerminal, function(value, key){
        deb.nodes.add(value);
    });
    angular.forEach(edgesTerminal, function(value, key){
        deb.edges.add(value);
    });
});