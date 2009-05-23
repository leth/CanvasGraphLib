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
		test_add_nodes: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 5; canvas.height = 5;
			
			var tree = new CanvasBoundsTree(canvas);
			var nodes = [new SizedCanvasTreeNode(0, 2.5, 2.5, 5, 5), new SizedCanvasTreeNode(1, 1.5, 0.5, 1, 1), new SizedCanvasTreeNode(2, 1, 2, 2 ,2)];
			tree.add_nodes(nodes);
			var node4 = new SizedCanvasTreeNode(3, 2, 1.5, 2, 1);
			tree.add_node(node4);
			
			nodes.push(node4);
			// Nodes crossing all mid-lines, y mid-line, x mid-line
			this.assert_equal(tree.root.nodes, [nodes[0], nodes[2], node4]);
			// Only one sublevel
			this.assert_not_null(tree.root.children[0]);
			this.assert_null(tree.root.children[1]);
			this.assert_null(tree.root.children[2]);
			this.assert_null(tree.root.children[3]);
			
			this.assert_equal(tree.root.children[0].nodes, [nodes[1]]);
			delete node4;
			
			// Check sublevel assignments
			var canvas = document.createElement('canvas');
			canvas.width = 10; canvas.height = 10;
			
			var tree = new CanvasBoundsTree(canvas);
			var nodes = [new SizedCanvasTreeNode(0, 2.5, 2.5, 3, 3), new SizedCanvasTreeNode(1, 2.5, 1.5, 3, 1),
			             new SizedCanvasTreeNode(2, 1.5, 2.5, 1 ,3), new SizedCanvasTreeNode(3, 3.5, 3.5, 1, 1)];
			tree.add_nodes(nodes);
			
			this.assert_equal(nodes[0], tree.root.children[0].nodes[0]);
			this.assert_equal(nodes[1], tree.root.children[0].nodes[1]);
			this.assert_equal(nodes[2], tree.root.children[0].nodes[2]);
			this.assert_not_null(tree.root.children[0].children[3]);
			this.assert_equal(nodes[3], tree.root.children[0].children[3].nodes[0]);
		},
		test_add_nodes_tree_depth_limit: function() {
			var canvas = document.createElement('canvas');
			canvas.width = 1; canvas.height = 1;
			
			var tree = new CanvasBoundsTree(canvas);
			tree.add_nodes([new SizedCanvasTreeNode(0, 0, 0), new SizedCanvasTreeNode(1, 1, 0),
			                new SizedCanvasTreeNode(2, 0, 1), new SizedCanvasTreeNode(3, 1, 1)]);
			
			this.assert_equal(tree.root.children, {});
		}
	}),
	TestCase.create({
		name: 'BoundsTreeLevel',
		
		test_instantiate: function() {
			this.assert_nothing_thrown(function(){	new CanvasBoundsTreeLevel(null, 0, 0, 1, 1); });
		},
		test__classify: function() {
			var treeLevel = new CanvasBoundsTreeLevel(null, null, 0, 0, 1, 1);
			this.assert_equal(0, treeLevel._classify(new SizedCanvasTreeNode(0, 0, 0)));
			this.assert_equal(1, treeLevel._classify(new SizedCanvasTreeNode(0, 1, 0)));
			this.assert_equal(2, treeLevel._classify(new SizedCanvasTreeNode(0, 0, 1)));
			this.assert_equal(3, treeLevel._classify(new SizedCanvasTreeNode(0, 1, 1)));
			this.assert_equal(-1,treeLevel._classify(new SizedCanvasTreeNode(0, 0, 0, 1, 1)));
		},
		test_add_nodes: function(){
			var dummyTree = {node_id_to_level: {}};
			var tl = new CanvasBoundsTreeLevel(dummyTree, null, 0, 0, 10, 10);
			var nodes = [new SizedCanvasTreeNode(0, 0, 0), new SizedCanvasTreeNode(1, 1, 0),
			             new SizedCanvasTreeNode(2, 0, 1), new SizedCanvasTreeNode(3, 7, 7)];
			
			tl.add_nodes(nodes);
			// check the nodes are in the correct quadrants
			this.assert_same(nodes[0], tl.children[0].children[0].children[0].children[0].nodes[0]);
			this.assert_same(nodes[1], tl.children[0].children[0].children[0].children[1].nodes[0]);
			this.assert_same(nodes[2], tl.children[0].children[0].children[0].children[2].nodes[0]);
			this.assert_same(nodes[3], tl.children[3].nodes[0]);
			
			// check the level cache
			this.assert_same(dummyTree.node_id_to_level[nodes[0].id], tl.children[0].children[0].children[0].children[0]);
			this.assert_same(dummyTree.node_id_to_level[nodes[1].id], tl.children[0].children[0].children[0].children[1]);
			this.assert_same(dummyTree.node_id_to_level[nodes[2].id], tl.children[0].children[0].children[0].children[2]);
			this.assert_same(dummyTree.node_id_to_level[nodes[3].id], tl.children[3]);
			
		}
	})
)).run_on_load();