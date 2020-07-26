let queue = []
let has = {}

function flushQueueWatcher() {
  queue.forEach(watcher => {
    watcher.run()
  })
  queue = []
  has = {}
}

export function queneWatcher(watcher) {
  const id = watcher.id
  if (!has.id) {
    queue.push(watcher)
    has.id = true
    // setTimeout(flushQueueWatcher, 0)
    nextTick(flushQueueWatcher)
  }
}

let pending = false
let callbacks = []
function flushCallbackQueue(fn) {
  callbacks.forEach(fn => fn())
  pending = false
}

export function nextTick(fn) {
  callbacks.push(fn)
  if (!pending) {
    setTimeout(flushCallbackQueue, 0)
    pending = true
  }
}