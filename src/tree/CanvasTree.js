var CanvasTreeNode = new Class({
	id: null, x: 0, y: 0,
	
	initialize: function(id, x, y) {
		this.id = id;
		if (x != null) this.x = x;
		if (y != null) this.y = y;
	}
});

var CanvasTree = new Class({
	Implements: Options,
	
	root: null,
	canvas: null,
	node_id_to_level: {},
	
	options: {
		treeLevelClass: 'CanvasTreeLevel'
	},
	/**
	 * Initialize the object
	 * @param canvas Object HTML canvas DOM element.
	 * @param [options] map Options for this object.
	 */
	initialize: function(canvas, options) {
		if ($type(canvas) != 'element' || canvas.get('tag') != 'canvas')
			throw 'The `canvas` argument must be a HTML canvas DOM element.';

		this.canvas = $(canvas);
		this.setOptions(options);
	},
	/**
	 * Add a single node to the tree
	 * @param nodes CanvasTreeNode An object which implements CanvasTreeNode.
	 * @return this
	 */
	add_node: function(node) {
		return this.add_nodes([node]);
	}, 
	/**
	 * Add a collection of nodes to the tree
	 * @param nodes array<? implements CanvasTreeNode> An array of objects which implement CanvasTreeNode.
	 * @return this
	 */
	add_nodes: function(nodes) {
		if (this.root == null){
			this.root = new window[this.options.treeLevelClass](this, null, 0, 0, this.canvas.width, this.canvas.height);
		}
		
		this.root.add_nodes(nodes);
		return this;
	},
	remove_node: function(node){
		this.node_id_to_level[node.id]._unadopt_node(node);
		return this;
	},
	remove_nodes: function(nodes){
		nodes.each(this.remove_node, this);
		return this;
	}
});

var CanvasTreeLevel = new Class({
	x: null,	y: null,
	w: null,	h: null,
	owner: null,
	parent: null,
	nodes: [],
	children: {},

	options: {
		minimum_area: 1
	},
	
	/**
	 * Initialize the object
	 * @param owner CanvasTree The owning CanvasTree for this level.
	 * @param parent CanvasQuadTreeLevel The level above this one in the tree.
	 * @param x int The x co-ordinate of the top left corner of this level of the tree.
	 * @param y int The y co-ordinate of the top left corner of this level of the tree.
	 * @param w int The width of this level of the tree.
	 * @param h int The height of this level of the tree
	 */
	initialize: function(owner, parent, x, y, w, h){
		this.owner = owner;
		this.parent = parent;
		this.x = x; this.w = w;
		this.y = y; this.h = h;
	},
	/**
	 * Add a collection of nodes to the tree
	 * @param nodes array<? implements CanvasTreeNode> A collection of nodes to add.
	 * @return this.
	 */
	add_nodes: function(nodes) {
		// If this level is the minimum size, don't create any more sublevels
		if (this.w * this.h <= this.options.minimum_area) {
			for (var i = 0; i < nodes.length; i++)
				this._adopt_node(nodes[i]);
			return;
		}
		
		// If there are no nodes at this point and only one left to add, do so.
		if (nodes.length == 1 && this.nodes.length == 0) {
			this._adopt_node(nodes[0]);
			return;
		}
		
		// Add adopted node back into classification because we are going to make sublevels
		// If we have not reached minimum size there should only be 1 node in here max.
		// If we are subclassed to support holding nodes at non-leaf levels then this will only reclassify if there is only one node at this level.  
		if (this.nodes.length == 1) {
			nodes.push(this.nodes[0]);
			this.nodes = [];
		}
		
		var childMap = {};
		// Classify the nodes into different child levels
		for (var i = 0; i < nodes.length; i++) {
			var index = this._classify(nodes[i]);
			if (childMap[index] == null)
				childMap[index] = [];
			
			childMap[index].push(nodes[i]);
		}
		
		for (var index in childMap){
			if (index == -1) {
				// -1 indicates that the node should be kept in the current level
				// TODO may want to optimise this so they don't get reclassified each time.
				for (var i = 0; i < childMap[index].length; i++){
					this._adopt_node(childMap[index][i]);
				}
			} else {
				if (childMap[index].length > 0)
					this._add_nodes_to_child(childMap[index], index);
			}
		}
		return this;
	},
	/**
	 * Add nodes to the specified child level
	 * @param nodes array<CanvasTreeNode> Array of nodes to add
	 * @param child int Index of the child level
	 */
	_add_nodes_to_child: function(nodes, child) {
		if (this.children[child] == null){
			var x, y;
			
			if (child == 0 || child == 2)	x = this.x;	else	x = this.x + this.w /2;
			if (child == 0 || child == 1)	y = this.y;	else	y = this.y + this.h /2;
			
			this.children[child] = new this.constructor(this.owner, this, x, y, this.w /2, this.h /2);
		}
		
		this.children[child].add_nodes(nodes);
	},
	/**
	 * Calculate which quadrant of the CanvasQuadTreeLevel the node should fall into
	 * @node CanvasTreeNode Node to classify
	 * @return int 0-3 quadrants 0 to 3, -1 node should stay at this level.
	 */
	_classify: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		
		return (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
	},
	_adopt_node: function(node) {
		this.nodes.push(node);
		this.owner.node_id_to_level[node.id] = this;
	},
	_unadopt_node: function(node) {
		this.nodes = this.nodes.erase(node);
		delete this.owner.node_id_to_level[node.id];
	}
});