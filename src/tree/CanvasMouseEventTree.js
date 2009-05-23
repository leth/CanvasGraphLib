var CanvasMouseEventTree = new Class({
	Extends: CanvasBoundsTree,
	
	currentMouseOver: null,
	
	initialize: function(canvas, options){
		this.setOptions(options);
		this.parent(canvas, this.options);
		
		this.canvas.addEvent('mousemove', this.mouseMove.bindWithEvent(this));
		var mousebind = this.mouseButtonAction.bindWithEvent(this);
		this.canvas.addEvent('mousedown', mousebind);
		this.canvas.addEvent('mouseup', mousebind);
		this.canvas.addEvent('click', mousebind);
	},
	mouseButtonAction: function(event){
		var pos = event.target.getPosition();
		var x = event.page.x - pos.x;
		var y = event.page.y - pos.y -1;
		var type = event.type;
		
		var targets = this.getTargetCandidates(this.root, x, y);
		if (targets.length == 0)
			return;
		
		targets.sort(function(a,b){
			var d = a.distance - b.distance;
		
			if (d == 0)
				d = a.node.id - b.node.id;
		
			return d;
		});
		
		targets[0].node.fireEvent(type, event);
	},
	mouseMove: function(event){
		var pos = event.target.getPosition();
		var x = event.page.x - pos.x;
		var y = event.page.y - pos.y -1;
		
		var targets = this.getTargetCandidates(this.root, x, y);
		var repaint = false;
		
		if (targets.length != 0) {

			targets.sort(function(a,b){
				var d = a.distance - b.distance;
			
				if (d == 0)
					d = a.node.id - b.node.id;
			
				return d;
			});
			
			if (this.currentMouseOver != targets[0].node) {
				if (this.currentMouseOver != null) {
					this.currentMouseOver.fireEvent('mouseOut', event);
				}
				
				this.currentMouseOver = targets[0].node;
				this.currentMouseOver.fireEvent('mouseIn', event);
				repaint = true;
			} else {
				this.currentMouseOver.fireEvent('mouseMove', event);
			}
		} else {
			if (this.currentMouseOver != null) {
				this.currentMouseOver.fireEvent('mouseOut', event);
				this.currentMouseOver = null;
				
				repaint = true;
			}
		}
		
		if (repaint)
			this.engine.paint();
	},
	getTargetCandidates: function(level, x, y){
		var out = [];
		for (var i = 0; i < level.nodes.length; i++) {
			var node = level.nodes[i];
			
			var d = node.contains_point(x,y);
			if (d !== false)
				out.push({distance: d, node: node});
		}
		
		var dummy_node = {x: x, y: y, get_sizes: function(){return 0;}};
		var child = level.classify(dummy_node);
		
		if (level.children[child] != null)
			out = out.concat(this.getTargetCandidates(level.children[child], x, y));
		
		return out;
	}
});