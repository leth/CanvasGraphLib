var BoundsTree = new Class({
	Extends: Tree,
	
	initialize: function(elem, engine, options){
		this.parent(elem, engine, {treeLevelClass: 'BoundsTreeLevel'});
		this.setOptions(options);
	}
});

var BoundsTreeLevel = new Class({
	Extends: TreeLevel,
	
	classify: function(node) {
		var middleTop = this.x + this.w /2;
		var middleSide = this.y + this.h /2;
		var child = null;
		var s = node.getSize();
		
		// If the node lies across the horizontal or vertical center lines then add it to the current level
		if (node.x - s[0] <= middleTop && node.x + s[0] >= middleTop)
			child = -1;	
		if (node.y - s[1] <= middleSide && node.y + s[1] >= middleSide)
			child = -1;
		
		if (child == null)
			child = (node.x < middleTop ? 0 : 1) + (node.y < middleSide ? 0 : 2);
		
		return child;
	}
});