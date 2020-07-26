export function createElementVNode(tag, data = {}, ...children) {
  let key = data.key
  return vnode(tag, data, key, children)
}

export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 虚拟节点，产生一个对象，用来描述dom结构
// ast树用来描述dom语法
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}