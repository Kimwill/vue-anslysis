import { isObject } from '../utils.js'
import { arrayMethods } from './array.js'
import Dep from './dep.js'

class Observe {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })
    if (Array.isArray(data)) {
      // 若对数据所有项进行拦截，效率很低
      // 数组是通过对push, unshift, splice等操作数组的方法做拦截实现观测的（改写数组原型链）
      data.__proto__ = arrayMethods // 改写原型链，数组调用方法时会先调用自身重写的方法
      this.observeArray(data)
    } else {
      // 对象用definePorperty的方式做拦截
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  let dep = new Dep()
  observe(value) // 如果传入的值还是对象，递归观测
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend() // 让watch收集dep，让dep收集watch
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue) // 监控当前设置的新值
      value = newValue
      dep.notify()
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return
  }
  // 这么写的好处是可以通过判断data是否是Object的实力来确认是否已经观测过
  return new Observe(data)
}