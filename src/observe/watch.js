import { pushTarget, popTarget } from "./dep"
import { queneWatcher } from "./scheduler"

let id = 0

export default class Watch {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.id = id++
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.deps = []
    this.depsId = new Set()
    if (typeof exprOrFn === 'function') [
      this.getter = exprOrFn
    ]
    this.get()
    exprOrFn()
  }
  get() {
    pushTarget(this)
    this.getter()
    popTarget(this)
  }
  update() {
    // Vue采用异步更新策略
    queneWatcher(this)
  }
  run() {
    this.get()
  }
  addDep(dep) {
    if (!this.depsId.has(dep.id)) {
      this.deps.push(dep)
      this.depsId.add(dep.id)
      dep.addSubs(this)
    }
  }
}