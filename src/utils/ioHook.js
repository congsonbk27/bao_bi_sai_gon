const ioHook = $api.ioHook

class IOHookManager {
  
  callbacks = null
  
  constructor() {   
    this.setUp()
  }

  setUp = async () => {
    ioHook.start();
    ioHook.on('keypress', this.eventHandler);
  }

  eventHandler = (e) => {
    if(this.callbacks) this.callbacks(e)
  }
 
  registerListener = (callback) => {
    this.callbacks = callback
  }
}

const ioHookManager = new IOHookManager()
export default ioHookManager
