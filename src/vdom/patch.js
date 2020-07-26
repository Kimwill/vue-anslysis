import { isSameNode } from "../utils"

export function patch(oldNode, newNode) {
  const isRealElement = oldNode.nodeType
  if (isRealElement) {
    const oldEle = oldNode
    const parentEle = oldNode.parentNode
    let el = createEle(newNode)
    parentEle.insertBefore(el, oldEle.nextSibling)
    parentEle.removeChild(oldEle)
    return el
  } else {
    // diff
    // 标签名不同，直接用新的替换掉旧的
    if (oldNode.tag !== newNode.tag) {
      oldNode.el.parentNode.replaceChild(createEle(newNode), oldNode.el)
    }
    // 没有标签名，说明是文本节点，直接用新的文本替换旧的文本
    if (!oldNode.tag) {
      if (oldNode.text !== newNode.text) {
        oldNode.el.textContent = newNode.text
      }
    }
    // 标签相同，复用标签并且更新属性
    let el = newNode.el = oldNode.el
    updateProperties(newNode, oldNode.data)
    // 比较孩子节点
    const oldChildren = oldNode.children || []
    const newChildren = newNode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 新老都有孩子
      updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
      // 新节点没有孩子老节点有，清空老节点的孩子
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      // 老节点没有孩子新节点有
      newChildren.forEach(child => {
        el.appendChild(createEle(child))
      })
    }
    return el
  }
}

function makeIndexByKey(children) {
  const map = {}
  children.forEach((child, index) => {
    map[child.key] = index
  })
  return map
}

function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let oldStartNode = oldChildren[oldStartIndex]
  let oldEndNode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  let newStartNode = newChildren[newStartIndex]
  let newEndNode = newChildren[newEndIndex]
  
  let map = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldChildren[oldStartIndex]) {
      oldStartNode = oldChildren[++oldStartIndex]
    } else if (!oldChildren[oldEndIndex]) {
      oldEndNode = oldChildren[--oldEndIndex]
    } else if (isSameNode(oldStartNode, newStartNode)) {
      // 优化向后追加逻辑
      patch(oldStartNode,newStartNode) // 比对属性， 并且递归比对孩子
      oldStartNode = oldChildren[++oldStartIndex]
      newStartNode = newChildren[++newStartIndex]
    } else if (isSameNode(oldEndNode, newEndNode)) {
      // 优化向前追加逻辑
      patch(oldEndNode, newEndNode)
      oldEndNode = oldChildren[--oldEndIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (isSameNode(oldStartNode, newEndNode)) {
      // 头移尾
      patch(oldStartNode, newEndNode)
      parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling)
      oldStartNode = oldChildren[++oldStartIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (isSameNode(oldEndNode, newStartNode)) {
      patch(oldEndNode, newStartNode)
      parent.insertBefore(oldEndNode.el, oldStartNode.el)
      oldEndNode = oldChildren[--oldEndIndex]
      newStartNode = newChildren[++newStartIndex]
    } else {
      // 暴力对比
      let moveIndex = map[newStartNode.key]
      if (moveIndex) {
        // 存在，代表新节点中有这个元素，做移动
        let moveNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null
        patch(moveNode, newStartNode)
        parent.insertBefore(moveNode.el, oldStartNode.el)
      } else {
        // 不存在，需要新建一个元素添加到旧节点中
        parent.insertBefore(createEle(newStartNode), oldStartNode.el)
      }
      newStartNode = newChildren[++newStartIndex]
    }
  }
  // 新children有剩余，说明有新的节点需要加入
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] === undefined ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createEle(newChildren[i]), ele)
    }
  }
  // 旧children有剩余，说明新children中没有这些元素，需要删除
  if (oldStartIndex <= oldEndNode) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (!ele) {
        parent.removeChild(child.el)
      }
    }
  }
}

export function createEle(vnode) {
  const { tag, data, key, children, text } = vnode
  if (typeof tag === 'string') {
    // 标签
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createEle(child))
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(newNode, oldProps = {}) {
  const newProps = newNode.data || {}
  const el = newNode.el
  // 遍历旧属性，删除新节点中不存在的属性
  const oldStyle = oldProps.style
  const newStyle = newProps.style
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  for (let key in newProps) {
    if (key === 'style') { // {color:red;background:#fff}
      for (let styleName in newProps[key]) {
        el.style[styleName] = newProps[key][styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}