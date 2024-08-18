const { contextBridge, ipcRenderer } = require('electron/renderer')

class JvtBridge {
  static create = (type) => {
    switch (type) {
      case 'ipcOn': this._exposeOn(); break;
      default:
        console.error(`JvtBridge.create: invalid type(${type})!`);
        break;
    }
  }

  _exposeOn = () => {
    contextBridge.exposeInMainWorld('JvtNativeAPI', {
      nativeApi: (data) => ipcRenderer.send(JVT_NATIVE_ON, data)
    })
  }

  _exposeOnPort = () => {
  }
}

module.exports = {
  JvtBridge,
};