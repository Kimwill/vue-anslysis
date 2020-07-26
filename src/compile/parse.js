const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

export function parseHTML(html) {

  let root = null
  let currentParent = null
  let stack = []

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  function chars(text) {
    text = text.trim()
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  while(html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag(html)
      if (startTagMatch) {
        // 开始标签
        start(startTagMatch.tag, startTagMatch.attrs)
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
      }
    }
    // 如果不是0，说明是文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tag: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attrs
      while (!(end = html.match(startTagClose)) && (attrs = html.match(attribute))) {
        advance(attrs[0].length)
        match.attrs.push({ name: attrs[1], value: attrs[3] || attrs[4] || attrs[5] })
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }

  return root

}
