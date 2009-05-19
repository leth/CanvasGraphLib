(new TestSuite(
	TestCase.create({
		name: 'Tree',
		
		test_instantiate: function () {
			this.assertNothingThrown(function(){
				new Tree();	
			});
		}
	})
)).run_on_load();