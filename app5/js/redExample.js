$('document').ready(function(){
    deb.nodes.add({id: 1, label: '1'});
    deb.nodes.add({id: 2, label: '2'});
    deb.nodes.add({id: 3, label: '3'});
    deb.nodes.add({id: 4, label: '4'});
    deb.nodes.add({id: 5, label: '5'});
    deb.nodes.add({id: 6, label: '6'});
    deb.nodes.add({id: 7, label: '7'});
    deb.edges.add({from: 1, to: 2, label: '2'});
    deb.edges.add({from: 1, to: 3, label: '3'});
    deb.edges.add({from: 2, to: 4, label: '5'});
    deb.edges.add({from: 3, to: 4, label: '6'});
    deb.edges.add({from: 3, to: 5, label: '3'});
    deb.edges.add({from: 4, to: 6, label: '1'});
    deb.edges.add({from: 4, to: 5, label: '2'});
    deb.edges.add({from: 5, to: 7, label: '2'});
    deb.edges.add({from: 6, to: 7, label: '4'});
});