var Tree = new Class({
	Implements: Options,
	
	root: null,
	nodeMap: {},
	
	options: {
		treeLevelClass: TreeLevel
	},
	initialize: function(engine, options) {
		this.setOptions(options);
		this.engine = engine;
		
		this.root = new this.options.treeLevelClass(null, 0, 0, engine.elem.width, engine.elem.height);
	},
	addNodes: function(nodes) {
		var queue = [];
		// Add all nodes to the root.
		// This allows for more efficient stuff in the queue processing
		for (var i = 0; i < nodes.length; i++)
			queue.push({'n': nodes[i], 'l': this.root});
			
		this._addNodesWithHints(queue);
	},
	/**
	 * Add nodes into the tree non-recursively.
	 *
	 */
	_addNodesWithHints: function(queue) {
		for (var i = 0; i < queue.length; i++){
			var node = queue[i].n;
			var level = queue[i].l;
			
			while (level != null) {
				if (level.w * level.h <= 1 || (level.nodes.length == 0 && ! level.hasChildren())) {
					// Add the node to the current level if it's too small already, or if it's empty
					level.nodes.push(node);
					// Keep track of where particular nodes are
					this.nodeMap[node.id] = level;
					break;
				} else {
					// Here we are going to add the node to a new child leaf of the current level.
					if (level.nodes.length != 0) {
						// Add these on to the queue as they now need to be redistributed.
						// Note the level hint so we don't waste time
						while(level.nodes.length > 0)
							queue.push({'n': level.nodes.pop(), 'l': level});
					}
					// classify which quad of the tree the node is in.
					var quad = level.classify(node);
					var x, y;
					if (quad == 0 || quad == 2)
						x = level.x;
					else
						x = level.x + level.w /2;

					if (quad == 0 || quad == 1)
						y = level.y;
					else
						y = level.y + level.h /2;

					if (level.children[quad] == undefined)
						level.children[quad] = new this.options.treeLevelClass(level, x, y, level.w /2, level.h /2);
					
					level = level.children[quad];
				}
			}
		}
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
	hasChildren: function() {
		var c = this.children;
		return c[0] || c[1] || c[2] || c[3];
	},
	classify: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		
		return (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
	}
});