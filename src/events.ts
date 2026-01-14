type KeysWithVoidPayload<Events extends Record<string, any>> = {
  [K in keyof Events]: Events[K] extends void ? K : never
}[keyof Events]

export class Emitter<Events extends Record<string, any>> {
  #events: { [K in keyof Events]?: ((args: Events[K]) => void)[] } = {}

  on<K extends keyof Events>(event: K, listener: (args: Events[K]) => void) {
    if (!this.#events[event]) this.#events[event] = []
    this.#events[event].push(listener)

    return (): void => this.off(event, listener)
  }

  once<K extends keyof Events>(event: K, listener: (args: Events[K]) => void): void {
    const wrappedListener = (args: Events[K]) => {
      listener(args)
      this.off(event, wrappedListener)
    }

    this.on(event, wrappedListener)
  }

  off<K extends keyof Events>(event: K, listener?: (args: Events[K]) => void): void {
    if (!this.#events[event]) return

    if (listener) {
      this.#events[event] = this.#events[event].filter((l) => l !== listener) as any
    } else {
      this.#events[event] = []
    }
  }

  emit<K extends KeysWithVoidPayload<Events>>(event: K): void
  emit<K extends Exclude<keyof Events, KeysWithVoidPayload<Events>>>(event: K, args: Events[K]): void
  emit<K extends keyof Events>(event: K, args?: Events[K]): void {
    this.#events[event]?.forEach((listener) => listener(args as Events[K]))
  }

  destroy(): void {
    this.#events = {}
  }
}
