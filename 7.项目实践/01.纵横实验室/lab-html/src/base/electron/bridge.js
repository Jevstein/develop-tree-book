const { contextBridge, ipcRenderer } = require('electron/renderer')

class JvtBridge {
  static create = (type) => {
    let bridge = undefined;
    switch (type) {
      case 'ipcOn': bridge = new JvtBridgeOn(); break;
      default:
        console.error(`JvtBridge.create: invalid type(${type})!`);
        break;
    }

    bridge?.expose();
  }

  expose = () => {}
}

class JvtBridgeOn {
  expose = () => {
    contextBridge.exposeInMainWorld('JvtNativeAPI', {
      openFile: (data) => ipcRenderer.send('jvt-native-on', data)
    })
  }
}

// module.exports = {
//   JvtBridge,
//   JvtBridgeOn,
// };