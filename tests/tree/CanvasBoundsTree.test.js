(new TestSuite(
	TestCase.create({
		name: 'CanvasBoundsTree',
		
		test_instantiate: function () {
			this.assert_throws(function(){	new CanvasBoundsTree(); });
			this.assert_throws(function(){	new CanvasBoundsTree(''); });
			this.assert_throws(function(){	new CanvasBoundsTree(5); });
			this.assert_throws(function(){	new CanvasBoundsTree({}); });
			this.assert_throws(function(){	new CanvasBoundsTree([]); });
			
			this.assert_nothing_thrown(function(){	new CanvasBoundsTree(document.createElement('canvas')); });
		},
		test_add_nodes_toplevel: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 5; canvas.height = 5;
			
			var tree = new CanvasBoundsTree(canvas);
			var nodes = [new SizedCanvasTreeNode(0, 2.5, 2.5, 5, 5),
			 			 new SizedCanvasTreeNode(1, 1.5, 0.5, 1, 1), 
						 new SizedCanvasTreeNode(2, 1, 2, 2 ,2)];
			
			tree.add_nodes(nodes);
			var node4 = new SizedCanvasTreeNode(3, 2, 1.5, 2, 1);
			tree.add_node(node4);
			
			nodes.push(node4);
			// Nodes crossing all mid-lines, y mid-line, x mid-line
			this.assert_array_contains(tree.root.nodes, nodes[0]);
			this.assert_array_contains(tree.root.nodes, nodes[2]);
			this.assert_array_contains(tree.root.nodes, node4);
			
			// Only one sublevel
			this.assert_not_null(tree.root.children[0]);
			this.assert_null(tree.root.children[1]);
			this.assert_null(tree.root.children[2]);
			this.assert_null(tree.root.children[3]);
			
			this.assert_array_contains(tree.root.children[0].nodes, nodes[1]);
		},
		test_add_nodes_sublevel: function(){
			// Check sublevel assignments
			var canvas = document.createElement('canvas');
			canvas.width = 20; canvas.height = 20;
			
			var tree = new CanvasBoundsTree(canvas);
			var nodes = [new SizedCanvasTreeNode(0, 4, 4, 4, 4), new SizedCanvasTreeNode(1, 4, 2, 4, 2),
			             new SizedCanvasTreeNode(2, 2, 4, 2 ,4), new SizedCanvasTreeNode(3, 7, 7, 2, 2)];
			tree.add_nodes(nodes);
			
			this.assert_array_contains(tree.root.children[0].nodes, nodes[0]);
			this.assert_array_contains(tree.root.children[0].nodes, nodes[1]);
			this.assert_array_contains(tree.root.children[0].nodes, nodes[2]);
			
			this.assert_not_null(tree.root.children[0].children[3]);
			this.assert_array_contains(tree.root.children[0].children[3].nodes, nodes[3]);
		},
		test_add_nodes_tree_depth_limit: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 1; canvas.height = 1;
			
			var tree = new CanvasBoundsTree(canvas);
			tree.add_nodes([new SizedCanvasTreeNode(0, 0, 0, 1, 1), new SizedCanvasTreeNode(1, 1, 0, 1, 1),
			                new SizedCanvasTreeNode(2, 0, 1, 1, 1), new SizedCanvasTreeNode(3, 1, 1, 1, 1)]);
			
			this.assert_equal(tree.root.children, {});
		}
	}),
	TestCase.create({
		name: 'BoundsTreeLevel',
		
		test_instantiate: function() {
			this.assert_nothing_thrown(function(){	new CanvasBoundsTreeLevel(null, 0, 0, 1, 1); });
		},
		test__classify_node: function() {
			var treeLevel = new CanvasBoundsTreeLevel(null, null, 0, 0, 2, 2);
			this.assert_equal(0, treeLevel._classify_node(new SizedCanvasTreeNode(0, 0, 0)));
			this.assert_equal(1, treeLevel._classify_node(new SizedCanvasTreeNode(0, 2, 0)));
			this.assert_equal(2, treeLevel._classify_node(new SizedCanvasTreeNode(0, 0, 2)));
			this.assert_equal(3, treeLevel._classify_node(new SizedCanvasTreeNode(0, 2, 2)));
			this.assert_equal(true,treeLevel._classify_node(new SizedCanvasTreeNode(0, .5, .5, 1, 1)));
			this.assert_equal(false,treeLevel._classify_node(new SizedCanvasTreeNode(0, 0, 0, 1, 1)));
		}
	})
)).run_on_load();