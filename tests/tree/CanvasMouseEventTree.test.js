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
		},
		
		test_mouse_event_position: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 4; canvas.height = 4;
			
			var tree = new CanvasMouseEventTree(canvas);
			var node = new InteractiveCanvasNode(0, 2, 2, 2, 2);
			tree.add_node(node);
			
			// This is really odd because the test case code doesn't cope with mootools' event stuff
			var dummy = {test:function(){}};
			var clicked = function(){dummy.test();};
			
			node.addEvent('click', clicked);

			this.assert_not_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 0, pointerY: 0 }); }, this);
			this.assert_not_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 4, pointerY: 0 }); }, this);
			this.assert_not_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 0, pointerY: 4 }); }, this);
			this.assert_not_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 4, pointerY: 4 }); }, this);
			
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 1, pointerY: 1}); }, this);
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 2, pointerY: 2}); }, this);
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 1, pointerY: 2}); }, this);
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 3, pointerY: 2}); }, this);
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 2, pointerY: 3}); }, this);
			this.assert_called(dummy, 'test', function(){ this.fire_click(canvas, { pointerX: 2, pointerY: 2}); }, this);
		},
		
		test_mouse_event_types: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 4; canvas.height = 4;
			
			var tree = new CanvasMouseEventTree(canvas);
			var node = new InteractiveCanvasNode(0, 2, 2, 2, 2);
			tree.add_node(node);
			
			// This is really odd because the test case code doesn't cope with mootools' event stuff
			var dummy = {test1:function(){}, test2:function(){}};
			var testFunc1 = function(){dummy.test1();};
			var testFunc2 = function(){dummy.test2();};
			
			
			node.addEvent('mousedown', testFunc1);
			this.assert_called(dummy, 'test1', function(){ this.fire_mouse_down(canvas, { pointerX: 2, pointerY: 2}); }, this);
			node.removeEvent('mousedown', testFunc1);

			node.addEvent('mouseup',   testFunc1);
			this.assert_called(dummy, 'test1', function(){ this.fire_mouse_up(  canvas, { pointerX: 2, pointerY: 2}); }, this);
			node.removeEvent('mouseup',   testFunc1);

			node.addEvent('click',     testFunc1);
			this.assert_called(dummy, 'test1', function(){ this.fire_click(     canvas, { pointerX: 2, pointerY: 2}); }, this);
			node.removeEvent('click',     testFunc1);

			node.addEvent('mouseover',   testFunc1);
			node.addEvent('mouseout',  testFunc2);
			this.assert_called([[dummy, 'test1'],[dummy, 'test2']], function(){
				this.fire_mouse_move( canvas, { pointerX: 0, pointerY: 0});
				this.fire_mouse_move( canvas, { pointerX: 2, pointerY: 2});
				this.fire_mouse_move( canvas, { pointerX: 4, pointerY: 4});
			}, this);
			node.removeEvent('mouseover',   testFunc1);
			node.removeEvent('mouseout',  testFunc2);
			
			node.addEvent('mousemove', testFunc1);
			this.assert_called(dummy, 'test1', function(){
				this.fire_mouse_move(canvas, { pointerX: 2, pointerY: 2});
				this.fire_mouse_move(canvas, { pointerX: 3, pointerY: 3});
			}, this);
			node.removeEvent('mousemove', testFunc1);
		}
		
	})
)).run_on_load();