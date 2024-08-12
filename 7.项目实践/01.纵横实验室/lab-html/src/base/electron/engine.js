/**
 * @created : 2024/08/07
 * @author  : Jevstein
 * @desc    : native-engine - 用于客户端（Electron）之间通信的消息交互器
 */

const NATIVE_SOURCE = 'native';
const NATIVE_SINGLE_ON = 'jvt-native-on';

/**
 * @desc : 用于客户端（Electron）之间通信的实体-基类
 */
class JvtNativeEntity {
  _type = '';
  _target = null;
  _onDispatch = undefined;

  constructor(props) {
    const {
      type,
      onDispatch
    } = props;

    this._type = type;
    this._onDispatch = onDispatch;
  }

  getTarget = () => {
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

/**
 * @desc : 用于客户端（Electron）之间通信的实体-ipcMain-on
 */
class JvtNativeEntityIpcMainOn extends JvtNativeEntity {
  constructor(props) {
    super(props);
    this._target = require('electron').ipcMain;
  }

  send = (data) => { 
    const target = this.getTarget();
    target.emit(NATIVE_SINGLE_ON, data);
  }

  listen = (option) => {
    this.getTarget()?.on(NATIVE_SINGLE_ON, this._onDispatch);
  }

  removeListen = (option) => {
    this.getTarget()?.removeAllListeners(NATIVE_SINGLE_ON);
  }
}

/**
 * @desc : 用于客户端（Electron）之间通信的实体-ipcMain-on
 */
class JvtNativeEntityIpcRendererOn extends JvtNativeEntity {
  constructor(props) {
    super(props);
  }

  getTarget = () => {
    if (!window.NativeAPI) {
      console.error('not found window.NativeAPI!');
    }
    return window.NativeAPI;
  }

  send = (data) => { 
    const target = this.getTarget();
    if (!target || !target[data?.type]) {
      console.error(`failed to send as invalid target:`, data, target);
      return;
    }
    target[data.type](data);
  }

  listen = (option) => {
    // const target = this.getTarget();
    // target.on(NATIVE_SINGLE_ON, this._onDispatch);
  }
}

/**
 * @desc : 用于客户端（Electron）之间通信的消息交互器
 */
class JvtNativeEngine {
  _name = 'native-server' | 'native-client';      // native名称
  _onRecv = null;                                 // 接收消息回调函数
  _receiver = null;                               // 接收方对象-JvtNativeReceiver
 
  _entity = null;                                 // 实体对象-JvtNativeEntity
  _seq = 0;                                       // 用于生成序列号
  _map = new Map();                               // 用于存储回调函数

  constructor(props) {
    const {
      name,
      type,   // 实体类型: 'ipcMainOn' | 'ipcRendererOn'
      receiver,
      onRecv,
    } = props;

    this._name = name;
    this._receiver = receiver;
    this._onRecv = onRecv;
    this._entity = this._createEntity(type);

    this.start();
  }

  _createEntity = (type) => {
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

  /**
   * 生成序列号
   * @returns {string} : 序列号
   */
  _createSeq = () => {
    if (this._seq >= 9007199254740992) {
      this._seq = 0;
    }
    return `${this._name}_${++this._seq}_${new Date().getTime()}`;
  }

  /**
   * 首字母大写
   * @param {string} funcName 
   * @returns {string} : 首字母大写的字符串
   */
 _toUpperCaseFirstLetter(funcName) {
  if (typeof(funcName) !== 'string') {
    return funcName?.toString() || '';
  }

  return funcName.replace(/^./, function(match) {
    return match.toUpperCase();
  });
}
    
  /**
   * 消息分发器
   * @param {*} event 
   * @param {*} data 必须满足{seq, source, type, data}的NativeData格式
   */
  _dispatch = (event, data) => {
    console.log(`[${this._name}] recv:`, event, data);

    if (data.seq && this._map.has(data.seq)) {
      const cb = this._map.get(data.seq);
      cb && cb(data);
      this._map.delete(data.seq);
      return;
    }

    this._onRecv && this._onRecv(data);

    if (this._receiver && event.data.type) {
      let func = undefined;
      let isOnPrefix = this._receiver._isOnPrefix ? true : false;

      const recvApiObject = this._receiver._recvApiObject || this._receiver ;

      do {
        if (isOnPrefix) {
          const funcName = `on${this._toUpperCaseFirstLetter(event.data.type)}`
          func = recvApiObject[funcName];
          break;
        }

        func = recvApiObject[event.data.type];
        if (!func && (typeof(this._receiver._isOnPrefix) === 'undefined')) {
          isOnPrefix = true;
          continue;
        }
      } while(0);

      if (func) {
        func(event.data);
        return;
      }
      
      this._receiver.onRecv?.(event.data);
    }
  }

  /**
   * 发送消息
   * @param {*} data : 消息数据, 必须满足{seq, type, data}的NativeData格式
   * @param {*} cb :回调函数, 接收消息的响应数据
   */
  send = (data, cb = null) => {
    if (!data.seq) {
      data.seq = this._createSeq();
    }

    if (!data.source) {
      data.source = NATIVE_SOURCE;
    }

    console.log(`[${this._name}] send:`, data);
    // this._target?.postMessage(data, '*');

    if (!this._entity) {
      console.error(`failed to send message as invalid entity type(${this._Type})!`);
      return;
    }

    this._entity.send(data);

    if (cb) {
      this._map.set(data.seq, cb);
    }
  }

  /**
   * 发送消息并等待响应
   * @param {*} data 
   * @returns 
   */
  exec = async (data, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);

        if (data.seq && this._map.has(data.seq)) {
          this._map.delete(data.seq);
        }

        const err = `timeout(${data?.type}): The other party did not respond to the request！`
        reject(err);
      }, timeout);

      this.send(data, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
    });
  }

  /**
   * 开始监听
   */
  start = () => {
    if (!this._entity) {
      console.error(`failed to start as invalid entity type(${this._Type})!`);
      return;
    }
    this._entity.listen();
  }

  /**
   * 停止监听
   */
  stop = () => {
    if (!this._entity) {
      console.error(`failed to start as invalid entity type(${this._Type})!`);
      return;
    }
    this._entity.removeListen();
  }
}

// module.exports = {
//   JvtNativeIpcMain,
//   JvtNativeIpcRenderer,
// };