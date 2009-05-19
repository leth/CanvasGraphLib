/**
 * This is the all-in-one tests collection for the build testing purposes
 * Copyright (C) 2007-2008 Nikolay V. Nemshilov aka St. <nemshilov-gmail-com>
 */


var TestCaseUtilTest = TestCase.create({
  name: "TestCaseUtilTest",
  test_to_array: function() {
    this.assert_equal(['bla', 'foo'], (function() {
      return TestCaseUtil.to_a(arguments);
    })('bla', 'foo'));
  },
  test_extend: function() {
    var o1 = { bla: 'bla' };
    var o2 = { foo: 'foo' };
    var o3 = TestCaseUtil.extend(o1, o2);
    this.assert_equal('bla', o3.bla);
    this.assert_equal('foo', o3.foo);
  },
  _create_klass: function() {
    return TestCaseUtil.create_class({
      bla: 'bla',
      foo: function() {}
    });
  },
  test_create_class: function() {
    var klass = this._create_klass(); 
    this.assert_type_of('function', klass);
    this.assert_equal('bla', klass.prototype.bla);
    this.assert_equal(function() {}, klass.prototype.foo);
  },
  test_create_class_with_constructor: function() {
    var klass = TestCaseUtil.create_class({
      initialize: function(bla, foo) {
        this.bla = bla;
        this.foo = foo;
      }
    });
    var o = new klass('bla', 'foo');
    this.assert_equal('bla', o.bla);
    this.assert_equal('foo', o.foo);
  },
  test_create_class_instance: function() {
    var o = null, klass = this._create_klass();
    this.assert_nothing_thrown(function() {
      o = new klass; 
    });
    this.assert_instance_of(klass, o);
    this.assert_equal('bla', o.bla);
    this.assert_equal(function() {}, o.foo);
  },
  test_create_class_inherited: function() {
    var klass = this._create_klass();
    var subklass = TestCaseUtil.create_class(klass, {
      asdf: 'asdf',
      bla: 'subbla'
    });
    this.assert_type_of('function', subklass);
    this.assert_equal(klass.prototype.foo, subklass.prototype.foo);
    this.assert_equal('asdf', subklass.prototype.asdf);
    this.assert_equal('subbla', subklass.prototype.bla);
  },
  test_extend_with_camelized_aliases: function() {
    var o = {};
    var mixin = {test_one: 1, test_two: 2};
    TestCaseUtil.extend(o, mixin);
    this.assert_equal(1, o['test_one']);
    this.assert_equal(2, o['test_two']);
    this.assert_null(o['testOne']);
    this.assert_null(o['testTwo']);
    TestCaseUtil.extend_with_camelized_aliases(o, mixin);
    this.assert_equal(1, o['test_one']);
    this.assert_equal(2, o['test_two']);
    this.assert_equal(1, o['testOne']);
    this.assert_equal(2, o['testTwo']);
  },
  test_extend_fully_object_and_prototype: function() {
    var c = TestCaseUtil.create_class();
    var mixin = {test_one: 1, test_two: 2};
    TestCaseUtil.extend_fully_object_and_prototype(c, mixin);
    this.assert_equal(1, c['test_one']);
    this.assert_equal(2, c['test_two']);
    this.assert_equal(1, c['testOne']);
    this.assert_equal(2, c['testTwo']);
    this.assert_equal(1, c.prototype['test_one']);
    this.assert_equal(2, c.prototype['test_two']);
    this.assert_equal(1, c.prototype['testOne']);
    this.assert_equal(2, c.prototype['testTwo']);
  },
  test_to_string: function() {
    this.assert_equal('null', TestCaseUtil.to_s(null));
    this.assert_equal('false', TestCaseUtil.to_s(false));
    this.assert_equal('true', TestCaseUtil.to_s(true));
    this.assert_equal('123', TestCaseUtil.to_s(123));
    this.assert_equal('1.3', TestCaseUtil.to_s(1.3));
    this.assert_equal('"string"', TestCaseUtil.to_s('string'));
    this.assert_equal('[1, 2, 3]', TestCaseUtil.to_s([1,2,3]));
    this.assert_equal('{"a": 1, "b": 2, "c": 3}', TestCaseUtil.to_s({a:1,b:2,c:3}));
    this.assert_equal('[1, [2, [3]]]', TestCaseUtil.to_s([1,[2,[3]]]), "Check recursion");
    var element = document.createElement('div');
    element.id = 'div-id';
    element.className = 'div-class';
    element.title = 'div title';
    element.innerHTML = 'bla bla bla';
    this.assert_equal('<DIV id="div-id" class="div-class" title="div title">bla bla bla</DIV>',TestCaseUtil.to_s(element));
    this.assert_equal('[<DIV id="div-id" class="div-class" title="div title">bla bla bla</DIV>]',TestCaseUtil.to_s([element]));
  },
  test_debug: function() {
    this.assert_equal('null', TestCaseUtil.debug(null));
    this.assert_equal('false', TestCaseUtil.debug(false));
    this.assert_equal('true', TestCaseUtil.debug(true));
    this.assert_equal('123', TestCaseUtil.debug(123));
    this.assert_equal('1.3', TestCaseUtil.debug(1.3));
    this.assert_equal('"string"', TestCaseUtil.debug('string'));
    this.assert_equal('[1, 2, 3]', TestCaseUtil.debug([1,2,3]));
    this.assert_equal('{"a": 1, "b": 2, "c": 3}', TestCaseUtil.debug({a:1,b:2,c:3}));
    this.assert_equal('[1, [...]]', TestCaseUtil.debug([1,[2,[3]]]), "Check recursion");
    this.assert_equal('{"a": 1, "b": {...}}', TestCaseUtil.debug({a:1,b:{c:3}}));
  },
  test_$: function() {
    this.assert_null(TestCaseUtil.$('nonexistingid'));
    var el = document.createElement('div');
    el.id = 'test-case-simple-test-of-element-existing-id';
    document.body.appendChild(el);
    this.assert_same(el, TestCaseUtil.$(el.id));
    this.assert_same(el, TestCaseUtil.$(el));
    document.body.removeChild(el);
  },
  test_get_object_class_name: function() {
    var _ = TestCaseUtil.get_object_class_name;
    this.assert_equal('Null', _(null));
    this.assert_equal('String', _(''));
    this.assert_equal('Boolean', _(true));
    this.assert_equal('Number', _(1));
    this.assert_equal('Number', _(1.1));
    this.assert_equal('Function', _(function(){}));
    this.assert_equal('Array', _([]));
    this.assert_equal('Object', _({}));
    this.assert_equal(TestCaseUtil.Browser.Konqueror ? 'Object' : 'MyClass', _(new (function MyClass() {})()));
    self.__MyClass = function(){};
    this.assert_equal('__MyClass', _(new __MyClass));
    this.assert_equal('Object', _(new (function() {})()));
  },
  test_get_class_name: function() {
    var _ = TestCaseUtil.get_class_name;
    this.assert_equal('Null', _(null));
    this.assert_equal('String', _(String));
    this.assert_equal('Boolean', _(Boolean));
    this.assert_equal('Number', _(Number));
    this.assert_equal('Function', _(Function));
    this.assert_equal('Array', _(Array));
    this.assert_equal('Object', _(Object));
    self.__MyClass = function() {};
    this.assert_equal('__MyClass', _(self.__MyClass));
    this.assert_equal('Unknown', _(function() {}));
  },
  test_to_pretty_s: function() {
    var object = [
      {key: 'asdfasdfasdfasdfasdfasdfasf', bla: 'asdfasdfasdfasdfasdfasdfasdf asd fasdf asdfsafdasdf',
       sdf: 234,
       asd: {
         wer: 'asdfsdf sdf sdf sdfsdfsdfsdfsfsdfsdf',
         df: 'dfdfdfd fdfdfsdfs fd adsfasdfasdfasdf',
         lkj: {asdf: 'asdf', lkjsdf:234, sdf: false}
       }},
      [1, 2, 3, [4,5,[34]]],
      "asdf"
    ];
    var response = '[{"key": "asdfasdfasdfasdfasdfasdfasf",'+"\n"+
                   '   "bla": "asdfasdfasdfasdfasdfasdfasdf asd fasdf asdfsafdasdf",'+"\n"+
                   '   "sdf": 234,'+"\n"+
                   '   "asd": {"wer": "asdfsdf sdf sdf sdfsdfsdfsdfsfsdfsdf",'+"\n"+
                   '     "df": "dfdfdfd fdfdfsdfs fd adsfasdfasdfasdf",'+"\n"+
                   '     "lkj": {"asdf": "asdf", "lkjsdf": 234, "sdf": false}'+"\n"+
                   '    }'+"\n"+
                   '  },'+"\n"+
                   ' [1, 2, 3, [4, 5, [34]]],'+"\n"+
                   ' "asdf"'+"\n"+
                   ']';
    this.assert_equal(response, TestCaseUtil.to_pretty_s(object));
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.ArrayTest = TestCase.create({
  name: "TestCaseUtil.ArrayTest",
  test_include: function() {
    this.assert(TestCaseUtil.Array.include([1,2,3],1));
    this.assert(TestCaseUtil.Array.include([1,2,3],2));
    this.assert(TestCaseUtil.Array.include([1,2,3],3));
    this.assert_false(TestCaseUtil.Array.include([1,2,3],4));
  },
  test_merge: function() {
    this.assert_equal([1,2,3], TestCaseUtil.Array.merge([1], [2,3]));
    this.assert_equal([1,2,3], TestCaseUtil.Array.merge([1, 2], [2,3]));
  },
  test_without: function() {
    this.assert_equal([1,3], TestCaseUtil.Array.without([1,2,3],2));
  },
  test_uniq: function() {
    this.assert_equal([1,2,3], TestCaseUtil.Array.uniq([1,2,3,2,3,2,3,2,1,2,3]));
  },
  test_each: function() {
    var i=0;
    TestCaseUtil.Array.each([1,2,3,4], function(item) { i+= item; });
    this.assert_equal(10, i);
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.EventTest = TestCase.create({
  name: "TestCaseUtil.EventTest",
  setup: function() {
    this.element = document.createElement('div');
    document.body.appendChild(this.element);
  },
  teardown: function() {
    document.body.removeChild(this.element);
  },
  test_observe: function() {
    var clicked = false;
    TestCaseUtil.Event.observe(this.element, 'click', function() {
      clicked = true;
    }); 
    this.fire_click(this.element);
    this.assert(clicked);
  },
  test_target: function() {
    var target=null;
    TestCaseUtil.Event.observe(this.element, 'click', function(event) {
      target = TestCaseUtil.Event.element(event);
    });
    this.fire_click(this.element);
    this.assert_same(target, this.element);
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.ElementTest = TestCase.create({
  name: "TestCaseUtil.ElementTest",
  test_select_up: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('label');
    var el3 = document.createElement('span');
    el1.appendChild(el2);
    el2.appendChild(el3);
    el1.className = 'div-class';
    el2.className = 'label-class';
    el3.className = 'span-class';
    el1.id = 'div-id';
    el2.id = 'label-id';
    el3.id = 'span-id';
    var get_up = function() {
      return TestCaseUtil.Element.up.apply(TestCaseUtil.Element, arguments);
    };
    this.assert_same(el1, get_up(el3, 'div'));
    this.assert_same(el1, get_up(el3, 'div.div-class'));
    this.assert_same(el1, get_up(el3, '.div-class'));
    this.assert_same(el1, get_up(el3, 'div#div-id'));
    this.assert_same(el1, get_up(el3, '#div-id'));
    this.assert_same(el1, get_up(el2, 'div'));
    this.assert_same(el1, get_up(el2, 'div.div-class'));
    this.assert_same(el1, get_up(el2, '.div-class'));
    this.assert_same(el1, get_up(el2, 'div#div-id'));
    this.assert_same(el1, get_up(el2, '#div-id'));
    this.assert_same(el2, get_up(el3, 'label'));
    this.assert_same(el2, get_up(el3, 'label.label-class'));
    this.assert_same(el2, get_up(el3, '.label-class'));
    this.assert_same(el2, get_up(el3, 'label#label-id'));
    this.assert_same(el2, get_up(el3, '#label-id'));
  },
  test_has_class_name: function() {
    var element = document.createElement('div');
    var has = function() {
      return TestCaseUtil.Element.has_class_name.apply(TestCaseUtil.Element, arguments);
    };
    var has_all = function() {
      return TestCaseUtil.Element.has_class_names.apply(TestCaseUtil.Element, arguments);
    };
    this.assert_false(has(element, 'any'));
    element.className = 'foo bla';
    this.assert(has(element, 'foo'));
    this.assert(has(element, 'bla'));
    this.assert_false(has(element, 'asdf'));
    this.assert(has_all(element, ['foo', 'bla']));
    this.assert_false(has_all(element, ['foo', 'asdf']));
  },
  test_add_and_remove_class_name: function() {
    var element = document.createElement('div');
    TestCaseUtil.Element.add_class_name(element, 'foo');
    this.assert_equal('foo', element.className);
    TestCaseUtil.Element.add_class_name(element, 'foo');
    this.assert_equal('foo', element.className);
    TestCaseUtil.Element.add_class_name(element, 'bla');
    this.assert_equal('foo bla', element.className);
    TestCaseUtil.Element.remove_class_name(element, 'foo');
    this.assert_equal('bla', element.className);
    TestCaseUtil.Element.remove_class_name(element, 'bla');
    this.assert_equal('', element.className);
  },
  test_element_has_attributes: function() {
    var element = document.createElement('div');
    var check = function() {
      return TestCaseUtil.Element.has_attributes.apply(TestCaseUtil.Element, arguments);
    };
    this.assert(check(element, {}));
    this.assert(check(element, {tagName: 'DIV'}));
    this.assert_false(check(element, {tagName: 'SPAN'}));
    element.id = 'foo';
    this.assert(check(element, {tagName: 'DIV', id: 'foo'}));
    this.assert_false(check(element, {tagName: 'DIV', id: 'bla'}));
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.Element.SelectorTest = TestCase.create({
  name: "TestCaseUtil.Element.SelectorTest",
  test_element_match: function() {
    var element = document.createElement('input');
    var match = function() {
      return TestCaseUtil.Element.Selector.match_atom.apply(TestCaseUtil.Element, arguments);
    };
    this.assert(match(element, '*'), '*');
    this.assert(match(element, 'input'), 'input');
    this.assert_false(match(element, 'div'), 'div');
    element.className = 'foo bla';
    this.assert(match(element, '.foo'), '.foo');
    this.assert(match(element, '.bla'), '.bla');
    this.assert(match(element, 'input.foo'), 'input.foo');
    this.assert(match(element, 'input.bla'), 'input.bla');
    this.assert_false(match(element, '.asdf'), '.asdf');
    this.assert_false(match(element, 'input.asdf'), 'input.asdf');
    this.assert(match(element, '.foo.bla'), '.foo.bla');
    this.assert(match(element, '.bla.foo'), '.bla.foo');
    this.assert(match(element, 'input.foo.bla'), 'input.foo.bla');
    this.assert(match(element, 'input.bla.foo'), 'input.bla.foo');
    this.assert_false(match(element, '.asdf.bla'), '.asdf.bla');
    this.assert_false(match(element, '.asdf.foo'), '.asdf.foo');
    this.assert_false(match(element, 'input.asdf.bla'), 'input.asdf.bla');
    this.assert_false(match(element, 'input.asdf.foo'), 'input.asdf.foo');
    element.id = 'foo-bla';
    this.assert(match(element, '#foo-bla'), '#foo-bla');
    this.assert(match(element, 'input#foo-bla'), 'input#foo-bla');
    this.assert_false(match(element, '#asdf'), '#asdf');
    this.assert_false(match(element, 'input#asdf'), 'input#asdf');
    this.assert(match(element, '#foo-bla.foo'), '#foo-bla.foo');
    this.assert(match(element, '#foo-bla.bla'), '#foo-bla.bla');
    this.assert(match(element, 'input#foo-bla.foo'), 'input#foo-bla.foo');
    this.assert(match(element, 'input#foo-bla.bla'), 'input#foo-bla.bla');
    this.assert_false(match(element, '#foo-bla.asdf'), '#foo-bla.asdf');
    this.assert_false(match(element, 'input#foo-bla.asdf'), 'input#foo-bla.asdf');
    this.assert(match(element, '#foo-bla.foo.bla'), '#foo-bla.foo.bla');
    this.assert(match(element, '#foo-bla.bla.foo'), '#foo-bla.bla.foo');
    this.assert(match(element, 'input#foo-bla.foo.bla'), 'input#foo-bla.foo.bla');
    this.assert(match(element, 'input#foo-bla.bla.foo'), 'input#foo-bla.bla.foo');
    this.assert_false(match(element, '#foo-bla.asdf.bla'), '#foo-bla.asdf.bla');
    this.assert_false(match(element, '#foo-bla.asdf.foo'), '#foo-bla.asdf.foo');
    this.assert_false(match(element, 'input#foo-bla.asdf.bla'), 'input#foo-bla.asdf.bla');
    this.assert_false(match(element, 'input#foo-bla.asdf.foo'), 'input#foo-bla.asdf.foo');
    element.type = 'checkbox';
    this.assert(match(element, 'input[type="checkbox"]'));
    this.assert_false(match(element, 'input[type="text"]'));
    element.title = 'foo-bla';
    this.assert(match(element, '*[title|=\'foo\']'));
    this.assert(match(element, '*[title|=\'bla\']'));
    this.assert_false(match(element, '*[title|=\'asdf\']'));
    element.value = 'foo bla';
    this.assert(match(element, '[value~="foo"]'), '[value~="foo"]');
    this.assert(match(element, '[value~="bla"]'), '[value~="bla"]');
    this.assert_false(match(element, '[value~="asdf"]'), '[value~="asdf"]');
  },
  test_css_ruel_resolving: function() {
    var rule = 'input#foo-bla.asdf.foo-bla[type="text"][title|=\'asdf\']:first-child > '+
                  'option#first-option[value="1"] + option[value="2"] div, '+
               'input[type="checkbox"]:last-child div ~ span, '+
               'table[collspan~="0"] ~ div#footer';
    this.assert_equal(
      [[{ "rule": "input#foo-bla.asdf.foo-bla[type=\"text\"][title|='asdf']:first-child", 
          "rel": null, "tag_name": "INPUT", "id": "foo-bla", 
          "class_names": ["asdf", "foo-bla"], "pseudo": "first-child", 
          "attrs": [{"name": "type", "type": "=", "value": "text"}, 
                    {"name": "title", "type": "|=", "value": "asdf"}]
        }, {
          "rule": "option#first-option[value=\"1\"]", 
          "rel": ">", "tag_name": "OPTION", "id": "first-option", 
          "class_names": [], "pseudo": null, 
          "attrs": [{"name": "value", "type": "=", "value": "1"}]
        }, {
          "rule": "option[value=\"2\"]", 
          "rel": "+", "tag_name": "OPTION", "id": null, 
          "class_names": [], "pseudo": null, 
          "attrs": [{"name": "value", "type": "=", "value": "2"}]
        }, {
          "rule": "div", "rel": " ", 
          "tag_name": "DIV", "id": null, "class_names": [], "pseudo": null, 
          "attrs": []
        }], 
       [{
          "rule": "input[type=\"checkbox\"]:last-child", 
          "rel": null, "tag_name": "INPUT", "id": null, 
          "class_names": [], "pseudo": "last-child", 
          "attrs": [{"name": "type", "type": "=", "value": "checkbox"}]
        }, {
          "rule": "div", "rel": " ", 
          "tag_name": "DIV", "id": null, "class_names": [], 
          "pseudo": null, "attrs": []
        }, {
          "rule": "span", "rel": "~", 
          "tag_name": "SPAN", "id": null, "class_names": [], 
          "pseudo": null, "attrs": []
        }], 
       [{
          "rule": "table[collspan~=\"0\"]", 
          "rel": null, "tag_name": "TABLE", "id": null, 
          "class_names": [], "pseudo": null, 
          "attrs": [{"name": "collspan", "type": "~=", "value": "0"}]
        }, {
          "rule": "div#footer", "rel": "~", 
          "tag_name": "DIV", "id": "footer", "class_names": [], 
          "pseudo": null, "attrs": []
        }]
      ], 
      TestCaseUtil.Element.Selector._parse_rule(rule)
    );
  },
  test_select: function() {
    var el1 = document.createElement('div');
    var el11 = document.createElement('div');
    var el111 = document.createElement('div');
    var el112 = document.createElement('div');
    var el1121 = document.createElement('div');
    var el12 = document.createElement('span');
    var el121 = document.createElement('span');
    var el122 = document.createElement('span');
    var el1221 = document.createElement('label');
    var el1222 = document.createElement('input');
    el1.appendChild(el11);
    el1.appendChild(el12);
    el11.appendChild(el111);
    el11.appendChild(el112);
    el112.appendChild(el1121);
    el12.appendChild(el121);
    el12.appendChild(el122);
    el122.appendChild(el1221);
    el122.appendChild(el1222);
    el1.className = 'div el1';
    el11.className = 'div el11';
    el111.className = 'div el111';
    el112.className = 'div el112';
    el1121.className = 'div el1121';
    el12.className = 'span el12';
    el121.className = 'span el121';
    el122.className = 'span el122';
    el1221.className = 'label el1221';
    el1222.className = 'input el1222';
    el1.id = 'el1';
    el11.id = 'el11';
    el111.id = 'el111';
    el112.id = 'el112';
    el1121.id = 'el1121';
    el121.id = 'el121';
    el122.id = 'el122';
    el1221.id = 'el1221';
    el1222.id = 'el1222';
    var select = function() {
      return TestCaseUtil.Element.Selector.find_all.apply(TestCaseUtil.Element.Selector, arguments);
    };
    this.assert_equal([], select(el1, '#nonexisting-id'), '#nonexisting-id');
    this.assert_equal([el11], select(el1, '#el11'), '#el11');
    this.assert_equal([el112], select(el1, '#el112'), '#el112');
    this.assert_equal([el1121], select(el1, '#el1121'), '#el1121');
    this.assert_equal([el11, el111, el112, el1121], select(el1, 'div'), 'div');
    this.assert_equal([el11, el111, el112, el1121], select(el1, '.div'), '.div');
    this.assert_equal([el11, el111, el112, el1121], select(el1, 'div.div'), 'div.div');
    this.assert_equal([el1221], select(el1, 'label'), 'label');
    this.assert_equal([el11, el111, el1121], select(el1, 'div:first-child'), 'div:first-child');
    this.assert_equal([el112, el1121], select(el1, 'div:last-child'), 'div:last-child');
    this.assert_equal([el111, el112, el1121], select(el1, 'div div'), 'div div');
    this.assert_equal([el1121], select(el1, 'div div div'), 'div div div');
    this.assert_equal([el121, el122], select(el1, 'span span'), 'span span');
    this.assert_equal([], select(el1, 'span span span'), 'span span span');
    this.assert_equal([el1221], select(el1, 'span label'), 'span label');
    this.assert_equal([el1222], select(el1, 'span input'), 'span input');
    this.assert_equal([el1221], select(el1, 'span span label'), 'span span label');
    this.assert_equal([el1222], select(el1, 'span span input'), 'span span input');
    this.assert_equal([el1221], select(el1, 'span > label'));
    this.assert_equal([el1221], select(el1, 'span#el122 > label'));
    this.assert_equal([], select(el1, 'span#el12 > label'));
    this.assert_equal([el122], select(el1, 'span + span'));
    this.assert_equal([el122], select(el1, 'span ~ span'));
  }
});
/* ------------------------------------------------------------------- */

TestCaseUtil.DiffTest = TestCase.create({
  name: 'TestCaseUtil.DiffTest',
  setup: function() {
    this._ = function() { return TestCaseUtil.Diff.calc.apply(TestCaseUtil.Diff, arguments) };
    this.scope = {scope: this};
  },
  test_should_raise_an_exception_if_objects_are_different: function() {
    this.assert_throws(String, function() { this._('1', 1); }, this.scope);
    this.assert_throws(String, function() { this._({}, []); }, this.scope);
  },
  test_should_raise_an_exception_if_one_object_is_null: function() {
    this.assert_throws(String, function() { this._(null, 'asdf'); }, this.scope);
    this.assert_throws(String, function() { this._('asdf', null); }, this.scope);
  },
  test_should_return_an_empty_list_on_equal_objects: function() {
    this.assert_equal([], this._('asdf', 'asdf'));
    this.assert_equal([], this._([1, 2], [1, 2]));
    this.assert_equal([], this._({a: 2}, {a: 2}));
  },
  test_getting_diff_of_strings: function() {
    this.assert_equal([{ins: 'qwer'}, {eql: 'asdf'}], this._('asdf', "qwer\nasdf"));
    this.assert_equal([{ins: 'qwer'}, {eql: 'asdf'}, {ins: 'zxcv'}], this._('asdf', "qwer\nasdf\nzxcv"));
    this.assert_equal([{eql: "qwer\nasdf"}, {ins: 'zxcv'}], this._("qwer\nasdf", "qwer\nasdf\nzxcv"));
    this.assert_equal([{ins: 'qwer'}, {eql: "asdf\nzxcv"}], this._("asdf\nzxcv", "qwer\nasdf\nzxcv"));
    this.assert_equal([{eql: "qwer"}, {ins: 'asdf'}, {eql: "zxcv"}], this._("qwer\nzxcv", "qwer\nasdf\nzxcv"));
    this.assert_equal([{ins: "qwer\nqwer"}, {eql: 'asdf'}, {ins: "asdf\nzxcv"}], this._('asdf', "qwer\nqwer\nasdf\nasdf\nzxcv"));
    this.assert_equal([{del: 'qwer'}, {eql: 'asdf'}], this._("qwer\nasdf", 'asdf'));
    this.assert_equal([{del: "qwer\wert"}, {eql: "asdf\nsdfg"}], this._("qwer\wert\nasdf\nsdfg", "asdf\nsdfg"));
    this.assert_equal([{del: "qwer\wert"}, {eql: "asdf\nsdfg"}, {del: "zxcv\nxcvb"}], this._("qwer\wert\nasdf\nsdfg\nzxcv\nxcvb", "asdf\nsdfg"));
    this.assert_equal([{del: 'asdf'}, {ins: 'qwer'}], this._('asdf', 'qwer'));
    this.assert_equal([
        {del: 'asdf'},
        {ins: 'qwer'},
        {eql: "zxcv\nxcvb"},
        {del: "poiu"},
        {eql: "lkjh"},
        {ins: "werwer\nwerwer"},
        {eql: "erte\neertr"},
        {del: "wer"},
        {ins: "fg"}
      ],
      this._("asdf\nzxcv\nxcvb\npoiu\nlkjh\nerte\neertr\nwer",
             "qwer\nzxcv\nxcvb\nlkjh\nwerwer\nwerwer\nerte\neertr\nfg")
    );
  },
  test_getting_diff_of_arrays: function() {
    this.assert_equal([
        {del: 1},
        {ins: 2},
        {eql: 3},
        {eql: 4},
        {del: 5},
        {eql: 6},
        {ins: 7},
        {ins: 11},
        {eql: 8},
        {eql: 12},
        {del: 9},
        {ins: 10}
      ],
      this._([1, 3, 4, 5, 6, 8, 12, 9],
             [2, 3, 4, 6, 7, 11, 8, 12, 10])
    );
  },
  test_getting_diff_of_regular_objects: function() {
    this.assert_equal([
        {del: { one: 1,   five:  5, nine:   9 }},
        {ins: { two: 2,   seven: 7, eleven: 11, ten: 10 }},
        {eql: { three: 3, four:  4, six:    6,  eight: 8, twelve: 12 }}
      ],
      this._({
        one:     1,
        three:   3,
        four:    4,
        five:    5,
        six:     6,
        eight:   8,
        twelve: 12,
        nine:    9
      }, {
        two:     2,
        three:   3,
        four:    4,
        six:     6,
        seven:   7,
        eleven: 11,
        eight:   8,
        twelve: 12,
        ten:    10
      })
    );
  }
});
/* ------------------------------------------------------------------- */

TestCaseTest = TestCase.create({
  name: "TestCaseTest",
  test_testcase_creation: function() {
    var Test = TestCase.create({
      test_bla: function() {},
      test_foo: function() {}
    });
    this.assert_not_null(Test);
    this.assert_not_null(Test.prototype);
    this.assert_not_null(Test.prototype.initialize);
  },
  test_instance: function() {
    var Test = TestCase.create({
      test_bla: function() {},
      test_foo: function() {}
    });
    var test = new Test();
    this.assert_equal(2, test.size);
    this.assert_equal(0, test.passed);
    this.assert_equal(0, test.failed);
    this.assert_equal(0, test.assertions);
  },
  test_assertions_auto_catchup: function() {
    var Test = TestCase.create({
      assert_custom: function(value) {
        if (value)
          this.throw_problem("There's the value");
      },
      test_pass: function() {
        this.assert_custom(false);
      },
      test_fail: function() {
        this.assert_custom(true);
      }
    });
    var test = new Test();
    test.reporter = null;
    try {
      test.run();
    } catch(e) {}
    this.assert_equal(2, test.size);
    this.assert_equal(1, test.passed);
    this.assert_equal(1, test.failed);
    this.assert_equal(2, test.assertions);
  }
});
/* ------------------------------------------------------------------- */

TestCase.AssertionsExtenderTest = TestCase.create({
  name: 'TestCase.AssertionsExtenderTest',
  setup: function() {
    this.test = TestCaseUtil.create_class();
    TestCaseUtil.extend_fully_object_and_prototype(this.test, TestCase.AssertionsExtender);
    this.test.prototype._count_assert = function(name) {
      this.counted_assert = name;
    };
  },
  test_add_assertion: function() {
    var called = false;
    this.test.add_assertion('some_fake_test_assert', function() { called = true; this.called = true; });
    this.assert_type_of('function', this.test.prototype.assert_some_fake_test_assert);
    this.assert_type_of('function', this.test.prototype.assertSomeFakeTestAssert);
    this.assert_same(this.test.prototype.assert_some_fake_test_assert, this.test.prototype.assertSomeFakeTestAssert);
    var test = new this.test();
    test.assert_some_fake_test_assert();
    this.assert(called);
    this.assert(test.called);
    this.assert_equal('some_fake_test_assert', test.counted_assert);
    called = false;
    test.called = false;
    test.add_assertion('another_assert', function() { called = true; this.called = true; });
    this.assert_type_of('function', test.assert_another_assert);
    this.assert_type_of('function', test.assertAnotherAssert);
    test.assert_another_assert();
    this.assert(called);
    this.assert(test.called);
    this.assert_equal('another_assert', test.counted_assert);
  },
  test_add_assertions: function() {
    var called = false;
    this.test.add_assertions({
      assert_one: function() { called = true; this.make_called(); },
      assert_two: function() {},
      make_called: function() { this.called = true; }
    });
    this.assert_type_of('function', this.test.prototype.assert_one);
    this.assert_type_of('function', this.test.prototype.assert_two);
    this.assert_type_of('function', this.test.prototype.assertOne);
    this.assert_type_of('function', this.test.prototype.assertTwo);
    this.assert_type_of('function', this.test.prototype.make_called);
    var test = new this.test();
    test.assert_one();
    this.assert(called);
    this.assert(test.called);
    test.add_assertions({
      assert_three: function(value) { called = value; this._make_called(); },
      _make_called: function() { this.called = true; }
    });
    this.assert_type_of('function', test.assert_three);
    this.assert_type_of('function', test._make_called);
    called = false;
    test.called = false;
    test.assert_three(true);
    this.assert(called);
    this.assert(test.called);
  }
});
/* ------------------------------------------------------------------- */

var _AssertionsTestCase = TestCaseUtil.create_class();
TestCaseUtil.extend_fully_object_and_prototype(_AssertionsTestCase, TestCase.Mocking);
TestCaseUtil.extend_fully_object_and_prototype(_AssertionsTestCase, TestCase.AssertionsExtender);
_AssertionsTestCase.add_assertions(TestCase.Assertions);
TestCase.AssertionsTest = TestCase.create({
  name: "TestCase.AssertionsTest",
  setup: function() {
    this.test = new _AssertionsTestCase();
    var $this = this;
    this.test.throw_unexp = function() { return $this._mocked_throw_unexp.apply($this, arguments); };
    this.test.throw_problem = function() { return $this._mocked_throw_problem.apply($this, arguments); };
    this.test.assertions = 0;
  },
  teardown: function() {
    this.thrown_expectation = null;
    this.thrown_value = null;
    this.thrown_problem = null;
  },
  reset: function() {
    this.teardown(); this.setup();
  },
  _mocked_throw_unexp: function(expected, received, message) {
    this.thrown_expectation = expected;
    this.thrown_value = received;
  },
  _mocked_throw_problem: function(problem, message) {
    this.thrown_problem = problem;
  },
  assert_assertion_counted: function() {
    this.assert(this.assertions > 0);
  },
  _run_test: function() {
    var params = TestCaseUtil.to_a(arguments);
    var assertion = params.shift();
    this.test[assertion].apply(this.test, params);
    this.assert_same(
      assertion.replace('assert_', ''),
      this.test.last_assert_name,
      "Checking the last assertion name pointer"
    );
  },
  assert_test_passes: function() {
    this._run_test.apply(this, arguments);
    this.assert_null(this.thrown_expectation);
    this.assert_null(this.thrown_value);
    this.assert_null(this.thrown_problem);
    this.assert_assertion_counted();
  },
  assert_test_throws_unexpect: function() {
    this._run_test.apply(this, arguments);
    this.assert_not_null(this.thrown_expectation);
    this.assert_not_null(this.thrown_value);
    this.assert_assertion_counted();
    this.reset();
  },
  assert_test_throws_problem: function() {
    this._run_test.apply(this, arguments);
    this.assert_not_null(this.thrown_problem);
    this.assert_assertion_counted();
    this.reset();
  },
  test_assert_true_passed: function() {
    this.assert_test_passes('assert_true', true);
    this.assert_test_passes('assert_true', 1);
  },
  test_assert_true_failed: function() {
    this.assert_test_throws_unexpect('assert_true', false);
    this.assert_test_throws_unexpect('assert_true', 0);
    this.assert_test_throws_unexpect('assert_true', '');
  },
  test_assert_false_passed: function() {
    this.assert_test_passes('assert_false', false);
    this.assert_test_passes('assert_false', 0);
    this.assert_test_passes('assert_false', '');
  },
  test_assert_false_failed: function() {
    this.assert_test_throws_unexpect('assert_false', true);
    this.assert_test_throws_unexpect('assert_false', 1);
  },
  test_assert_null_passed: function() {
    this.assert_test_passes('assert_null', null);
  },
  test_assert_null_failed: function() {
    var values = ["bla", 1, 0, [], '', {}, true, false];
    for (var i=0; i < values.length; i++) {
      this.test.assert_null(values[i]);
      this.assert_null(this.thrown_expectation);
      this.assert_equal(values[i], this.thrown_value);
      this.assert_assertion_counted();
    }
  },
  test_assert_not_null_passed: function() {
    var values = ["bla", 1, 0, [], '', {}, true, false]
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_not_null', values[i]);
    }
  },
  test_assert_not_null_failed: function() {
    this.test.assert_not_null(null);
    this.assert_not_null(this.thrown_problem);
    this.assert_null(this.thrown_value);
    this.assert_assertion_counted();
  },
  test_assert_type_of_passed: function() {
    var values = [
      ["object", null], ["boolean", true], ["boolean", false], ["string", ""],
      ["number", 0], ["number", 0.0], ["function", function(){}], ["object", []],
      ["object", {}]
    ];
    for (var i=0; i < values.length; i++) {
       this.assert_test_passes('assert_type_of', values[i][0], values[i][1]);
     }
  },
  test_assert_type_of_failed: function() {
    var values = [
      ["boolean", null], ["string", true], ["string", false], ["function", ""],
      ["function", 0], ["function", 0.0], ["string", function(){}], ["boolean", []],
      ["string", {}]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_unexpect('assert_type_of', values[i][0], values[i][1]);       
    }
  },
  test_assert_instance_of_passed: function() {
    var class1 = function() {};
    var class2 = function() {};
    var var1 = new class1();
    var var2 = new class2();
    this.assert_test_passes('assert_instance_of', class1, var1);
    this.assert_test_passes('assert_instance_of', class2, var2);
  },
  test_assert_instance_of_failed: function() {
    var class1 = function() {};
    var class2 = function() {};
    var var1 = new class1();
    var var2 = new class2();
    this.assert_test_throws_unexpect('assert_instance_of', class1, var2);
    this.assert_test_throws_unexpect('assert_instance_of', class2, var1);
  },
  test_assert_equal_passed: function() {
    var values = [
      [0, 0], ["", ""], [1.0, 1.0], [[1,1], [1,1]], [{t:5}, {t:5}],
      [false, false], [true, true], [null, null]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_equal', values[i][0], values[i][1]);
    }
  },
  test_assert_equal_failed: function() {
    var values = [
      [0, 1], ["a", "b"], [0.1, 1.0], [[0], [1]], [{t:4}, {t:2}],
       [true, false]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_unexpect('assert_equal', values[i][0], values[i][1]);
    }
  },
  test_assert_not_equal_passed: function() {
    var values = [
      [0, 1], ["a", "b"], [0.1, 1.0], [[0], [1]], [{t:4}, {t:2}],
      [true, false], [null, 1]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_not_equal', values[i][0], values[i][1]);
    }
  },
  test_assert_not_equal_failed: function() {
    var values = [
      [0, 0], ["", ""], [1.0, 1.0], [[1,1], [1,1]], [{t:5}, {t:5}],
      [false, false], [true, true], [null, null]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_problem('assert_not_equal', values[i][0], values[i][1]);
    }
  },
  test_assert_same_passed: function() {
    var obj1 = {};
    var obj2 = [];
    var values = [
      [1,1], ["", ""], [0.0, 0.0], [true, true], [false, false],
      [null, null], [obj1, obj1], [obj2, obj2]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_same', values[i][0], values[i][1]);
    }
  },
  test_assert_same_failed: function() {
    var klass = function() {};
    var inst1 = new klass();
    var inst2 = new klass();
    var values = [[[], []], [{}, {}], [inst1, inst2]];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_problem('assert_same', values[i][0], values[i][1]);
    }
  },
  test_assert_not_same_passed: function() {
    var klass = function() {};
    var inst1 = new klass();
    var inst2 = new klass();
    values = [[[], []], [{}, {}], [inst1, inst2]];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_not_same', values[i][0], values[i][1]);
    }
  },
  test_assert_not_same_failed: function() {
    var obj1 = {};
    var obj2 = [];
    var values = [
      [1,1], ["", ""], [0.0, 0.0], [true, true], [false, false],
      [null, null], [obj1, obj1], [obj2, obj2]
    ];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_problem('assert_not_same', values[i][0], values[i][1]);
    }
  },
  matching_tests_regexps: [
    "^[a-z]+@[a-z]+\.[a-z]+$",
    /^[a-z]+@[a-z]+\.[a-z]+$/i,
    new RegExp("^[a-z]+@[a-z]+\.[a-z]+$")
  ],
  test_assert_match_passed: function() {
    var string = "asdf@sdf.sdf";
    for (var i=0; i < this.matching_tests_regexps.length; i++) {
      this.assert_test_passes('assert_match', this.matching_tests_regexps[i], string);
    }
  },
  test_assert_match_failed: function() {
    var string = "asdf-no-dog-sdf.sdf";
    for (var i=0; i < this.matching_tests_regexps.length; i++) {
      this.assert_test_throws_problem('assert_match', this.matching_tests_regexps[i], string);
    }
  },
  test_assert_not_match_passed: function() {
    var string = "asdf-no-dog-sdf.sdf";
    for (var i=0; i < this.matching_tests_regexps.length; i++) {
      this.assert_test_passes('assert_not_match', this.matching_tests_regexps[i], string);
    }
  },
  test_assert_not_match_failed: function() {
    var string = "asdf@sdf.sdf";
    for (var i=0; i < this.matching_tests_regexps.length; i++) {
      this.assert_test_throws_problem('assert_not_match', this.matching_tests_regexps[i], string);
    }
  },
  test_assert_throws_passed: function() {
    this.assert_test_passes('assert_throws', function() { throw "test error"; });
  },
  test_assert_throws_failed: function() {
    this.assert_test_throws_problem('assert_throws', function() {});
  },
  test_assert_throws_with_type_passed: function() {
    this.assert_test_passes('assert_throws', 'string', function() { throw "string throw"; });
    this.assert_test_passes('assert_throws', String, function() { throw "string throw"; });
    this.assert_test_passes('assert_throws', Error, function() { throw new Error("string throw"); });
  },
  test_assert_throws_with_type_failed: function() {
    this.assert_test_throws_unexpect('assert_throws', 'string', function() { throw new Error("string throw"); });
    this.assert_test_throws_unexpect('assert_throws', String, function() { throw new Error("string throw"); });
    this.assert_test_throws_unexpect('assert_throws', Error, function() { throw "string throw"; });
  },
  test_assert_nothing_thrown_passed: function() {
    this.assert_test_passes('assert_nothing_thrown', function() {});
  },
  test_assert_nothing_thrown_failed: function() {
    this.assert_test_throws_problem('assert_nothing_thrown', function() { throw "test error"; });
  },
  test_assert_nothing_thrown_with_type_passed: function() {
    this.assert_test_passes('assert_nothing_thrown', 'string', function() {});
    this.assert_test_passes('assert_nothing_thrown', String, function() {});
    this.assert_test_passes('assert_nothing_thrown', Error, function() {});
    this.assert_test_passes('assert_nothing_thrown', Error, function() { throw "test error"; });
    this.assert_test_passes('assert_nothing_thrown', String, function() { throw new Error('test'); });
    this.assert_test_passes('assert_nothing_thrown', 'string', function() { throw new Error('test'); });
  },
  test_assert_nothing_thrown_with_type_failed: function() {
    this.assert_test_throws_problem('assert_nothing_thrown', 'string', function() { throw 'test'; });
    this.assert_test_throws_problem('assert_nothing_thrown', String, function() { throw 'test'; });
    this.assert_test_throws_problem('assert_nothing_thrown', Error, function() { throw new Error('test'); });
  },
  test_assert_throws_with_scope_object_passed: function() {
    this.__raise_error = function() { throw 'an error'; };
    this.assert_test_passes('assert_throws', function() { this.__raise_error(); }, {scope: this});
    this.assert_test_passes('assert_throws', String, function() { this.__raise_error(); }, {scope: this});
    this.assert_test_passes('assert_throws', String, function() { this.__raise_error(); }, {scope: this}, 'a message');
  },
  test_assert_nothing_thrown_with_scope_object_passed: function() {
    this.__nothing = function() { };
    this.assert_test_passes('assert_nothing_thrown', function() { this.__nothing(); }, {scope: this});
    this.assert_test_passes('assert_nothing_thrown', String, function() { this.__nothing(); }, {scope: this});
    this.assert_test_passes('assert_nothing_thrown', String, function() { this.__nothing(); }, {scope: this}, 'a message');
    var $this = this;
    this.assert_test_passes('assert_nothing_thrown', function() { $this.assert_same($this, this, "[function, scope]"); }, this);
    this.assert_test_passes('assert_nothing_thrown', String, function() { $this.assert_same($this, this, "[type, function, scope]"); }, this);
    this.assert_test_passes('assert_nothing_thrown', String, function() { $this.assert_same($this, this, "[type, function, scope, message]"); }, this, 'a message');
  },
  test_assert_called_failed: function() {
    var obj1 = { foo: function() {} };
    var obj2 = { bar: function() {} };
    this.assert_test_throws_problem('assert_called', obj1, 'foo', function() {});
    this.assert_test_throws_problem('assert_called', [obj1, 'foo'], function() {});
    this.assert_test_throws_problem('assert_called', [[obj1, 'foo']], function() {});
    this.assert_test_throws_problem('assert_called', [[obj1, 'foo'], [obj2, 'bar']], function() { obj1.foo() });
    this.assert_test_throws_problem('assert_called', obj1, 'foo', function() {}, {scope: this}, 'a messsage');
  },
  test_assert_called_passed: function() {
    var obj1 = { foo: function() {} };
    var obj2 = { bar: function() {} };
    var call = function() { obj1.foo(); obj2.bar(); };
    this.assert_test_passes('assert_called', obj1, 'foo', call);
    this.assert_test_passes('assert_called', [obj1, 'foo'], call);
    this.assert_test_passes('assert_called', [[obj1, 'foo']], call);
    this.assert_test_passes('assert_called', [[obj1, 'foo'], [obj2, 'bar']], call);
    this.assert_test_passes('assert_called', obj1, 'foo', call, {scope: this}, 'a messsage');
    var $this = this;
    this.assert_test_passes('assert_called', obj1, 'foo', function() { obj1.foo(); $this.assert_same($this, this); }, this);
    this.assert_test_passes('assert_called', obj1, 'foo', function() { obj1.foo(); $this.assert_same($this, this); }, this, 'message');
  },
  test_assert_not_called_failed: function() {
    var obj1 = { foo: function() {} };
    var obj2 = { bar: function() {} };
    var call = function() { obj1.foo(); };
    this.assert_test_throws_problem('assert_not_called', obj1, 'foo', call);
    this.assert_test_throws_problem('assert_not_called', [obj1, 'foo'], call);
    this.assert_test_throws_problem('assert_not_called', [[obj1, 'foo']], call);
    this.assert_test_throws_problem('assert_not_called', [[obj1, 'foo'], [obj2, 'bar']], call);
    this.assert_test_throws_problem('assert_not_called', obj1, 'foo', call, {scope: this}, 'a messsage');
  },
  test_assert_not_called_passed: function() {
    var obj1 = { foo: function() {} };
    var obj2 = { bar: function() {} };
    var call = function() {  };
    this.assert_test_passes('assert_not_called', obj1, 'foo', call);
    this.assert_test_passes('assert_not_called', [obj1, 'foo'], call);
    this.assert_test_passes('assert_not_called', [[obj1, 'foo']], call);
    this.assert_test_passes('assert_not_called', [[obj1, 'foo'], [obj2, 'bar']], call);
    this.assert_test_passes('assert_not_called', obj1, 'foo', call, {scope: this}, 'a messsage');
  },
  test_assert_exists_passed: function() {
  },
  test_assert_exists_failed: function() {
  },
  test_assert_not_exists_passed: function() {
  },
  test_assert_not_exists_failed: function() {
  },
  get_test_element_structure: function() {
    var el1 = document.createElement('div');
    var el2 = document.createElement('span');
    var el3 = document.createElement('ul');
    el1.className = 'test-div';
    el2.className = 'test-span';
    el3.className = 'test-ul';
    document.body.appendChild(el1); 
    el1.appendChild(el2);
    el2.appendChild(el3);
    return el1;
  },
  run_as_child_test: function(test) {
    var element = this.get_test_element_structure();
    test.apply(this, [element]);
    element.parentNode.removeChild(element);
  },
  test_assert_has_child_passed: function() {
    this.run_as_child_test(function(element) {
      var rules = ['span.test-span', 'ul.test-ul', 'span', 'ul'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_passes('assert_has_child', element, rules[i]);
      }
    });
  },
  test_assert_has_child_failed: function() {
    this.run_as_child_test(function(element) {
      var rules = ['div.test-span', 'td.test-ul', 'span.test-ul', 'ul.test-span', 'div', 'td'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_throws_problem('assert_has_child', element, rules[i]);
      }
    });
  },
  test_assert_has_no_child_passed: function() {
    this.run_as_child_test(function(element) {
      var rules = ['div.test-span', 'td.test-ul', 'span.test-ul', 'ul.test-span', 'div', 'td'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_passes('assert_has_no_child', element, rules[i]);
      }
    });
  },
  test_assert_has_no_child_failed: function() {
    this.run_as_child_test(function(element) {
      var rules = ['span.test-span', 'ul.test-ul', 'span', 'ul'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_throws_problem('assert_has_no_child', element, rules[i]);
      }
    });
  },
  run_as_parent_test: function(test) {
    var element = this.get_test_element_structure();
    test.apply(this, [TestCaseUtil.Element.down(element, 'ul')]);
    element.parentNode.removeChild(element);
  },
  test_assert_has_parent_passed: function() {
    this.run_as_parent_test(function(element) {
      var rules = ['div', 'span', 'div.test-div', 'span.test-span'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_passes('assert_has_parent', element, rules[i]);
      }
    });
  },
  test_assert_has_parent_failed: function() {
    this.run_as_parent_test(function(element) {
      var rules = ['td', 'table', 'div.test-span', 'span.test-div'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_throws_problem('assert_has_parent', element, rules[i]);
      }
    });
  },
  test_assert_has_no_parent_passed: function() {
    this.run_as_parent_test(function(element) {
      var rules = ['td', 'table', 'div.test-span', 'span.test-div'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_passes('assert_has_no_parent', element, rules[i]);
      }
    });
  },
  test_assert_has_no_parent_failed: function() {
    this.run_as_parent_test(function(element) {
      var rules = ['div', 'span', 'div.test-div', 'span.test-span'];
      for (var i=0; i < rules.length; i++) {
        this.assert_test_throws_problem('assert_has_no_parent', element, rules[i]);
      }
    });
  },
  test_assert_visible_passed: function() {
    var element = document.createElement('div');
    this.assert_test_passes('assert_visible', element);
    element.style.display = 'inline';
    this.assert_test_passes('assert_visible', element);
  },
  test_assert_visible_failed: function() {
    var element = document.createElement('div');
    element.style.display = 'none';
    this.assert_test_throws_problem('assert_visible', element);
    element.style.display = 'inline';
    element.style.visibility = 'hidden';
    this.assert_test_throws_problem('assert_visible', element);
  },
  test_assert_hidden_passed: function() {
    var element = document.createElement('div');
    element.style.display = 'none';
    this.assert_test_passes('assert_hidden', element);
    element.style.display = 'inline';
    element.style.visibility = 'hidden';
    this.assert_test_passes('assert_hidden', element);
  },
  test_assert_hidden_failed: function() {
    var element = document.createElement('div');
    this.assert_test_throws_problem('assert_hidden', element);
    element.style.display = 'inline';
    this.assert_test_throws_problem('assert_hidden', element);
  },
  test_assert_has_class_name_passed: function() {
    var element = document.createElement('div');
    element.className = 'one-class another-class third-class';
    var values = ['one-class', 'another-class', 'third-class'];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_has_class_name', element, values[i]);
    }
  },
  test_assert_has_class_name_failed: function() {
    var element = document.createElement('div');
    element.className = 'one-class another-class third-class';
    var values = ['strange-class', 'nonexisting-class', 'weird-class'];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_problem('assert_has_class_name', element, values[i]);
    }
  },
  test_assert_has_no_class_name_passed: function() {
    var element = document.createElement('div');
    element.className = 'one-class another-class third-class';
    var values = ['strange-class', 'nonexisting-class', 'weird-class'];
    for (var i=0; i < values.length; i++) {
      this.assert_test_passes('assert_has_no_class_name', element, values[i]);
    }
  },
  test_assert_has_no_class_name_failed: function() {
    var element = document.createElement('div');
    element.className = 'one-class another-class third-class';
    var values = ['one-class', 'another-class', 'third-class'];
    for (var i=0; i < values.length; i++) {
      this.assert_test_throws_problem('assert_has_no_class_name', element, values[i]);
    }
  },
  test_assert_style_passed: function() {
    var element = document.createElement('div');
    element.style.fontSize = '8pt';
    this.assert_test_passes('assert_style', element, { fontSize: '8pt' });
    element.style.display = 'none';
    element.style.width = '100px';
    element.style.height = '200px';
    element.style.backgroundColor = 'pink';
    this.assert_test_passes('assert_style', element, {
      backgroundColor: 'pink', height: '200px', display: 'none'
    });
  },
  test_assert_style_failed: function() {
    var element = document.createElement('div');
    element.style.fontSize = '8pt';
    this.assert_test_throws_unexpect('assert_style', element, { fontSize: '9pt' });
  },
  test_assert_has_attribute_passed: function() {
    var element = document.createElement('div');
    element.setAttribute('name', 'asdf');
    this.assert_test_passes('assert_has_attribute', element, 'name');
  },
  test_assert_has_attribute_failed: function() {
    var element = document.createElement('div');
    this.assert_test_throws_problem('assert_has_attribute', element, 'name');
  },
  test_assert_has_no_attribute_passed: function() {
    var element = document.createElement('div');
    this.assert_test_passes('assert_has_no_attribute', element, 'name');
  },
  test_assert_has_no_attribute_failed: function() {
    var element = document.createElement('div');
    element.setAttribute('name', 'asdf');
    this.assert_test_throws_problem('assert_has_no_attribute', element, 'name');
  }
});
/* ------------------------------------------------------------------- */

TestCase.FiresTest = TestCase.create({
  name: "TestCase.FiresTest",
  setup: function() {
    this.test = TestCase.Fires;
    this.element = document.createElement('div');
    document.body.appendChild(this.element);
    this.received_event = null;
    var $this = this;
    this.callback = function(event) {
      $this.received_event = event;
    };
  },
  teardown: function() {
    this.element.parentNode.removeChild(this.element);
  },
  assert_fired: function(eventName, options) {
    this.assert_type_of('object', this.received_event);
    this.assert_equal(eventName,
    this.received_event.eventName);
    this.assert_same(this.element, TestCaseUtil.Event.element(this.received_event));
    if (options) {
      for (key in options) {
        if (TestCaseUtil.Array.include(['pointerX', 'pointerY'], key))
          var value = TestCaseUtil.Event[key](this.received_event);
        else
          var value = this.received_event[key];
        this.assert_equal((key=='button' && options[key]==1 && 
                          (TestCaseUtil.Browser.IE || TestCaseUtil.Browser.Konqueror)) ? 4 : options[key],
          value, "Checking the event."+key+" parameter");
      }
    }
  },
  wire_event: function(event_name) {
    TestCaseUtil.Event.observe(this.element, event_name, this.callback);
  },
  test_fire_mouse_event: function() {
    this.wire_event('click');
    this.test.fire_mouse_event(this.element, 'click');
    this.assert_fired('click');
  },
  test_fire_mouse_event_with_options: function() {
    this.wire_event('click');
    this.test.fire_mouse_event(this.element, 'click', {
      pointerX: 10, pointerY: 10,
      button: 2, shiftKey: true
    });
    this.assert_fired('click', {
      pointerX: 10, pointerY: 10,
      button: 2, shiftKey: true
    });
  },
  test_fire_click: function() {
    this.wire_event('click');
    this.test.fire_click(this.element);
    this.assert_fired('click');
  },
  test_fire_click_with_options: function() {
    this.wire_event('click');
    this.test.fire_click(this.element, { altKey: true });
    this.assert_fired('click', { altKey: true});
  },
  test_fire_middle_click: function() {
    if (!TestCaseUtil.Browser.IE) { 
      this.wire_event('middleclick');
      this.test.fire_middle_click(this.element);
      this.assert_fired('middleclick', { button: 1 });
    }
  },
  test_fire_middle_click_with_options: function() {
    if (!TestCaseUtil.Browser.IE) { 
      this.wire_event('middleclick');
      this.test.fire_middle_click(this.element, { ctrlKey: true});
      this.assert_fired('middleclick', { ctrlKey: true});
    }
  },
  test_fire_right_click: function() {
    this.wire_event(TestCaseUtil.Browser.IE ? 'contextmenu' : 'rightclick');
    this.test.fire_right_click(this.element);
    this.assert_fired(TestCaseUtil.Browser.IE ? 'contextmenu' : 'rightclick', { button: 2});
  },
  test_fire_double_click: function() {
    this.wire_event('dblclick');
    this.test.fire_double_click(this.element);
    this.assert_fired('dblclick');
  },
  test_fire_mouse_down: function() {
    this.wire_event('mousedown');
    this.test.fire_mouse_down(this.element);
    this.assert_fired('mousedown');
  },
  test_fire_mouse_up: function() {
    this.wire_event('mouseup');
    this.test.fire_mouse_up(this.element);
    this.assert_fired('mouseup');
  },
  test_fire_mouse_over: function() {
    this.wire_event('mouseover');
    this.test.fire_mouse_over(this.element);
    this.assert_fired('mouseover');
  },
  test_fire_mouse_out: function() {
    this.wire_event('mouseout');
    this.test.fire_mouse_out(this.element);
    this.assert_fired('mouseout');
  },
  test_fire_mouse_move: function() {
    this.wire_event('mousemove');
    this.test.fire_mouse_move(this.element);
    this.assert_fired('mousemove');
  },
  test_fire_key_event: function() {
    this.wire_event('keypress');
    this.test.fire_key_event(this.element, 'keypress', TestCaseUtil.Event.KEY_UP);
    if (navigator.userAgent.indexOf("KHTML")==-1)
      this.assert_fired('keypress', {keyCode: TestCaseUtil.Event.KEY_UP});
    else
      this.assert_fired('keypress');
  },
  test_fire_key_press: function() {
    this.wire_event('keypress');
    this.test.fire_key_press(this.element, TestCaseUtil.Event.KEY_UP);
    this.assert_fired('keypress');
  },
  test_fire_key_down: function() {
    this.wire_event('keydown');
    this.test.fire_key_down(this.element, TestCaseUtil.Event.KEY_UP);
    this.assert_fired('keydown');
  },
  test_fire_key_up: function() {
    this.wire_event('keyup');
    this.test.fire_key_up(this.element, TestCaseUtil.Event.KEY_UP);
    this.assert_fired('keyup');
  }
});
/* ------------------------------------------------------------------- */

_MessagingTestCase = TestCaseUtil.create_class();
TestCaseUtil.extend(
  TestCaseUtil.extend(_MessagingTestCase.prototype, {
    initialize: function() {}
  }), TestCase.Messaging
);
TestCase.MessagingTest = TestCase.create({
  name: "TestCase.MessagingTest",
  setup: function() {
    this.test = new _MessagingTestCase();
    this.test.assert_test = function() {};
    this.test.last_assert_name = 'test';
  },
  test_fail: function() {
    try {
      this.test.fail('test fail');
      this.fail("Failure doesn't work");
    } catch (e) {
      this.assert_instance_of(TestCase.Exception, e);
      this.assert_same(this.test, e.test);
      this.assert_same(this.test.assert_test, e.assertion);
      this.assert_equal('test fail', e.message);
      this.assert_equal('test fail', this.test.manual_failure);
    }
  },
  test_throw_problem: function() {
    try {
      this.test.throw_problem('test problem', 'test message');
      this.fail("Apparently no throw");
    } catch (e) {
      this.assert_instance_of(TestCase.ProblemException, e);
      this.assert_same(this.test, e.test);
      this.assert_same(this.test.assert_test, e.assertion);
      this.assert_equal('test problem', e.problem);
      this.assert_equal('test message', e.message);
    }
  },
  test_throw_unexp: function() {
    try {
      this.test.throw_unexp('expected value', 'received value', 'test message');
      this.fail("Apparently no throw");
    } catch (e) {
      this.assert_instance_of(TestCase.WrongValueException, e);
      this.assert_same(this.test, e.test);
      this.assert_same(this.test.assert_test, e.assertion);
      this.assert_equal('expected value', e.expected);
      this.assert_equal('received value', e.received);
      this.assert_equal('test message', e.message);
    }
  }
});
/* ------------------------------------------------------------------- */

_MockingTestCase = TestCaseUtil.create_class();
TestCaseUtil.extend(
  TestCaseUtil.extend(_MockingTestCase.prototype, {
    initialize: function() {}
  }), TestCase.Mocking
);
TestCase.MockingTest = TestCase.create({
  name: "TestCase.MockingTest",
  setup: function() {
    this.test = new _MockingTestCase();
  },
  test_object_mocking_up: function() {
    var obj1 = {
      name: "name",
      getName: function() { return this.name; },
      getBla: function() { return 'bla'; }
    };
    var obj2 = {
      getName: function() { return 'no-name'; }
    };
    this.assert_equal("name", obj1.getName());
    this.assert_equal("bla", obj1.getBla());
    this.assert_equal("no-name", obj2.getName());
    this.test.mock(obj1, 'getName', function() {
      return "Mocked "+this.name;
    });
    this.assert_equal("Mocked name", obj1.getName());
    this.assert_equal("bla", obj1.getBla());
    this.assert_equal("no-name", obj2.getName());
    this.test.mock(obj1, 'getBla', function() {
      return "No blas anymore";
    });
    this.assert_equal("Mocked name", obj1.getName());
    this.assert_equal("No blas anymore", obj1.getBla());
    this.assert_equal("no-name", obj2.getName());
    this.test.mock(obj2, 'getName', function() {
      return "Some name";
    });
    this.assert_equal("Mocked name", obj1.getName());
    this.assert_equal("No blas anymore", obj1.getBla());
    this.assert_equal("Some name", obj2.getName());
    this.test.undo_mock(obj1, 'getName');
    this.test.undo_mock(obj1, 'getBla');
    this.test.undo_mock(obj2, 'getName');
    this.assert_equal("name", obj1.getName());
    this.assert_equal("bla", obj1.getBla());
    this.assert_equal("no-name", obj2.getName());
  },
  test_class_methods_mocking_up: function() {
    var class1 = TestCaseUtil.create_class();
    TestCaseUtil.extend(class1.prototype, {
      name: "name",
      initialize: function() {},
      getName: function() {
        return this.name;
      },
      getBla: function() {
        return 'bla';
      }
    });
    var class2 = TestCaseUtil.create_class();
    TestCaseUtil.extend(class2.prototype, {
      initialize: function() {},
      getName: function() {
        return "noname";
      }
    });
    var obj11 = new class1();
    var obj12 = new class1();
    var obj21 = new class2();
    var obj22 = new class2();
    this.assert_equal("name", obj11.getName());
    this.assert_equal("name", obj12.getName());
    this.assert_equal("noname", obj21.getName());
    this.assert_equal("noname", obj22.getName());
    this.test.mock(obj11, 'getName', function() {
      return "mocked "+this.name;
    });
    this.assert_equal("mocked name", obj11.getName());
    this.assert_equal("name", obj12.getName());
    this.assert_equal("noname", obj21.getName());
    this.assert_equal("noname", obj22.getName());
    this.test.mock(class2.prototype, 'getName', function() {
      return "classlevel mocked noname";
    });
    this.assert_equal("mocked name", obj11.getName());
    this.assert_equal("name", obj12.getName());
    this.assert_equal("classlevel mocked noname", obj21.getName());
    this.assert_equal("classlevel mocked noname", obj22.getName());
    this.test.mock(class1.prototype, 'getName', function() {
      return "submocked "+this.name;
    });
    this.assert_equal("mocked name", obj11.getName());
    this.assert_equal("submocked name", obj12.getName());
    this.assert_equal("classlevel mocked noname", obj21.getName());
    this.assert_equal("classlevel mocked noname", obj22.getName());
    this.test.undo_mock(obj11, 'getName');
    this.assert_equal("name", obj11.getName());
    this.assert_equal("submocked name", obj12.getName());
    this.assert_equal("classlevel mocked noname", obj21.getName());
    this.assert_equal("classlevel mocked noname", obj22.getName());
    this.test.undo_mock(class1.prototype, 'getName');
    this.assert_equal("name", obj11.getName());
    this.assert_equal("name", obj12.getName());
    this.assert_equal("classlevel mocked noname", obj21.getName());
    this.assert_equal("classlevel mocked noname", obj22.getName());
    this.test.undo_mock(class2.prototype, 'getName');
    this.assert_equal("name", obj11.getName());
    this.assert_equal("name", obj12.getName());
    this.assert_equal("noname", obj21.getName());
    this.assert_equal("noname", obj22.getName());
  },
  test_with_mock: function() {
    var obj = {
      bla: function() { return 'bla'; }
    };
    this.assert_called(
      [[this.test, 'mock'],
       [this.test, 'undo_mock']],
      function() {
        this.test.with_mock(obj, 'bla', function() { return 'asdf'; },
          function() { this.assert_equal('asdf', obj.bla()); },
          this
        );
      }, { scope: this }
    );
  },
  _foreach_lib: function(func) {
    for (var i=0; i < TestCase.Mocking._mockable_libs.length; i++) {
      func.apply(this, [TestCase.Mocking._mockable_libs[i]]);
    }
  },
  before_all: function() {
    this._foreach_lib(function(lib_name) {
      if (self[lib_name]) {
        this['__'+lib_name] = self[lib_name];
        self[lib_name] = null;
        if (!TestCaseUtil.Browser.IE) { delete(self[lib_name]); }
      }
    });
  },
  after_all: function() {
    this._foreach_lib(function(lib_name) {
      if (this['__'+lib_name]) {
        self[lib_name] = this['__'+lib_name];
      }
    });
  },
  assert_mock_method_bypassable: function(lib_name, method_name) {
    self[lib_name] = {};
    try {
      this.assert_called(this.test[lib_name], method_name, function() {
        this.test[method_name]();
      }, {scope: this}, "assert "+lib_name+"."+method_name+" called");
    } finally {
      self[lib_name] = null;
      if (!TestCaseUtil.Browser.IE) { delete(self[lib_name]); }
    }
  },
  assert_mock_method_skippable: function(lib_name, method_name) { return;
    self[lib_name] = null;
    if (!TestCaseUtil.Browser.IE) { delete(self[lib_name]); }
    this.assert_not_called(this.test[lib_name], method_name, function() {
      this.test[method_name]();
    }, {scope: this}, "assert "+lib_name+"."+method_name+" called");
  },
  test_effects_mock_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_bypassable(lib_name, 'mock_effects');
    });
  },
  test_effects_mock_not_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_skippable(lib_name, 'mock_effects');
    });
  },
  test_undo_effects_mock_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_bypassable(lib_name, 'undo_effects_mock');
    });
  },
  test_undo_effects_mock_not_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_skippable(lib_name, 'undo_effects_mock');
    });
  },
  test_with_effects_mock_call: function() {
    this.assert_called(
      [[this.test, 'mock_effects'],
       [this.test, 'undo_effects_mock']],
      function() {
        this.test.with_effects_mock(function() { });
      },
      { scope: this }
    );
  },
  test_ajax_mock_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_bypassable(lib_name, 'mock_ajax');
    });
  },
  test_ajax_mock_not_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_skippable(lib_name, 'mock_ajax');
    });
  },
  test_undo_ajax_mock_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_bypassable(lib_name, 'undo_ajax_mock');
    });
  },
  test_undo_ajax_mock_not_called: function() {
    this._foreach_lib(function(lib_name) {
      this.assert_mock_method_skippable(lib_name, 'undo_ajax_mock');
    });
  },
  test_with_ajax_mock_call: function() {
    this.assert_called(
      [[this.test, 'mock_ajax'],
       [this.test, 'undo_ajax_mock']],
      function() {
        this.test.with_ajax_mock({}, function() { });
      },
      { scope: this }
    );
  },
  test_raw_ajax_mock: function() {
    if (TestCaseUtil.Browser.Konqueror) { return false; }; 
    this._foreach_lib(function(lib_name) {
      self[lib_name] = null;
      if (!TestCaseUtil.Browser.IE) { delete(self[lib_name]); }
    });
    try {
      this.test.mock_ajax({status: 123, text: 'fake text'});
      var request = TestCaseUtil.Browser.IE ? new ActiveXObject('Msxml2.XMLHTTP') : new XMLHttpRequest();
      this.assert_instance_of(TestCase.Mocking.FakeXMLHttpRequest, request);
      this.assert_not_equal('undefined', typeof(request.fakeData));
      this.assert_equal(123, request.fakeData.status);
      this.assert_equal('fake text', request.fakeData.text);
    } finally {
      this.test.undo_ajax_mock();
    }
  }
});
/* ------------------------------------------------------------------- */

TestCase.Mocking.FakeXMLHttpRequestTest = TestCase.create({
  name: "TestCase.Mocking.FakeXMLHttpRequestTest",
  setup: function() {
    this.xhr = new TestCase.Mocking.FakeXMLHttpRequest();
  },
  test_default_instance: function() {
    this.assert_equal(200, this.xhr.fakeData.status);
    this.assert_equal('', this.xhr.fakeData.text);
    this.assert_equal(0, this.xhr.readyState);
  },
  test_instance_with_options: function() {
    this.xhr = new TestCase.Mocking.FakeXMLHttpRequest({status: 404, text: 'Not Found'});
    this.assert_equal(404, this.xhr.fakeData.status);
    this.assert_equal('Not Found', this.xhr.fakeData.text);
  },
  test_open: function() {
    this.xhr.open('get', 'something');
    this.assert_equal(1, this.xhr.readyState);
  },
  test_send: function() {
    var xhr = this.xhr;
    var ready_calls = [];
    this.xhr.onreadystatechange = function() {
      ready_calls.push(xhr.readyState);
    };
    xhr.send('bla');
    this.assert_equal([2, 3, 4], ready_calls);
  }
});
/* ------------------------------------------------------------------- */

TestCase.Mocking.PrototypeTest = TestCase.create({
  name: "TestCase.Mocking.PrototypeTest",
  effects: ['Fade', 'SlideUp', 'BlindUp', 'SwitchOff', 'Appear', 'SlideDown', 'BlindDown', 'Grow'],
  before_all: function() {
    this._ = TestCase.Mocking.Prototype;
    if (typeof Effect != 'undefined')
      this._effect = Effect;
    if (typeof Element != 'undefined')
      this._element = Element;
    self.Effect = {};
    for (var i=0; i < this.effects.length; i++) {
      self.Effect[this.effects[i]] = function() {}
    }
    self.Element = self.Element || {};
    if (!self.Element['hide'])
      self.Element.hide = function(element) { element.style.display = 'none';};
    if (!self.Element['show'])
      self.Element.show = function(element) { element.style.display = ''; };
  },
  after_all: function() {
    if (typeof this._effect != 'undefined')
      self.Effect = this._effect;
    if (typeof this._element != 'undefined')
      self.Element = this._element;
  },
  setup: function() {
    this._.mock_effects();
  },
  teardown: function() {
    this._.undo_effects_mock();
  },
  test_mocking: function() {
    for (var i=0; i < this.effects.length; i++) {
      this.assert(TestCase._has_mock_for(self.Effect, this.effects[i]));
    }
  },
  test_mocking_undo: function() {
    this._.undo_effects_mock();
    for (var i=0; i < this.effects.length; i++) {
      this.assert_false(TestCase._has_mock_for(self.Effect, this.effects[i]));
    }
  },
  test_effect_applying: function() {
    var element = document.createElement('div');
    element.style.display = 'none';
    var callbacked = false;
    Effect.Appear(element, { afterFinish: function() { callbacked = true; } });
    this.assert_visible(element);
    this.assert(callbacked);
    callbacked = false;
    Effect.Fade(element, { afterFinish: function() { callbacked = true; } });
    this.assert_hidden(element);
    this.assert(callbacked);
  },
  test_ajax_mocking: function() {
    if (typeof Ajax != 'undefined') {
      var _Ajax = Ajax;
    }
    self.Ajax = {
      getTransport: function() {}
    };
    try {
      this._.mock_ajax();
      this.assert(TestCase._has_mock_for(self.Ajax, 'getTransport'));
      this.assert_instance_of(TestCase.Mocking.FakeXMLHttpRequest, Ajax.getTransport());
    } finally {
      this._.undo_ajax_mock();
      if (typeof _Ajax != 'undefined') {
        self.Ajax = _Ajax;
      }
    }
  }
});
/* ------------------------------------------------------------------- */

TestCase.Mocking.MooToolsTest = TestCase.create({
  name: "TestCase.Mocking.MooToolsTest",
  before_all: function() {
    this._ = TestCase.Mocking.MooTools;
    if (self['Fx']) {
      this['__oFx'] = self['Fx'];
      self['Fx'] = null;
      delete(self['Fx']);
    }
    self.Fx = TestCaseUtil.create_class({
      initialize: function(element, options) {
        this.element = element;
        this.onStart = options.onStart;
        this.onComplete = options.onComplete;
      },
      set: function() {},
      start: function() {}
    });
    self.Fx.Tween = TestCaseUtil.create_class(self.Fx, {});
    self.Fx.Morph = TestCaseUtil.create_class(self.Fx, {});
    this._.mock_effects();
  },
  after_all: function() {
    this._.undo_effects_mock();
    if (this['__oFx']) {
      self['Fx'] = this['__oFx'];
    }
  },
  test_fx_tween_mocking_up: function() {
    var element = document.createElement('div');
    var onstart_callbacked = false;
    var oncomplete_callbacked = false;
    var fx = new Fx.Tween(element, {
      onStart: function() { onstart_callbacked = true; },
      onComplete: function() { oncomplete_callbacked = true; }
    });
    this.assert_called(fx, 'set', function() {
      fx.start('background', 'pink');
    });
    this.assert(onstart_callbacked);
    this.assert(oncomplete_callbacked);
  },
  test_fx_morph_mocking_up: function() {
    var element = document.createElement('div');
    var onstart_callbacked = false;
    var oncomplete_callbacked = false;
    var fx = new Fx.Morph(element, {
      onStart: function() { onstart_callbacked = true; },
      onComplete: function() { oncomplete_callbacked = true; }
    });
    this.assert_called(fx, 'set', function() {
      fx.start({'background': ['blue', 'pink']});
    });
    this.assert(onstart_callbacked);
    this.assert(oncomplete_callbacked);
  },
  test_ajax_mocking: function() {
    if (typeof Request != 'undefined') {
      var _Request = Request;
    }
    self.Request = TestCaseUtil.create_class({
      initialize: function(options) {
        this.options = options;
      }
    });
    try {
      this._.mock_ajax({status: 1234, text: 'test'});
      var r = new Request('self options');
      this.assert_equal('self options', r.options);
      this.assert_equal(1234, r.xhr.fakeData.status);
      this.assert_equal('test', r.xhr.fakeData.text);
    } finally {
      this._.undo_ajax_mock();
      if (typeof _Request != 'undefined') {
        self.Request = _Request;
      }
    }
  }
});
/* ------------------------------------------------------------------- */

TestCase.Mocking.jQueryTest = TestCase.create({
  name: "TestCase.Mocking.jQueryTest",
  test_foo: function() {
  }
});
/* ------------------------------------------------------------------- */

_StarterTestCase = TestCaseUtil.create_class();
TestCaseUtil.extend(_StarterTestCase.prototype, {
  initialize: function() {}, test_foo: function() {}
});
TestCaseUtil.extend(_StarterTestCase.prototype, TestCase.Starter);
TestCaseUtil.extend(_StarterTestCase, TestCase.Starter);
TestCase.StarterTest = TestCase.create({
  name: "TestCase.StarterTest",
  setup: function() {
    this.test = new _StarterTestCase();
    this.test.passed = 0;
    this.test.failed = 0;
    this.test.assertions = 0;
    this.TestClass = TestCaseUtil.create_class();
    TestCaseUtil.extend(this.TestClass, _StarterTestCase);
    this.TestClass.prototype = new _StarterTestCase();
  },
  mockup_reporter: function() {
    this.mocked_reporter = this.test.reporter = this.TestClass.reporter = {
      register: function(test) {
        this.registered_test = test;
      },
      test_started: function(test_name) {
        this.started_test_name = test_name;
      },
      test_passed: function(test_name) {
        this.passed_test_name = test_name;
      },
      test_failed: function(test_name, error, assertion_num) {
        this.failed_test_name = test_name;
        this.failed_test_error = error;
        this.failed_assertion_num = assertion_num;
      }
    };
  },
  test_setup_invoked: function() {
    var is_invoked = false;
    this.test.setup = function() { is_invoked = true; };
    this.test.run();
    this.assert(is_invoked);
  },
  test_setup_invoked_on_class_run: function() {
    var is_invoked = false;
    this.TestClass.prototype.setUp = function() { is_invoked = true; }
    this.TestClass.run();
    this.assert(is_invoked);
  },
  test_setup_invoked_in_context_of_test: function() {
    this.test.setup = function() { this._setup_invoked = true; };
    this.test._setup_invoked = false;
    this.test.run();
    this.assert(this.test._setup_invoked);
  },
  test_teardown_invoked: function() {
    var is_invoked = false;
    this.test.teardown = function() { is_invoked = true; }
    this.test.run();
    this.assert(is_invoked);
  },
  test_teardown_invoked_on_class_run: function() {
    var is_invoked = false;
    this.TestClass.prototype.tearDown = function() { is_invoked = true; }
    this.TestClass.run();
    this.assert(is_invoked);
  },
  test_teardown_invoked_in_context_of_test: function() {
    this.test.teardown = function() { this._teardown_is_invoked = true; };
    this.test._teardown_is_invoked = false;
    this.test.run();
    this.assert(this.test._teardown_is_invoked);
  },
  test_before_all_invoked: function() {
    this.test.before_all = function() { this._called = true; };
    this.test._called = false;
    this.test.run();
    this.assert(this.test._called);
  },
  test_beforeAll_invoked: function() {
    this.test.beforeAll = function() { this._called = true; };
    this.test._called = false;
    this.test.run();
    this.assert(this.test._called);
  },
  test_after_all_invoked: function() {
    this.test.after_all = function() { this._called = true; };
    this.test._called = false;
    this.test.run();
    this.assert(this.test._called);
  },
  test_afterAll_invoked: function() {
    this.test.afterAll = function() { this._called = true; };
    this.test._called = false;
    this.test.run();
    this.assert(this.test._called);
  },
  test_in_reporter_registration: function() {
    this.mockup_reporter();
    this.test.run();
    this.assert_not_null(this.mocked_reporter.registered_test);
  },
  test_in_reporter_registration_on_class_run: function() {
    this.mockup_reporter();
    this.TestClass.run();
    this.assert_not_null(this.mocked_reporter.registered_test);
  },
  test_test_started_report: function() {
    this.mockup_reporter();
    this.test.run();
    this.assert_equal('test_foo', this.mocked_reporter.started_test_name);
  },
  test_test_started_report_on_class_run: function() {
    this.mockup_reporter();
    this.TestClass.run();
    this.assert_equal('test_foo', this.mocked_reporter.started_test_name);
  },
  test_test_passed_report: function() {
    this.mockup_reporter();
    this.test.run();
    this.assert_equal('test_foo', this.mocked_reporter.passed_test_name);
  },
  test_test_passed_report_on_class_run: function() {
    this.mockup_reporter();
    this.TestClass.run();
    this.assert_equal('test_foo', this.mocked_reporter.passed_test_name);
  },
  test_test_failed_report: function() {
    this.mockup_reporter();
    this.test.test_foo = function() { throw new TestCase.Exception('test error'); };
    this.test.run();
    this.assert_equal('test_foo', this.mocked_reporter.failed_test_name);
    this.assert_instance_of(TestCase.Exception, this.mocked_reporter.failed_test_error);
    this.assert_equal(1, this.mocked_reporter.failed_assertion_num);
  },
  test_only_tests_involved: function() {
    var involved_methods = [];
    this.test.test_foo = function() { involved_methods.push('test_foo'); };
    this.test.foo_test = function() { involved_methods.push('foo_test'); };
    this.test.run();
    this.assert(TestCaseUtil.Array.include(involved_methods, 'test_foo'));
    this.assert(!TestCaseUtil.Array.include(involved_methods, 'foo_test'));
  },
  test_counters: function() {
    this.mockup_reporter();
    this.test.test_foo = function() { throw new TestCase.Exception('test error'); };
    this.test.test_bla = function() {  };
    this.test.run();
    this.assert_equal(1, this.test.passed);
    if (navigator.userAgent.indexOf('Konqueror')==-1) 
      this.assert_equal(1, this.test.failed);
  },
  test_common_errors_passing_through: function() {
    this.mockup_reporter();
    this.test.test_foo = function() { throw 'test error'; }
    var $this = this;
    this.assert_throws(function() {
      $this.test.run();
    });
  }
});
/* ------------------------------------------------------------------- */

_SuiteMockTest1 = TestCase.create({ test_foo: function() { } });
_SuiteMockTest2 = TestCase.create({ test_foo: function() { } });
_SuiteMockTest1.run = function() { _SuiteMockTest1.runned = true; };
_SuiteMockTest2.run = function() { _SuiteMockTest2.runned = true; };
var TestSuiteTest = TestCase.create({
  name: "TestSuiteTest",
  test_instance: function() {
    var suite = new TestSuite(_SuiteMockTest1, _SuiteMockTest2);
    this.assert_equal(2, suite.test_cases.length);
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest1));
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest2));
  },
  test_add_test: function() {
    var suite = new TestSuite();
    suite.add(_SuiteMockTest1, _SuiteMockTest2);
    this.assert_equal(2, suite.test_cases.length);
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest1));
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest2));
  },
  test_remove_test: function() {
    var suite = new TestSuite();
    suite.add(_SuiteMockTest1, _SuiteMockTest2);
    this.assert_equal(2, suite.test_cases.length);
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest1));
    this.assert(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest2));
    suite.remove(_SuiteMockTest2);
    this.assert_equal(1, suite.test_cases.length);
    this.assert_false(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest2));
    suite.remove(_SuiteMockTest2, _SuiteMockTest1);
    this.assert_equal(0, suite.test_cases.length);
    this.assert_false(TestCaseUtil.Array.include(suite.test_cases, _SuiteMockTest1));
  },
  test_suite_tests_run: function() {
    _SuiteMockTest1.runned = false;
    _SuiteMockTest2.runned = false;
    new TestSuite(_SuiteMockTest1, _SuiteMockTest2).run();
    this.assert(_SuiteMockTest1.runned);
    this.assert(_SuiteMockTest2.runned);
  }
});
/* ------------------------------------------------------------------- */

var _TestTestReporter = TestCaseUtil.create_class();
_TestTestReporter.prototype = new TestReporter();
_TestTestReporter.UIBuilder = TestCaseUtil.create_class();
_TestTestReporter.UIBuilder.prototype = new TestReporter.UIBuilder();
_TestTestReporter.UIBuilder.prototype.update_overall_summary = function(block, cases_list) {};
var TestReporterTest = TestCase.create({
  name: "TestReporterTest",
  setup: function() {
    this.ui_builder = new _TestTestReporter.UIBuilder();
    this.reporter = new _TestTestReporter(this.ui_builder);
    this.test = new (TestCase.create({ test_true: function() { this.assert(true); }}))();
  },
  test_instance: function() {
    this.assert_not_null(this.reporter.report_container);
    this.assert_false(this.reporter._is_prepared);
    this.assert_null(this.reporter.current_test);
    this.assert_null(this.reporter.current_test_block);
    this.assert_null(this.reporter.current_test_done_bar);
  },
  test_prepare_called: function() {
    var calls_count = 0;
    this.mockup(this.reporter, 'prepare', function() { calls_count++; });
    this.reporter.register(function() {});
    this.assert(this.reporter._is_prepared);
    this.assert_equal(1, calls_count, 'getting sure the prepare method was called');
    this.reporter.register(function() {});
    this.assert(this.reporter._is_prepared);
    this.assert_equal(1, calls_count, 'getting sure the prepare called only once');
  },
  test_test_register: function() {
    this.reporter.register(this.test);
    this.assert_same(this.test, this.reporter.current_test);
    this.assert_not_null(this.reporter.current_test_block);
    this.assert_not_null(this.reporter.current_test_done_bar);
  },
  test_test_started: function() {
    var $this = this;
    this.assertNothingThrown(function() {
      $this.reporter.register($this.test);
      $this.reporter.test_started('test_true');
    });
  },
  test_test_passed: function() {
    this.test.passed = 1;
    this.test.size = 2;
    this.reporter.register(this.test);
    this.reporter.test_passed('test_true');
    this.assert_style(this.reporter.current_test_done_bar, {width: '50%'});
    this.test.passed = 2;
    this.reporter.test_passed('test_true');
    this.assert_style(this.reporter.current_test_done_bar, {width: '100%'});
  },
  test_test_failed: function() {
    var error_building_called = false;
    this.mockup(this.ui_builder, 'create_error_report', function() {
      error_building_called = true;
    });
    this.reporter.register(this.test);
    this.reporter.test_failed('test_true', new Error(), 1);
    this.assert(error_building_called);
  }
});
/* ------------------------------------------------------------------- */

TestReporter.UIBuilderTest = TestCase.create({
  name: "TestReporter.UIBuilderTest",
  setup: function() {
    this.ui_builder = new TestReporter.UIBuilder();
    this.test = new (TestCase.create({ test_true: function() { this.assert(true); }}))();
  },
  test_create_report_container: function() {
    this.assert_not_null(
      this.ui_builder.create_report_container()
    );
  },
  test_create_test_block: function() {
    this.assert_not_null(
      this.ui_builder.create_test_block(
        this.test, this.ui_builder.create_report_container()
      )
    );
  },
  test_create_done_bar: function() {
    this.assert_not_null(
      this.ui_builder.create_done_bar(
        this.ui_builder.create_test_block(
          this.test, this.ui_builder.create_report_container()
        )
      )
    );
  },
  test_create_error_report: function() {
    this.assert_not_null(
      this.ui_builder.create_error_report(
        this.ui_builder.create_report_container(),
        'test_true', new Error, 1, 'bla bla bla'
      )
    );
  },
  test_create_summary_report: function() {
    this.assert_not_null(
      this.ui_builder.create_summary_report(
        this.ui_builder.create_report_container(), this.test
      )
    );
  }
});
/* ------------------------------------------------------------------- */

var ExtendingTest = TestCase.create({
  name: "ExtendingTest",
  assert_class_has_methods: function(methods) {
    for (var i=0; i < methods.length; i++) {
      this.assert_type_of('function', TestCase[methods[i]], 
        'Checking TestCase.'+methods[i]+' method presence');
    }
  },
  assert_prototype_has_methods: function(methods) {
    for (var i=0; i < methods.length; i++) {
      this.assert_type_of('function', TestCase.prototype[methods[i]],
        'Checking TestCase.prototype.'+methods[i]+' method presence');
    }
  },
  assert_class_and_prototype_have_methods: function(methods) {
    this.assert_class_has_methods(methods);
    this.assert_prototype_has_methods(methods);
  },
  test_starter_presence: function() {
    this.assert_class_and_prototype_have_methods(['run']);
  },
  test_fires_presence: function() {
    this.assert_class_and_prototype_have_methods(
      ['fire_click', 'fireClick', 'fire_right_click', 'fireRightClick']
    );
  },
  test_mocking_presence: function() {
    this.assert_class_and_prototype_have_methods(
      ['mockup', 'mockUp', 'undo_mockup', 'undoMockup']
    );
  },
  test_messaging_presence: function() {
    this.assert_prototype_has_methods(
      ['fail']
    );
  },
  test_assertions_presence: function() {
    this.assert_prototype_has_methods(
      ['assert_true', 'assert_false', 'assert_null', 'assert_not_null',
       'assertTrue', 'assertFalse', 'assertNull', 'assertNotNull']
    );
  },
  test_rails_style_assertions: function() {
    this.assert_prototype_has_methods(
      ['flunk', 'assert', 'assert_nil', 'assert_not_nil', 'assert_kind_of', 'assert_no_match']
    );
  },
  test_special_camilised_assertions: function() {
    this.assert_prototype_has_methods(
      ['assertEquals', 'assertNotEquals', 'assertNoMatch']
    );
  }
});
/* ------------------------------------------------------------------- */

var ExceptionsHandlingTest = TestCase.create({
  name: "ExceptionsHandlingTest",
  setup: function() {
    this.test = new TestCase();
    this.test.reporter = { 
      register: function(test) {},
      test_started: function(test_name) {},
      test_passed: function(test_name) {},
      test_failed: function(test_name, error, assertion_num) {}
    };
  },
  test_failure_catching: function() {
    var test = this.test;
    test.test_failure = function() {
      this.fail('test failure');
    };
    this.assert_nothing_thrown(function() {
      test.run();
    });
  },
  test_problem_catching: function() {
    var test = this.test;
    test.test_failure = function() {
      this.throw_problem('test problem');
    };
    this.assert_nothing_thrown(function() {
      test.run();
    });
  },
  test_wrong_value_catching: function() {
    var test = this.test;
    test.test_failure = function() {
      this.throw_unexp('asdf', 'zdf');
    };
    this.assert_nothing_thrown(function() {
      test.run();
    });
  }
});
/* ------------------------------------------------------------------- */

var TestReporterIntegrationTest = TestCase.create({
  name: "TestReporterIntegrationTest",
  test_default_test_reporter: function() {
    this.assert_not_null(TestCase.reporter);
    this.assert_instance_of(TestReporter.InlineReporter, TestCase.reporter);
  }
});
/* ------------------------------------------------------- */
        var build_test_suite = new TestSuite(
          TestCaseUtilTest, TestCaseUtil.ArrayTest, TestCaseUtil.EventTest, TestCaseUtil.ElementTest, TestCaseUtil.Element.SelectorTest, TestCaseUtil.DiffTest, TestCaseTest, TestCase.AssertionsExtenderTest, TestCase.AssertionsTest, TestCase.FiresTest, TestCase.MessagingTest, TestCase.MockingTest, TestCase.Mocking.FakeXMLHttpRequestTest, TestCase.Mocking.PrototypeTest, TestCase.Mocking.MooToolsTest, TestCase.Mocking.jQueryTest, TestCase.StarterTest, TestSuiteTest, TestReporterTest, TestReporter.UIBuilderTest, ExtendingTest, ExceptionsHandlingTest, TestReporterIntegrationTest
        );
      