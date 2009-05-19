var FrictionForceComponent = new Class({
	Extends: ForceEngineComponent,

	applyForces: function(engine){
		var m = 1;
		var f = 10;
		var energy = 0;
		
		for (var id in engine.nodes) {
			var node = engine.nodes[id];
			
			// Is this sensible?
			var fX = node.dx * m / f;
			var fY = node.dy * m / f;
			
			node.dx -= fX;
			node.dy -= fY;
			energy -= fX + fY;
		}
		
		return energy;
	}
});