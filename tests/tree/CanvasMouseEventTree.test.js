(new TestSuite(
	TestCase.create({
		name: 'CanvasMouseEventTree',

		test_instantiate: function () {
			this.assert_throws(function(){	new CanvasMouseEventTree(); });
			this.assert_throws(function(){	new CanvasMouseEventTree(''); });
			this.assert_throws(function(){	new CanvasMouseEventTree(5); });
			this.assert_throws(function(){	new CanvasMouseEventTree({}); });
			this.assert_throws(function(){	new CanvasMouseEventTree([]); });
			
			this.assert_nothing_thrown(function(){	new CanvasMouseEventTree(document.createElement('canvas')); });
		}
		
	})
)).run_on_load();