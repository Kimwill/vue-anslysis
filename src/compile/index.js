import { parseHTML } from './parse.js'
import { generate } from './generate.js'

export function compileToFunctions(template) {
  /*
    模板编译原理
    1、生成ast语法书
    2、标记静态数（提高性能，静态树不做比对）
    3、通过ast语法书生成代码 => render
  */
  let ast = parseHTML(template)

  // 代码生成 ast => render
  let code = generate(ast)
  code = `with(this) {return ${code}}`
  const render = new Function(code) // 相当于把字符串变成函数
  return render
}