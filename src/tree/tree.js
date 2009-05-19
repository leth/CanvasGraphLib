var CanvasTreeNode = new Class({
	id: null, x: null, y: null,
	
	initialize: function(id, x, y) {
		this.id = id; this.x = x; this.y = y;
	}
});

var CanvasTree = new Class({
	Implements: Options,
	
	root: null,
	canvas: null,
	node_id_to_level: {},
	
	options: {
		treeLevelClass: 'CanvasQuadTreeLevel'
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

var CanvasQuadTreeLevel = new Class({
	x: null,	y: null,
	w: null,	h: null,
	
	owner: null,
	parent: null,
	nodes: [],
	children: {},
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
	 */
	add_nodes: function(nodes) {
		if (this.w * this.h <= 1 || nodes.length == 1) {
			for (var i = 0; i < nodes.length; i++){
				this._adopt_node(nodes[i]);
			}
		} else {
			var childMap = {};
			for (var i = 0; i < nodes.length; i++) {
				var child = this._classify(nodes[i]);
				if (childMap[child] == null)
					childMap[child] = [];
				
				childMap[child].push(nodes[i]);
			}
			
			for (var child in childMap){
				if (child == -1) {
					for (var i = 0; i < childMap[child].length; i++){
						this._adopt_node(childMap[child][i]);
					}
				} else {
					if (childMap[child].length != 0)
						this.addNodesToChildren(childMap[child], child);
				}
			}
		}
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
		
		this.children[child].add_nodes(nodes);
	},
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
		this.nodes.erase(node);
		delete this.owner.node_id_to_level[node.id];
	}
});