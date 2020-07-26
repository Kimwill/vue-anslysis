import { initMixin } from './init.js'
import { renderMixin } from './render.js'
import { lifeCycleMixin } from './lifeCycle.js'
import { initGlobalAPI } from './global-api/index.js'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)
initGlobalAPI(Vue)


// --------------------------diff------------------------
import { compileToFunctions } from './compile/index.js'
import { patch, createEle } from './vdom/patch.js'
let vm1 = new Vue({data: {name: 'kim'}})
let render1 = compileToFunctions(`<div>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
  <li key="D">D</li>
</div>`)
let oldVNode = render1.call(vm1)

let vm2 = new Vue({data: {name: 'xiao'}})
let render2 = compileToFunctions(`<div>
  <li key="C">C</li>
  <li key="A">A</li>
  <li key="D">D</li>
  <li key="B">B</li>
  <li key="E">E</li>
</div>`)
let newVNode = render2.call(vm2)

let el = createEle(oldVNode)
document.body.appendChild(el)
setTimeout(() => {
  patch(oldVNode, newVNode)
}, 1000)

export default Vue
