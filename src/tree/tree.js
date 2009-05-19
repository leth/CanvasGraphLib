var Tree = new Class({
	Implements: Options,
	
	root: null,
	
	options: {
		treeLevelClass: TreeLevel
	},
	initialize: function(elem, engine, options) {
		this.setOptions(options);
		this.elem = $(elem);
		this.engine = engine;
	},
	partition: function(){
		this.root = new (this.options.treeLevelClass)(null, 0, 0, this.elem.width, this.elem.height);
		
		var tmp = this.engine.getNodes();
		var nodes = [];
		for (var i in tmp)
			nodes[i] = tmp[i];
			
		this.root.addNodes(nodes);
	}
});

var TreeLevel = new Class({
	nodes: [],
	children: {},
	
	initialize: function(parent, x, y, w, h){
		this.parent = parent;
		this.x = x; this.w = w;
		this.y = y; this.h = h;
	},
	addNodes: function(nodes){
		if (this.w * this.h <= 1 || nodes.length == 1) {
			for (var i = 0; i < nodes.length; i++){
				this.nodes.push(nodes[i]);
			}
		} else {
			var childMap = {};
			for (var i = 0; i < nodes.length; i++) {
				var child = this.classify(nodes[i]);
				if (childMap[child] == null)
					childMap[child] = [];
				
				childMap[child].push(nodes[i]);
			}
			
			for (var child in childMap){
				if (child == -1) {
					for (var i = 0; i < childMap[child].length; i++){
						this.nodes.push(childMap[child][i]);
					}
				} else {
					if (childMap[child].length != 0)
						this.addNodesToChildren(childMap[child], child);
				}
			}
		}
	},
	classify: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		
		return (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
	},
	addNodesToChildren: function(nodes, child) {
		if (this.children[child] == null){
			var x, y;
			if (child == 0 || child == 2)
				x = this.x;
			else
				x = this.x + this.w /2;
			
			if (child == 0 || child == 1)
				y = this.y;
			else
				y = this.y + this.h /2;
			
			this.children[child] = new this.constructor(this, x, y, this.w /2, this.h /2);
		}
		
		this.children[child].addNodes(nodes);
	}
});