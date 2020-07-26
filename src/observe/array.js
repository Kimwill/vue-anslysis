const oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reserve',
  'splice'
]

methods.forEach(method => {
  // 函数劫持（AOP）
  arrayMethods[method] = function(...args) {
    const ob = this.__ob__
    const result = oldArrayMethods[method].apply(this, args)
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    inserted && ob.observeArray(inserted)
    return result
  }
})
