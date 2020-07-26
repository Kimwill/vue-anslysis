let id = 0

export default class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  addSubs(watch) {
    this.subs.push(watch)
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
let stack = []
export function pushTarget(watch) {
  Dep.target = watch
  stack.push(watch)
}

export function popTarget(watch) {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}