var MouseEventTree = new Class({
	Extends: BoundsTree,
	
	currentMouseOver: null,
	
	initialize: function(elem, engine, options){
		this.parent(elem, engine);
		this.setOptions(options);
		
		this.elem.addEvent('mousemove', this.mouseMove.bindWithEvent(this));
		var mousebind = this.mouseButtonAction.bindWithEvent(this);
		this.elem.addEvent('mousedown', mousebind);
		this.elem.addEvent('mouseup', mousebind);
		this.elem.addEvent('click', mousebind);
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
		// TODO bounds checking not radial based
		for (var i = 0; i < level.nodes.length; i++){
			var node = level.nodes[i];
			var d = (node.x - x)*(node.x - x) + (node.y - y)*(node.y - y);

			if (d <= node.r * node.r) {
				out.push({distance: d, node: node});
			}
		}
		
		var child = level.classify({x: x, y: y, getSize: function(){return 0;}});
		if (level.children[child] != null)
			out = out.concat(this.getTargetCandidates(level.children[child], x, y));
		
		return out;
	}
});