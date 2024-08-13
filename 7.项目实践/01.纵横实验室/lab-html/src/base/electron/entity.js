/**
 * @created : 2024/08/13
 * @author  : Jevstein
 * @desc    : native-entity - 用于客户端（Electron）之间通信的实体
 */

const NATIVE_SINGLE_ON = 'jvt-native-on';

// 基类
class JvtNativeEntity {
  _type = '';
  _target = null;
  _onDispatch = undefined;

  static create = (type) => {
    switch (type) {
      case 'ipcMainOn':
        return new JvtNativeEntityIpcMainOn({
          type,
          onDispatch: this._dispatch,
        });
      case 'ipcRendererOn':
        return new JvtNativeEntityIpcRendererOn({
          type,
          onDispatch: this._dispatch,
        });
      default:
        console.error(`JvtNativeEngine._createEntity: invalid type(${type})!`);
        return null;
    }
  }

  constructor(props) {
    const {
      type,
      onDispatch
    } = props;

    this._type = type;
    this._onDispatch = onDispatch;
  }

  _getTarget = () => {
    if (!_target) {
      console.error('not found _target!');
    }

    return _target;
  }

  send = (data) => { 
    console.log(`JvtNativeEntity.send:`, data);
  }

  listen = (option) => { 
    console.log(`JvtNativeEntity.listen:`, option);
  }

  removeListen = (option) => {
    console.log(`JvtNativeEntity.removeListen:`, option);
  }
}

// ipcMain-on
class JvtNativeEntityIpcMainOn extends JvtNativeEntity {
  constructor(props) {
    super(props);
    this._target = require('electron').ipcMain;
  }

  send = (data) => { 
    const target = this._getTarget();
    target.emit(NATIVE_SINGLE_ON, data);
  }

  listen = (option) => {
    this._getTarget()?.on(NATIVE_SINGLE_ON, this._onDispatch);
  }

  removeListen = (option) => {
    this._getTarget()?.removeAllListeners(NATIVE_SINGLE_ON);
  }
}

// ipcRenderer-on
class JvtNativeEntityIpcRendererOn extends JvtNativeEntity {
  constructor(props) {
    super(props);
  }

  _getTarget = () => {
    if (!window.NativeAPI) {
      console.error('not found window.NativeAPI!');
    }
    return window.NativeAPI;
  }

  send = (data) => { 
    const target = this._getTarget();
    if (!target || !target[data?.type]) {
      console.error(`failed to send as invalid target:`, data, target);
      return;
    }
    target[data.type](data);
  }

  listen = (option) => {
    // const target = this._getTarget();
    // target.on(NATIVE_SINGLE_ON, this._onDispatch);
  }
}

// module.exports = {
//   JvtNativeIpcMain,
//   JvtNativeIpcRenderer,
// };