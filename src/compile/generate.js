const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) { // style:{color:red;background#fff}
  let attr = ''
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i].name === 'style') {
      const obj = {}
      attrs[i].value.split(';').forEach(item => {
        const [key, value] = item.split(':')
        obj[key] = value
      })
      attrs[i].value = obj
    }
    attr += `${attrs[i].name}:${JSON.stringify(attrs[i].value)},`
  }
  return `{${attr.slice(0, -1)}}`
}
function gen(el) { // hello {{ msg }} aa {{test}}
  if (el.type === 1) {
    return generate(el)
  } else {
    if (!defaultTagRE.test(el.text)) {
      return `_v(${JSON.stringify(el.text)})`
    } else {
      let lastIndex = defaultTagRE.lastIndex = 0
      let match = ''
      let tokens = []
      while (match = defaultTagRE.exec(el.text)) {
        let index = match.index
        if (lastIndex < index) {
          tokens.push(JSON.stringify(el.text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (el.text.length > lastIndex) {
        tokens.push(JSON.stringify(el.text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}
function genChild(node) {
  const children = node.children
  if (!children || children.length === 0) {
    return false
  } else {
    return `${children.map(c => gen(c)).join(',')}`
  }
}
export function generate(el) {
  const children = genChild(el)
  let code = `_c("${el.tag}",${
    el.attrs.length > 0 ? genProps(el.attrs) : undefined
  }, ${
    children ? children : ''
  })`
  return code
}