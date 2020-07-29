import Watch from './observe/watch.js'
import { patch } from './vdom/patch.js'

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const preVNode = vm._vnode
    vm._vnode = vnode
    if (preVNode) {
      vm.$el = patch(_vnode, vnode)
    } else {
      vm.$el = patch(vm.$el, vnode)
    }
  }
}

export function mountComponent(vm, el) {
  function updateComponent() {
    // _render => 调用otps上的render方法，返回虚拟DOM
    // _update => 将虚拟DOM变为真实DOM
    vm._update(vm._render())
  }
  // 数据变化时，执行updateComponent更新视图
  new Watch(vm, updateComponent, () => {}, true)
}

function testGit() {}