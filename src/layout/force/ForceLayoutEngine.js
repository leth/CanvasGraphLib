var ForceLayoutEngine = new Class({
	Extends: LayoutEngine,
	
	initialize: function(){
		this.edge = new ForceEngineComponent(); // TODO restore SpringForceComponent();
		this.nonEdge = new FADEForceComponent();
		this.friction = new FrictionForceComponent();
	},
	preLayoutStep: function(engine) {
		this.edge.preForces();
		this.nonEdge.preForces();
		this.friction.preForces();
	},
	doLayoutStep: function(engine) {
		this.clearSpeed(engine);
		var energy = this.forces(engine);
		this.applyMovement(engine);
		
		return energy;
	},
	postLayoutStep: function(engine) {
		this.edge.postForces();
		this.nonEdge.postForces();
		this.friction.postForces();
	},
	forces: function(engine) {
		var energy = 0;
		energy += this.edge.applyForces(engine);
		energy += this.nonEdge.applyForces(engine);
		energy += this.friction.applyForces(engine);
		
		return energy;
	},
	clearSpeed: function(engine) {
		for (id in engine.nodes) {
			engine.nodes[id].dx = 0;
			engine.nodes[id].dy = 0;
		}
	},
	applyMovement: function(engine) {
		for (id in engine.nodes) {
			engine.nodes[id].x += engine.nodes[id].dx;
			engine.nodes[id].y += engine.nodes[id].dy;
		}
	}
});

var ForceEngineComponent = new Class({
	/**
	 * TODO
	 */
	preForces: function(engine) {
		
	},
	/**
	 * Apply the forces computed by this component to the nodes
	 * @param the engine with which to work with
	 * @return Returns the total engergy left in the system, as considered by this component.
	 *         Systems with lots of movement should have a high energy value.
	 */
	applyForces: function(engine) {
		return 0;
	},
	
	/**
	 * TODO
	 */
	postForces: function(engine) {
		
	}
});