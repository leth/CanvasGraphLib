isA = function (obj, klass) {
	if (obj.constructor && klass)
		return obj.constructor == klass;
	return false
}

var GraphEngine = new Class({
	// Variables
	width: 0,
	height: 0,
	period: 500,
	
	running: false,
	timerID: null,
	
	nodes: {},
	edges: {},
	layoutEngine: null,
	
	// Internal Methods
	initialize: function(elemID) {
		elem = $(elemID);
		
		if (! $chk(elem))
			throw('Canvas id or reference is either null or invalid.');
		
		if (elem.get('tag') != 'canvas')
			throw('GraphEngine requires a canvas element. Encountered \'' + this.elem.get('tag') + '\' tag.');
		
		this.elem = elem;
		this.width = elem.width;
		this.height = elem.width;
		
		this.layoutEngine = new ForceLayoutEngine();
		this.mouseTree = new CanvasMouseEventTree(elem);
	},
	step: function() {
		this.layoutEngine.preLayoutStep();
		var energy = this.layoutEngine.doLayoutStep(this);
		this.layoutEngine.postLayoutStep();

		this.layoutEngine.paint(this.elem);
		this.paint();
		
		var e = 1 / energy;
		if (e < 5)
			this.period = 50;
		else if (e < 10)
			this.period = 100;
		else if (e < 20)
			this.period = 300;
		else
			this.period = 500;
		
		// if (window.foo == null)
		// 	window.foo = 1
		// window.foo ++;
		// 
		// if (window.foo < 2)
			this.timerID = this.step.delay(this.period, this);
	},
	nonEdgeForces: function() {
		// TODO move
		if (this.tree == null)
			this.tree = new CanvasTree(this.elem);
		this.tree.add_nodes(this.nodes)
		
		var l = this.tree.root;
		
		var f = function(level) {
			var out = '<h4>L x:' + level.x + ' y:' + level.y + ' w:' + level.w + ' h:' + level.h + '</h4>';
			
			if (level.nodes.length >0){
				out += '<ul>';
				for (var i =0; i < level.nodes.length; i++)
					out += '<li>' + level.nodes[i].id + '(x:' + level.nodes[i].x + ' y:' + level.nodes[i].y + ')</li>';
				out += '</ul>';
			}
			out += '<ul>';
			for (var i in level.children)
				out += '<li>' + f(level.children[i]) + '</li>';
			out += '</ul>';
			
			return out;
		};
		$('text').set('html',f(l));
	},
	paint: function() {
		var ctx = this.elem.getContext("2d");
		ctx.clearRect(0,0,this.elem.width,this.elem.height);
		ctx.fillStyle = "rgb(240,240,240)";
		ctx.fillRect(0,0,this.elem.width,this.elem.height);
		this.paintEdges(ctx);
		this.paintNodes(ctx);
	},
	paintEdges: function(ctx) {
		for (id in this.edges)
			this.edges[id].paint(ctx);
			
		// TODO move this to it's own method
		// ctx.strokeStyle = "rgb(0,0,0)";
		// var l = this.tree.root;
		// var f = function(level, ctx){
		// 	ctx.strokeRect(level.x, level.y, level.w, level.h);
		// 	
		// 	for (var i in level.children){
		// 		if (level.children[i] != null)
		// 			f(level.children[i], ctx);
		// 	}
		// };
		// f(l, ctx);
	},
	paintNodes: function(ctx) {
		for (id in this.nodes)
			this.nodes[id].paint(ctx);
	},
	
	// Public methods
	start: function() {
		if(this.running)
			return;
		
		this.timerID = this.step.delay(this.period, this);
		this.running = true;
	},
	stop: function() {
		if(! this.running)
			return;
		
		$clear(this.timerID);
		this.timerID = null;
		this.running = false;
	},
	addNode: function(node) {
		if (! $chk(node))
			throw('GraphEngine.addNode called with incorrect args.');
		
		if ($defined(this.nodes[node.id]))
			throw('Node with same ID already added.');
		
		if(!$chk(node.x) || !$chk(node.y)){
			node.x = 0;
			node.y = 0;
		}
		this.nodes[node.id] = node;
		var self = this;
		
		var mouseInOut = function() {
			self.paint();
		}
		var mousemove = function(event){
			var pos = event.page;
			var diff = [];
			diff.x = self.dragPos.x - pos.x;
			diff.y = self.dragPos.y - pos.y;
			
			node.x -= diff.x;
			node.y -= diff.y;
			
			self.dragPos = pos;
			self.paint();
		};
		var mouseup = function(event){
			window.removeEvent('mousemove', mousemove);
			window.removeEvent('mouseup', arguments.callee);
			self.dragPos = null;
		};
		node.addEvent('mousedown',function(event){
			self.dragPos = event.page;
			
			window.addEvent('mouseup', mouseup);
			window.addEvent('mousemove', mousemove);
		});
		node.addEvent('mouseover', mouseInOut);
		node.addEvent('mouseout', mouseInOut);
		this.mouseTree.add_node(node);
	},
	getNodes: function() {
		return this.nodes;
	},
	addEdge: function(edge) {
		if (! $chk(edge))
			throw('GraphEngine.addEdge called with incorrect args.');
		
		if ($defined(this.edges[edge.id]))
			throw('Edge with same ID already added.');
		
		this.edges[edge.id] = edge;
	}
});