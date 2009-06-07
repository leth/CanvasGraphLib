var SizedCanvasTreeNode = new Class({
	Extends: CanvasTreeNode,
	
	w: 0, h: 0,
	
	initialize: function(id, x, y, w, h) {
		this.parent(id, x, y);
		if (w != null) this.w = w;
		if (h != null) this.h = h;
	},
	
	/**
	 * get the distance of bounds of the node from the center point
	 * @return {x: [center to left edge, center to right edge], y: [center to top edge, center to bottom edge]}
	 */
	get_sizes: function() {
		return {x: [this.w/2, this.w/2],
	 	        y: [this.h/2, this.h/2]};
	}
});

var CanvasBoundsTree = new Class({
	Extends: CanvasTree,
	
	options: {
		treeLevelClass: 'CanvasBoundsTreeLevel'
	},
	
	initialize: function(canvas, options){
		this.setOptions(options);
		this.parent(canvas, this.options);
	}
});

var CanvasBoundsTreeLevel = new Class({
	Extends: CanvasTreeLevel,
	
	_classify_node: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		var child = null;
		var s = node.get_sizes();
		
		// TODO is this right?
		if (node.x < this.x || node.x > this.x + this.w ||
			node.y < this.y || node.y > this.y + this.h)
			return false;
		
		// If the node lies across the horizontal or vertical center lines then add it to the current level
		if (node.x - s.x[0] <= middleTop  && node.x + s.x[1] >= middleTop)
			child = true;
		if (node.y - s.y[0] <= middleSide && node.y + s.y[1] >= middleSide)
			child = true;
		
		if (child == null)
			child = (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
		
		return child;
	}
});