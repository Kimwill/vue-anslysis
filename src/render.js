import { createElementVNode, createTextVNode } from './vdom/create-element.js'

export function renderMixin(Vue) {
  Vue.prototype._render = function() {
    const vm = this
    const { render } = vm.$options
    let node = render.call(vm)

    return node
  }
  Vue.prototype._c = function() {
    return createElementVNode(...arguments)
  }
  Vue.prototype._v = function(text) {
    // 创建文本的虚拟节点
    return createTextVNode(text)
  }
  Vue.prototype._s = function(val) {
    return val ? (typeof val === 'object' ? JSON.stringify(val) : val) : ''
  }
}