import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
const script = layout.match(/const landingFrameScript = `([\s\S]*?)`;/)[1]
const posterKey = 'esap-landing-final-poster-v16'

function preview({ path = '/', cached = null } = {}) {
  const storage = new Map(cached ? [[posterKey, cached]] : [])
  const attrs = new Map()
  const heroAttrs = new Map()
  const timers = new Map()
  const observers = []
  const captures = []
  let timerId = 0
  let animationFrames = 0
  const canvas = { width: 1728, height: 972, getBoundingClientRect: () => ({ height: 720 }) }
  const hero = {
    getAttribute: name => heroAttrs.get(name),
    querySelector: () => canvas,
  }
  const shell = { isConnected: true, querySelector: () => hero }
  let currentShell = path === '/' ? shell : null
  const root = {
    style: { setProperty() {}, removeProperty() {} },
    setAttribute: (name, value) => attrs.set(name, value),
    removeAttribute: name => attrs.delete(name),
  }
  const document = {
    documentElement: root,
    body: {},
    readyState: 'complete',
    querySelector: () => currentShell,
    createElement: () => ({
      getContext: () => ({ fillRect() {}, drawImage: (...args) => captures.push(args) }),
      toDataURL: () => 'data:image/jpeg;base64,finished',
    }),
  }
  vm.runInNewContext(script, {
    document,
    window: { location: { pathname: path }, addEventListener() {}, scrollTo() {} },
    performance: { getEntriesByType: () => [] },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this) }
      observe(target) { this.target = target }
      disconnect() { this.target = null }
    },
    setTimeout: callback => { timers.set(++timerId, callback); return timerId },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: () => { animationFrames++ },
  })
  const notify = target => observers.filter(o => o.target === target).forEach(o => o.callback())
  return {
    storage, attrs, captures,
    get frames() { return animationFrames },
    get pendingTimers() { return timers.size },
    settle() { heroAttrs.set('data-pcb-state', 'settled'); notify(hero) },
    flush() { for (const [id, callback] of timers) { timers.delete(id); callback() } },
    enter() { currentShell = shell; notify(document.body) },
    leave() { shell.isConnected = false; currentShell = null; notify(document.body) },
  }
}

test('an unfinished or failed animation does not poll every frame or cache a partial scene', () => {
  const page = preview()
  page.flush()
  assert.equal(page.frames, 0)
  assert.equal(page.pendingTimers, 0)
  assert.equal(page.storage.has(posterKey), false)
})

test('the final scene is cached after the handoff and excludes viewport padding', () => {
  const page = preview()
  page.settle()
  assert.equal(page.storage.has(posterKey), false)
  page.flush()
  assert.equal(page.storage.get(posterKey), 'data:image/jpeg;base64,finished')
  assert.equal(page.captures.length, 1)
  const [, x, y, width, height] = page.captures[0]
  assert.deepEqual([x, y, width, height], [0, 81, 1728, 810])
  assert.equal(page.attrs.has('data-esap-return-poster'), false)
})

test('leaving during the handoff cancels the pending snapshot', () => {
  const page = preview()
  page.settle()
  page.leave()
  page.flush()
  assert.equal(page.storage.has(posterKey), false)
  assert.equal(page.pendingTimers, 0)
})

test('a direct visit to an internal page can restore the landing poster on client navigation', () => {
  const page = preview({ path: '/projects/', cached: 'data:image/jpeg;base64,existing' })
  assert.equal(page.attrs.has('data-esap-return-poster'), false)
  page.enter()
  assert.equal(page.attrs.get('data-esap-return-poster'), '1')
  assert.equal(page.frames, 0)
  page.leave()
  assert.equal(page.attrs.has('data-esap-return-poster'), false)
})

test('a return visit uses the poster immediately without starting a capture loop', () => {
  const page = preview({ cached: 'data:image/jpeg;base64,existing' })
  assert.equal(page.attrs.get('data-esap-return-poster'), '1')
  assert.equal(page.frames, 0)
  assert.equal(page.pendingTimers, 0)
})
