(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function isSameNode(oldNode, newNode) {
    return oldNode.tag === newNode.tag && oldNode.key === newNode.key;
  }
  var strats = {};
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];

  function mergeHook(parent, child) {
    if (child) {
      if (parent) {
        return parent.concat(child);
      } else {
        return [child];
      }
    } else {
      return parent;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parentVal, childVal) {
    var options = {};

    for (var key in parentVal) {
      mergeField(key);
    }

    for (var _key in childVal) {
      if (!parentVal.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parentVal[key], childVal[key]);
      } else {
        if (isObject(parentVal[key]) && isObject(childVal[key])) {
          options[key] = _objectSpread2(_objectSpread2({}, parentVal[key]), childVal[key]);
        } else {
          options[key] = childVal[key];
        }
      }
    }

    return options;
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reserve', 'splice'];
  methods.forEach(function (method) {
    // 函数劫持（AOP）
    arrayMethods[method] = function () {
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      inserted && ob.observeArray(inserted);
      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "addSubs",
      value: function addSubs(watch) {
        this.subs.push(watch);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (sub) {
          sub.update();
        });
      }
    }]);

    return Dep;
  }();
  var stack = [];
  function pushTarget(watch) {
    Dep.target = watch;
    stack.push(watch);
  }
  function popTarget(watch) {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });

      if (Array.isArray(data)) {
        // 若对数据所有项进行拦截，效率很低
        // 数组是通过对push, unshift, splice等操作数组的方法做拦截实现观测的（改写数组原型链）
        data.__proto__ = arrayMethods; // 改写原型链，数组调用方法时会先调用自身重写的方法

        this.observeArray(data);
      } else {
        // 对象用definePorperty的方式做拦截
        this.walk(data);
      }
    }

    _createClass(Observe, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observe;
  }();

  function defineReactive(data, key, value) {
    var dep = new Dep();
    observe(value); // 如果传入的值还是对象，递归观测

    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend(); // 让watch收集dep，让dep收集watch
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 监控当前设置的新值

        value = newValue;
        dep.notify();
      }
    });
  }

  function observe(data) {
    if (!isObject(data)) {
      return;
    } // 这么写的好处是可以通过判断data是否是Object的实力来确认是否已经观测过


    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.data) {
      ininData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;

    if (opts.methods) ;
  }

  function proxy(target, property, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[property][key];
      },
      set: function set(newVal) {
        target[property][key] = newVal;
      }
    });
  }

  function ininData(vm) {
    var data = vm.$options.data; // _data代表观测后的data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 观测数据

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    var root = null;
    var currentParent = null;
    var stack = [];

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        currentParent.children.push(element);
        element.parent = currentParent;
      }
    }

    function chars(text) {
      text = text.trim();

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tag, startTagMatch.attrs);
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        }
      } // 如果不是0，说明是文本


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tag: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attrs;

        while (!(_end = html.match(startTagClose)) && (attrs = html.match(attribute))) {
          advance(attrs[0].length);
          match.attrs.push({
            name: attrs[1],
            value: attrs[3] || attrs[4] || attrs[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    // style:{color:red;background#fff}
    var attr = '';

    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name === 'style') {
        (function () {
          var obj = {};
          attrs[i].value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attrs[i].value = obj;
        })();
      }

      attr += "".concat(attrs[i].name, ":").concat(JSON.stringify(attrs[i].value), ",");
    }

    return "{".concat(attr.slice(0, -1), "}");
  }

  function gen(el) {
    // hello {{ msg }} aa {{test}}
    if (el.type === 1) {
      return generate(el);
    } else {
      if (!defaultTagRE.test(el.text)) {
        return "_v(".concat(JSON.stringify(el.text), ")");
      } else {
        var lastIndex = defaultTagRE.lastIndex = 0;
        var match = '';
        var tokens = [];

        while (match = defaultTagRE.exec(el.text)) {
          var index = match.index;

          if (lastIndex < index) {
            tokens.push(JSON.stringify(el.text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (el.text.length > lastIndex) {
          tokens.push(JSON.stringify(el.text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChild(node) {
    var children = node.children;

    if (!children || children.length === 0) {
      return false;
    } else {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    }
  }

  function generate(el) {
    var children = genChild(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length > 0 ? genProps(el.attrs) : undefined, ", ").concat(children ? children : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    /*
      模板编译原理
      1、生成ast语法书
      2、标记静态数（提高性能，静态树不做比对）
      3、通过ast语法书生成代码 => render
    */
    var ast = parseHTML(template); // 代码生成 ast => render

    var code = generate(ast);
    code = "with(this) {return ".concat(code, "}");
    var render = new Function(code); // 相当于把字符串变成函数

    return render;
  }

  var queue = [];
  var has = {};

  function flushQueueWatcher() {
    queue.forEach(function (watcher) {
      watcher.run();
    });
    queue = [];
    has = {};
  }

  function queneWatcher(watcher) {
    var id = watcher.id;

    if (!has.id) {
      queue.push(watcher);
      has.id = true; // setTimeout(flushQueueWatcher, 0)

      nextTick(flushQueueWatcher);
    }
  }
  var pending = false;
  var callbacks = [];

  function flushCallbackQueue(fn) {
    callbacks.forEach(function (fn) {
      return fn();
    });
    pending = false;
  }

  function nextTick(fn) {
    callbacks.push(fn);

    if (!pending) {
      setTimeout(flushCallbackQueue, 0);
      pending = true;
    }
  }

  var id$1 = 0;

  var Watch = /*#__PURE__*/function () {
    function Watch(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watch);

      this.vm = vm;
      this.id = id$1++;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.deps = [];
      this.depsId = new Set();
      if (typeof exprOrFn === 'function') [this.getter = exprOrFn];
      this.get();
      exprOrFn();
    }

    _createClass(Watch, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        this.getter();
        popTarget();
      }
    }, {
      key: "update",
      value: function update() {
        // Vue采用异步更新策略
        queneWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        if (!this.depsId.has(dep.id)) {
          this.deps.push(dep);
          this.depsId.add(dep.id);
          dep.addSubs(this);
        }
      }
    }]);

    return Watch;
  }();

  function patch(oldNode, newNode) {
    var isRealElement = oldNode.nodeType;

    if (isRealElement) {
      var oldEle = oldNode;
      var parentEle = oldNode.parentNode;
      var el = createEle(newNode);
      parentEle.insertBefore(el, oldEle.nextSibling);
      parentEle.removeChild(oldEle);
      return el;
    } else {
      // diff
      // 标签名不同，直接用新的替换掉旧的
      if (oldNode.tag !== newNode.tag) {
        oldNode.el.parentNode.replaceChild(createEle(newNode), oldNode.el);
      } // 没有标签名，说明是文本节点，直接用新的文本替换旧的文本


      if (!oldNode.tag) {
        if (oldNode.text !== newNode.text) {
          oldNode.el.textContent = newNode.text;
        }
      } // 标签相同，复用标签并且更新属性


      var _el = newNode.el = oldNode.el;

      updateProperties(newNode, oldNode.data); // 比较孩子节点

      var oldChildren = oldNode.children || [];
      var newChildren = newNode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 新老都有孩子
        updateChildren(_el, oldChildren, newChildren);
      } else if (oldChildren.length > 0) {
        // 新节点没有孩子老节点有，清空老节点的孩子
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 老节点没有孩子新节点有
        newChildren.forEach(function (child) {
          _el.appendChild(createEle(child));
        });
      }

      return _el;
    }
  }

  function makeIndexByKey(children) {
    var map = {};
    children.forEach(function (child, index) {
      map[child.key] = index;
    });
    return map;
  }

  function updateChildren(parent, oldChildren, newChildren) {
    var oldStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var oldStartNode = oldChildren[oldStartIndex];
    var oldEndNode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newEndIndex = newChildren.length - 1;
    var newStartNode = newChildren[newStartIndex];
    var newEndNode = newChildren[newEndIndex];
    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldChildren[oldStartIndex]) {
        oldStartNode = oldChildren[++oldStartIndex];
      } else if (!oldChildren[oldEndIndex]) {
        oldEndNode = oldChildren[--oldEndIndex];
      } else if (isSameNode(oldStartNode, newStartNode)) {
        // 优化向后追加逻辑
        patch(oldStartNode, newStartNode); // 比对属性， 并且递归比对孩子

        oldStartNode = oldChildren[++oldStartIndex];
        newStartNode = newChildren[++newStartIndex];
      } else if (isSameNode(oldEndNode, newEndNode)) {
        // 优化向前追加逻辑
        patch(oldEndNode, newEndNode);
        oldEndNode = oldChildren[--oldEndIndex];
        newEndNode = newChildren[--newEndIndex];
      } else if (isSameNode(oldStartNode, newEndNode)) {
        // 头移尾
        patch(oldStartNode, newEndNode);
        parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling);
        oldStartNode = oldChildren[++oldStartIndex];
        newEndNode = newChildren[--newEndIndex];
      } else if (isSameNode(oldEndNode, newStartNode)) {
        patch(oldEndNode, newStartNode);
        parent.insertBefore(oldEndNode.el, oldStartNode.el);
        oldEndNode = oldChildren[--oldEndIndex];
        newStartNode = newChildren[++newStartIndex];
      } else {
        // 暴力对比
        var moveIndex = map[newStartNode.key];

        if (moveIndex) {
          // 存在，代表新节点中有这个元素，做移动
          var moveNode = oldChildren[moveIndex];
          oldChildren[moveIndex] = null;
          patch(moveNode, newStartNode);
          parent.insertBefore(moveNode.el, oldStartNode.el);
        } else {
          // 不存在，需要新建一个元素添加到旧节点中
          parent.insertBefore(createEle(newStartNode), oldStartNode.el);
        }

        newStartNode = newChildren[++newStartIndex];
      }
    } // 新children有剩余，说明有新的节点需要加入


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var _ele = newChildren[newEndIndex + 1] === undefined ? null : newChildren[newEndIndex + 1].el;

        parent.insertBefore(createEle(newChildren[i]), _ele);
      }
    } // 旧children有剩余，说明新children中没有这些元素，需要删除


    if (oldStartIndex <= oldEndNode) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (!ele) {
          parent.removeChild(child.el);
        }
      }
    }
  }

  function createEle(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        key = vnode.key,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createEle(child));
      });
    } else {
      // 文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(newNode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = newNode.data || {};
    var el = newNode.el; // 遍历旧属性，删除新节点中不存在的属性

    var oldStyle = oldProps.style;
    var newStyle = newProps.style;

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    }

    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        // {color:red;background:#fff}
        for (var styleName in newProps[_key2]) {
          el.style[styleName] = newProps[_key2][styleName];
        }
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var preVNode = vm._vnode;
      vm._vnode = vnode;

      if (preVNode) {
        vm.$el = patch(_vnode, vnode);
      } else {
        vm.$el = patch(vm.$el, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    function updateComponent() {
      // _render => 调用otps上的render方法，返回虚拟DOM
      // _update => 将虚拟DOM变为真实DOM
      vm._update(vm._render());
    } // 数据变化时，执行updateComponent更新视图


    new Watch(vm, updateComponent, function () {}, true);
  }

  function initMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;

    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options); // 初始化状态

      initState(vm); // 页面挂载

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      vm.$el = el = document.querySelector(el); // 如果options中没有render

      if (!vm.$options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render;
      }

      mountComponent(vm); // 组件挂载流程
    };
  }

  function createElementVNode(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children);
  }
  function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 虚拟节点，产生一个对象，用来描述dom结构
  // ast树用来描述dom语法

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var node = render.call(vm);
      return node;
    };

    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      // 创建文本的虚拟节点
      return createTextVNode(text);
    };

    Vue.prototype._s = function (val) {
      return val ? _typeof(val) === 'object' ? JSON.stringify(val) : val : '';
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifeCycleMixin(Vue);
  initGlobalAPI(Vue); // --------------------------diff------------------------
  var vm1 = new Vue({
    data: {
      name: 'kim'
    }
  });
  var render1 = compileToFunctions("<div>\n  <li key=\"A\">A</li>\n  <li key=\"B\">B</li>\n  <li key=\"C\">C</li>\n  <li key=\"D\">D</li>\n</div>");
  var oldVNode = render1.call(vm1);
  var vm2 = new Vue({
    data: {
      name: 'xiao'
    }
  });
  var render2 = compileToFunctions("<div>\n  <li key=\"C\">C</li>\n  <li key=\"A\">A</li>\n  <li key=\"D\">D</li>\n  <li key=\"B\">B</li>\n  <li key=\"E\">E</li>\n</div>");
  var newVNode = render2.call(vm2);
  var el = createEle(oldVNode);
  document.body.appendChild(el);
  setTimeout(function () {
    patch(oldVNode, newVNode);
  }, 1000);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
