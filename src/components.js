var GraphNode = new Class({
	Extends: InteractiveCanvasNode,
	Implements: Events,
	
	r: 10,
	mouseOver: false,
	
	// Methods
	initialize: function(id, x, y){
		this.parent(id, x, y, this.r *2, this.r *2);
		
		this.addEvent('mouseover', function(){
			this.mouseOver = true;
		});
		this.addEvent('mouseout', function(){
			this.mouseOver = false;
		});
	},
	
	paint: function(ctx){
		if (this.mouseOver)
			ctx.fillStyle = "rgb(255,0,0)";
		else
			ctx.fillStyle = "rgb(200,0,0)";
			
		ctx.beginPath();
		// ctx.arc(x,y,radius,startAngle,endAngle, clockwise);
		ctx.arc(this.x, this.y, this.r, 0, 2* Math.PI, true);
		ctx.fill();
		
		if (ctx.strokeText) {
			ctx.strokeText(this.id,this.x, this.y);
		} else if (ctx.mozDrawText) {
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.font = '10px';
			ctx.save();
			var w = ctx.mozMeasureText(this.id);
			
			ctx.translate(this.x - (w/2), this.y +5);
			ctx.mozDrawText(this.id);
			ctx.restore();
		}
	},
	
	contains_point: function(x, y) {
		var s = this.get_sizes();
		
		if (x >= this.x - s.x[0] && 
		    x <= this.x + s.x[1] &&
		    y >= this.y - s.y[0] &&
		    y <= this.y + s.y[1]) {
			
			var xd = this.x - x;
			var yd = this.y - y;
			
			var sq = Math.sqrt(xd*xd + yd*yd);
			if (sq > this.r)
				return false;
				
			return sq;
		} else {
			return false;
		}
	}
});

var GraphEdge = new Class({
	
	// Variables
	start: null,
	end: null,
	
	// Functions
	initialize: function(id, start, end){
		this.id = id;
		
		this.start = start;
		this.end = end;
	},
	paint: function(ctx){
		ctx.strokeStyle = "rgb(200,200,200)";
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
	}
});