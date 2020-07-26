import { initState } from './state.js'
import { compileToFunctions } from './compile/index.js'
import { mountComponent } from './lifeCycle.js'
import { mergeOptions } from './utils.js'
import { nextTick } from './observe/scheduler.js'

export function initMixin(Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    // 初始化状态
    initState(vm)
    // 页面挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    vm.$el = el = document.querySelector(el)
    // 如果options中没有render
    if (!vm.$options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }
    mountComponent(vm, el) // 组件挂载流程
  }
}
