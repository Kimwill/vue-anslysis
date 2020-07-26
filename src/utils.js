export function isObject(data) {
  return typeof data === 'object' && data !== null
}

export function isSameNode(oldNode, newNode) {
  return oldNode.tag === newNode.tag && oldNode.key === newNode.key
}

const strats = {}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
function mergeHook(parent, child) {
  if (child) {
    if (parent) {
      return parent.concat(child)
    } else {
      return [child]
    }
  } else {
    return parent
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
export function mergeOptions(parentVal, childVal) {
  const options = {}
  for (let key in parentVal) {
    mergeField(key)
  }
  for (let key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parentVal[key], childVal[key])
    } else {
      if (isObject(parentVal[key]) && isObject(childVal[key])) {
        options[key] = {
          ...parentVal[key],
          ...childVal[key]
        }
      } else {
        options[key] = childVal[key]
      }
    }
  }
  return options
}
