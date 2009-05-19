var LayoutEngine = new Class({
	
	/**
	 * Pre-layout event
 	 * @param graphEngine GraphEngine instance to do layout for.
	 */
	preLayoutStep: function(graphEngine) {
		// Do nothing
	},
		
	/**
	 * Perform one step of node layout
	 * @param graphEngine GraphEngine instance to do layout for.
	 * @return The amount of 'energy' in the simulation. When the simulation has subsided the value should approach 0.
	 */
	doLayoutStep: function(graphEngine)	{
		return 0;
	},
	
	/**
	 * Post-layout event
 	 * @param graphEngine GraphEngine instance to do layout for.
	 */
	postLayoutStep: function(graphEngine) {
		// Do nothing
	},
	
	/**
	 * Do some painting if you want
	 */
	paint: function(){
		// Do Nothing
	}
});