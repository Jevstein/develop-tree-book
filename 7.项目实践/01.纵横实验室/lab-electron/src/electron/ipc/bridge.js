const { contextBridge, ipcRenderer } = require('electron/renderer')
const JVT_NATIVE_ON = 'jvt-native-on';

class JvtBridge {
  static create = (type) => {
    const _this = new JvtBridge();
    switch (type) {
      case 'ipcOn': _this._exposeOn(); break;
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