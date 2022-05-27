export class PubSub {
    // Event Channel 事件中心
    [key: string]: any;
    events: {[key: string]: Function[]} = {}
  
    constructor() {}
  
    subscribe(type: string, cb: Function) {
      if (!this[type]) {
        this.events[type] = []
      }
  
      this.events[type].push(cb)
    }
  
    publish(type: string, ...args: any[]) {
      if (this.events[type]) {
        this.events[type].forEach((event) => event(...args))
      }
    }
  
    unsubscribe(type: string, cb: Function) {
      if (!this[type]) {
        return
      }
  
      const i = this.events[type].indexOf(cb)
  
      this.events[type].splice(i, 1)
  
      if (this.events[type].length === 0) {
        delete this.events[type]
      }
    }
  }