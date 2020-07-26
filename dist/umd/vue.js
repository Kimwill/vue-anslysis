(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function initState(vm) {
    var opts = vm.options;

    if (opts.props) ;

    if (opts.data) {
      ininData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;

    if (opts.methods) ;
  }

  function ininData(vm) {
    var data = vm.options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    console.log(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  console.log('aa');
  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
