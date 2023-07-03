export const element = (tagOrComponent, attributes, ...children) => {
  if (typeof tagOrComponent === 'function') {
    return tagOrComponent({ ...attributes, children })
  }

  const tag = tagOrComponent

  const root = document.createElement(tag)

  for (const [key, attribute] of Object.entries(attributes || {})) {
    if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase()
      root.addEventListener(event, attribute)
      continue
    }

    if (attribute[meta]) {
      const value = attribute.get()

      attribute.subscribe((newValue) => {
        root.setAttribute(key, newValue)
      })

      root.setAttribute(key, value)

      continue
    }

    root.setAttribute(key, attribute)
  }

  for (const child of children) {
    if (!child) {
      continue
    }

    if (typeof child === 'string') {
      root.appendChild(document.createTextNode(child))
      continue
    }

    if (child[meta]) {
      const value = child.get()

      if (value instanceof HTMLElement) {
        let oldValue = value
        root.appendChild(value)

        child.subscribe((newValue) => {
          root.replaceChild(newValue, oldValue)
          oldValue = newValue
        })

        continue
      }

      const element = document.createTextNode(String(value))

      child.subscribe((newValue) => {
        element.textContent = String(newValue)
      })

      root.appendChild(element)
    }

    if (Array.isArray(child)) {
      for (const grandchild of child) {
        root.appendChild(grandchild)
      }

      continue
    }

    root.appendChild(child)
  }

  return root
}

const meta = Symbol('reactive')

export const reactive = (initial) => {
  let state = initial
  const listeners = new Set()

  const set = (newState) => {
    state = newState

    for (const listener of listeners) {
      listener(newState)
    }
  }

  const get = () => state

  const update = (f) => {
    set(f(state))
  }

  const subscribe = (listener) => {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  const derive = (f) => {
    const derived = reactive(f(state))

    subscribe((newState) => derived.set(f(newState)))

    return derived
  }

  return {
    [meta]: '@reactive',
    get,
    set,
    subscribe,
    update,
    derive,
  }
}
