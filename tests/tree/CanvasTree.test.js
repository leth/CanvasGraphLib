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
		name: 'CanvasTreeLevel',
		
		test_instantiate: function() {
			this.assert_nothing_thrown(function(){	new CanvasTreeLevel(null, 0, 0, 1, 1); });
		},
		test__classify: function() {
			var treeLevel = new CanvasTreeLevel(null, null, 0, 0, 1, 1);
			this.assert_equal(0, treeLevel._classify(new CanvasTreeNode(0, 0, 0)));
			this.assert_equal(1, treeLevel._classify(new CanvasTreeNode(0, 1, 0)));
			this.assert_equal(2, treeLevel._classify(new CanvasTreeNode(0, 0, 1)));
			this.assert_equal(3, treeLevel._classify(new CanvasTreeNode(0, 1, 1)));
		},
		test_add_nodes: function(){
			var dummyTree = {node_id_to_level: {}};
			var tl = new CanvasTreeLevel(dummyTree, null, 0, 0, 10, 10);
			var nodes = [new CanvasTreeNode(0, 0, 0), new CanvasTreeNode(1, 1, 0), new CanvasTreeNode(2, 0, 1), new CanvasTreeNode(3, 7, 7)];
			
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