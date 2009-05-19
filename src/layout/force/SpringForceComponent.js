SpringForceComponent = new Class({
	Extends: ForceEngineComponent,
	
	applyForces: function(engine){
		// Hooke's law constants
		var l = 30; // Natural length
		var k = .1; // Scale?
		var forceTotal = 0;
		
		for (var id in engine.edges) {
			var start = engine.edges[id].start;
			var end = engine.edges[id].end;
			
			var Ax = end.x - start.x;
			var Ay = end.y - start.y;
			
			var d = Math.sqrt((Ax * Ax) + (Ay * Ay));
			
			var angle;
			if (d != 0) {
				angle = Math.atan2(Ay, Ax);
			} else {
				// For safety, assume they can't really be on exactly the same point
				d = 0.0001;
				angle = Math.random() * 2 * Math.PI; // TODO mootools
			}
			
			var force = k * (d - l);
			var Dx = Math.cos(angle) * force;
			var Dy = Math.sin(angle) * force;
			
			start.dx += Dx;
			start.dy += Dy;
			end.dx -= Dx;
			end.dy -= Dy;
			
			forceTotal += Math.abs(force);
		}
		
		return forceTotal;
	}
});