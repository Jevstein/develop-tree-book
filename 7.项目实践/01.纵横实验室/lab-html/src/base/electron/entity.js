/**
 * @created : 2024/08/13
 * @author  : Jevstein
 * @desc    : native-entity - 用于客户端（Electron）之间通信的实体
 */

const JVT_NATIVE_ON = 'jvt-native-on';

// 基类
class JvtNativeEntity {
  _hostType = 'client'; // client、server
  _ipcType = 'ipcOnSingle'; // ipcOnSingle、ipcOnMutil
  _target = null;
  _onDispatch = undefined;

  static create = (props) => {
    const isServer = props.hostType ==='server';
    switch (props.ipcType) {
      case 'ipcOnSingle':     return isServer ? new JvtNativeIpcOnSingleServer(props) : new JvtNativeIpcOnSingleClient(props);
      // case 'ipcOnMutil':      return isServer ? new JvtNativeIpcOnMutilServer(props) : new JvtNativeIpcOnMutilClient(props);
      default:
        console.error(`JvtNativeEngine._createEntity: invalid type(${props.ipcType})!`);
      break;
    }
    return null;
  }

  constructor(props) {
    const {
      hostType, 
      ipcType,
      onDispatch
    } = props;

    this._hostType = hostType;
    this._ipcType = ipcType;
    this._onDispatch = onDispatch;
  }

  _getTarget = () => {
    if (!this._target) { console.error('not found _target!'); }
    return this._target;
  }

  send = (data) => { console.log(`JvtNativeEntity.send:`, data); }

  listen = (option) => {  console.log(`JvtNativeEntity.listen:`, option); }

  removeListen = (option) => {  console.log(`JvtNativeEntity.removeListen:`, option); }
}

//------------------ ipcMain/ipcRenderer on ------------------
class JvtNativeIpcOnSingleServer extends JvtNativeEntity {
  constructor(props) {
    super(props);
    this._target = require('electron').ipcMain;
  }

  send = (data) => { 
    // TODO: 待实现
    const target = this._getTarget();
    target.emit(JVT_NATIVE_ON, data);
  }

  listen = (option) => {
    // this._getTarget()?.on(JVT_NATIVE_ON, this._onDispatch);
    this._getTarget()?.handle(JVT_NATIVE_ON, this._onDispatch);
  }

  removeListen = (option) => {
    this._getTarget()?.removeAllListeners(JVT_NATIVE_ON);
  }
}

class JvtNativeIpcOnSingleClient extends JvtNativeEntity {
  constructor(props) {
    super(props);
  }

  _getTarget = () => {
    if (!window.JvtNativeAPI) {
      console.error('window.JvtNativeAPI is empty!');
    }

    // window.JvtNativeAPI.on(JVT_NATIVE_ON, (data) => {
    //   console.log(`JvtNativeIpcOnSingleClient.on:`, data);
    // });
    return window.JvtNativeAPI;
  }

  send = async (data, option=null) => { 
    const { 
      isWait = true,
      isNativeApi = true,
    } = option || {};

    const target = this._getTarget();

    if (isNativeApi) {
      if (isWait) {
        return await target.nativeApi(data);
      }
      target.nativeApi(data);
      return;
    }

    if (!target || !target[data?.type]) {
      console.error(`failed to send as invalid target:`, data, target);
      return;
    }
    if (isWait) {
      return await target[data.type](data.data);
    }
    target[data.type](data);
  }

  listen = (option) => {
    // const target = this._getTarget();
    // target.on(JVT_NATIVE_ON, this._onDispatch);
  }
}

// module.exports = {
//   JvtNativeEntity,
//   JvtNativeIpcOnSingleServer,
//   JvtNativeIpcOnSingleClient
// };