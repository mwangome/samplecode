/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var json = [
{"text" : "Operations", "id" : 100, "leaf" : false, "cls" : "folder", "children" : [
{"text" : "Sport Betting::", "id" : 1000, "leaf" : false, "cls" : "folder", "children" :
[ {"text" : "Markets", "id" : "100000", "leaf" : true, "cls" : "file"},
{"text" : "Participants", "id" : "100001", "leaf" : true, "cls" : "file"},
{"text" : "Reports", "id" : "100002", "leaf" : true, "cls" : "file"},
{"text" : "Options", "id" : "100003", "leaf" : true, "cls" : "file"}
]
},
{"text" : "Home", "id" : 2000, "leaf" : false, "cls" : "folder", "children" :
	[ {"text" : "Dashboard", "id" : "200000", "leaf" : true, "cls" : "file"}
	]
	},
]}
]; 



var tree = new Ext.tree.TreePanel( {
animate:true,
enableDD:false,
loader: new Ext.tree.TreeLoader(), // Note: no dataurl, register a TreeLoader to make use of createNode()
lines: true,
renderTo: Ext.getBody(),
root: new Ext.tree.AsyncTreeNode({
	text: 'Applications',
	draggable:false,
	id:'source',
	children: json
}),
listeners: {
    'render': function(tp) {
        tp.getSelectionModel().on('selectionchange', function(tree, node) {
            console.log(node.text);
            if(node.text === 'Markets'){
            	window.location.href = contextpath + '/members'; //
            } if(node.text === 'Dashboard'){
            	window.location.href = contextpath + '/home'; //
            }
        })
    }
},
rootVisible:true,
});

tree.getRootNode().expand(true);
var treeNode = tree.getRootNode();

treeNode.expandChildNodes(true);

var settingsJson = [
{"text" : "Settings", "id" : 101, "leaf" : false, "cls" : "folder", "children" : [
{"text" : "Student Section::", "id" : 1001, "leaf" : false, "cls" : "folder", "children" :
[ {"text" : "Classes", "id" : "100001", "leaf" : true, "cls" : "file"},
{"text" : "Participants", "id" : "100002", "leaf" : true, "cls" : "file"},
{"text" : "Reports", "id" : "100003", "leaf" : true, "cls" : "file"},
{"text" : "Options", "id" : "100004", "leaf" : true, "cls" : "file"}
]
},
{"text" : "Finance Section", "id" : 2001, "leaf" : false, "cls" : "folder", "children" :
	[ {"text" : "Dashboard", "id" : "200001", "leaf" : true, "cls" : "file"}
	]
	},
]}
];

var settingsTree = new Ext.tree.TreePanel( {
animate:true,
enableDD:false,
loader: new Ext.tree.TreeLoader(), // Note: no dataurl, register a TreeLoader to make use of createNode()
lines: true,
renderTo: Ext.getBody(),
root: new Ext.tree.AsyncTreeNode({
	text: 'Applications',
	draggable:false,
	id:'source2',
	children: settingsJson
}),
listeners: {
    'render': function(tp) {
        tp.getSelectionModel().on('selectionchange', function(tree, node) {
            console.log(node.text);
            if(node.text === 'Markets'){
            	window.location.href = contextpath + '/members'; //
            } if(node.text === 'Dashboard'){
            	window.location.href = contextpath + '/home'; //
            }if(node.text === 'Classes'){
            	window.location.href = contextpath + '/settings'; //
            }
        })
    }
},
rootVisible:true,
});

settingsTree.getRootNode().expand(true);
var settingsTreeNode = settingsTree.getRootNode();

settingsTreeNode.expandChildNodes(true);

