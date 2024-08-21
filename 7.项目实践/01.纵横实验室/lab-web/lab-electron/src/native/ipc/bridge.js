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
      // nativeApi: (data) => ipcRenderer.send(JVT_NATIVE_ON, data)
      // nativeApi: (data) => ipcRenderer.invoke(JVT_NATIVE_ON, data),
      send: (data) => ipcRenderer.send(JVT_NATIVE_ON, data),
      invoke: (data) => ipcRenderer.invoke(JVT_NATIVE_ON, data),
      on: (option, func) => {
        console.log(`JvtBridge._exposeOn: listen`, option);
        ipcRenderer.on(JVT_NATIVE_ON, (event, data) => {
          console.log(`JvtBridge._exposeOn: received data from native!`, event, data);
          func(event, data);
        });
      },
      // send: (channel, data) => {
      //   // 白名单通道
      //   let validChannels = ['toMain'];
      //   if (validChannels.includes(channel)) {
      //       ipcRenderer.send(channel, data);
      //   }
      // },
      // receive: (channel, func) => {
      //   let validChannels = ['fromMain'];
      //   if (validChannels.includes(channel)) {
      //       // 过滤通道，只接受预定义的通道
      //       ipcRenderer.on(channel, (event, ...args) => func(...args));
      //   }
      // }
    })

    // ipcRenderer.on(JVT_NATIVE_ON, (event, data) => {
    //   console.log(`JvtBridge._exposeOn: received data(${data}) from native!`);
    //   // event.sender.send(JVT_NATIVE_ON, data)
    //   // window.JvtNativeApi.on(data)
    // })
  }

  _exposeOnPort = () => {
  }
}

module.exports = {
  JvtBridge,
};