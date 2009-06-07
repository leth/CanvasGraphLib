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
	// add_nodes: function(nodes) {
	// 	
	// 	this.root.add_nodes(nodes);
	// 	return this;
	// },
	add_nodes: function(nodes) {
		if (this.root == null)
			this.root = new window[this.options.treeLevelClass](this, null, 0, 0, this.canvas.width, this.canvas.height);
		
		var queue = [];
		// Add all nodes to the root.
		// This allows for more efficient stuff in the queue processing later
		for (var i = 0; i < nodes.length; i++)
			queue.push({'n': nodes[i], 'l': this.root});
		
		// process the queue
		this._add_nodes_with_hints(queue);
		
		return this;
	},
	/**
	 * PRIVATE: Add nodes into the tree non-recursively.
	 * @param queue array<Map<string,CanvasTreeNode|CanvasTreeLevel>> queue of nodes to be added. 
	 *        Each item in the list is a map of the form {n: node, l: level} where level is a hint at the level this node should be inserted at.
	 * @return void
	 */
	_add_nodes_with_hints: function(queue) {
		// Which nodes have been classified to a certain level
		var classified = {};
		
		for (var i = 0; i < queue.length; i++){
			var node = queue[i].n;
			var level = queue[i].l;
			
			while (level != null)
			{
				// If this level is the minimum size, don't create any more sublevels
				if (level.w * level.h <= level.options.minimum_area) {
					level._adopt_node(node);
					break;
				}

				// If there are no nodes at this level (and we haven't already subdivided) don't subdivide.
				if (level.nodes.length == 0 && ! level._has_children()) {
					level._adopt_node(node);
					break;
				}

				// If there is a node at this level add it back into classification because we are going to make sublevels
				if (level.nodes.length > 0) {
					var newNodes = [];
					
					for (var j=0; j < level.nodes.length; j++) {
						// If nodes have already been classified this time round and been told to stay here, don't disturb them
						if (classified[level.nodes[j].id] != null)
							newNodes.push(level.nodes[j]);
						else {
							// hint at the level classification should start at
							queue.push({'n': level.nodes[j], 'l': level});
						}
					}
					
					level.nodes = newNodes;
				}
				
				var index = level._classify_node(node);
				
				// true indicates that the node should be kept in the current level
				if (index === true) {
					level._adopt_node(node);
					classified[node.id] = true;
					break;
				} else if (index === false) {
					throw "Assertion 'index != false' failed";
				} else {
					level = level._create_child_level(index);
				}
			}
		}
	},
	remove_node: function(node){
		this.node_id_to_level[node.id]._unadopt_node(node);
		return this;
	},
	remove_nodes: function(nodes){
		nodes.each(this.remove_node, this);
		return this;
	},
	reclassify_node: function(node){
		var level = this.node_id_to_level[node.id];
		
		while (true)
		{
			var index = level._classify_node(node);
			
			if (index === true)
			{	// It's ok at this level
				
				// Don't move it unless it didn't come from here.
				if (this.node_id_to_level[node.id] !== level)
					level._adopt_node(node);
					
				break;
			}
			else if (index === false)
			{	// Send it up to a parent
				
				// If it came from this node first remove it from here
				if (this.node_id_to_level[node.id] === level) {
					var newNodes = [];
					for (var j=0; j < level.nodes.length; j++) {
						if (level.nodes[j] !== node)
							newNodes.push(level.nodes[j]);
					}
					level.nodes = newNodes;
				}
				
				// If this level is now empty, remove the level.
				if (! level._has_children() && level.nodes.length == 0)
					level.parent._remove_child_level(level);
				
				level = level.parent;
			}
			else
			{	// A quad was specified
				
				// Don't bother making needsless sublevels
				if (level.nodes.length == 1 && level.nodes[0] === node && !level._has_children())
					break;
				
				// Add it to a sublevel
				this._add_nodes_with_hints([{'n': node, 'l': level._create_child_level(index)}]);
				break;
			}
		}
		
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
	 * Calculate which quadrant of the CanvasQuadTreeLevel the node should fall into
	 * @node CanvasTreeNode Node to classify
	 * @return int 0-3 quadrants 0 to 3, true node should stay at this level, false does not belong in this level or its children.
	 */
	_classify_node: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		
		if (node.x < this.x || node.x > this.x + this.w ||
			node.y < this.y || node.y > this.y + this.h)
			return false;
		
		return (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
	},
	_adopt_node: function(node) {
		this.nodes.push(node);
		this.owner.node_id_to_level[node.id] = this;
	},
	_unadopt_node: function(node) {
		this.nodes = this.nodes.erase(node);
		delete this.owner.node_id_to_level[node.id];
	},
	/**
	 * Create the specified child level (if needed)
	 * @param child int Index of the child level
	 * @return CanvasTreeLevel the child level
	 */
	_create_child_level: function(quad) {
		if (this.children[quad] == null) {
			var x, y;
			if (quad == 0 || quad == 2)
				x = this.x;
			else
				x = this.x + this.w /2;

			if (quad == 0 || quad == 1)
				y = this.y;
			else
				y = this.y + this.h /2;
				
			this.children[quad] = new this.constructor(this.owner, this, x, y, this.w /2, this.h /2);
		}
		return this.children[quad];
	},
	_remove_child_level: function(level) {
		if ($type(level) == 'number') {
			delete this.children[level];
		} else {
			for (var i=0; i < 4; i++) {
				if (this.children[i] === level){
					delete this.children[i];
					break;
				}
			}
		}
	},
	_has_children: function() {
		var c = this.children;
		return c[0] || c[1] || c[2] || c[3];
	}
});