(new TestSuite(
	TestCase.create({
		name: 'CanvasTree',
		
		test_instantiate: function () {
			this.assert_throws(function(){	new CanvasTree(); });
			this.assert_throws(function(){	new CanvasTree(''); });
			this.assert_throws(function(){	new CanvasTree(5); });
			this.assert_throws(function(){	new CanvasTree({}); });
			this.assert_throws(function(){	new CanvasTree([]); });
			
			this.assert_nothing_thrown(function(){	new CanvasTree(document.createElement('canvas')); });
		},
		test_add_nodes: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 1; canvas.height = 1;
			
			var tree = new CanvasTree(canvas);
			var nodes = [new CanvasTreeNode(0, 0, 0), new CanvasTreeNode(1, 1, 0), new CanvasTreeNode(2, 0, 1)];
			tree.add_nodes(nodes);
			var node4 = new CanvasTreeNode(3, 1, 1);
			tree.add_node(node4);
			
			nodes.push(node4);
			this.assert_equal(tree.root.nodes, nodes);
		},
		test_add_nodes_tree_depth_limit: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 1; canvas.height = 1;
			
			var tree = new CanvasTree(canvas);
			tree.add_nodes([new CanvasTreeNode(0, 0, 0), new CanvasTreeNode(1, 1, 0), new CanvasTreeNode(2, 0, 1), new CanvasTreeNode(3, 1, 1)]);
			
			this.assert_equal(tree.root.children, {});
		}
	}),
	TestCase.create({
		name: 'CanvasQuadTreeLevel',
		
		test_instantiate: function() {
			this.assert_nothing_thrown(function(){	new CanvasQuadTreeLevel(null, 0, 0, 1, 1); });
		},
		test__classify: function() {
			var treeLevel = new CanvasQuadTreeLevel(null, null, 0, 0, 1, 1);
			this.assert_equal(0, treeLevel._classify(new CanvasTreeNode(0, 0, 0)));
			this.assert_equal(1, treeLevel._classify(new CanvasTreeNode(0, 1, 0)));
			this.assert_equal(2, treeLevel._classify(new CanvasTreeNode(0, 0, 1)));
			this.assert_equal(3, treeLevel._classify(new CanvasTreeNode(0, 1, 1)));
		}
	})
)).run_on_load();