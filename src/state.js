import { observe } from './observe/index.js'

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.data) {
    ininData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
}

function initProps(vm) {}
function proxy(target, property, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[property][key]
    },
    set(newVal) {
      target[property][key] = newVal
    }
  })
}
function ininData(vm) {
  let data = vm.$options.data
  // _data代表观测后的data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 观测数据
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}
function initComputed(vm) {}
function initWatch(vm) {}
function initMethods(vm) {}

