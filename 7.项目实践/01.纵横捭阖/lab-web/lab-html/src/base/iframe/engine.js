/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @desc    : iframe-engine - 用于iframe之间通信的消息交互器
 */

const IFRAME_SOURCE = 'iframe';

class JvtIframeEngine {
  _name = '';               // iframe名称
  _target = null;           // 目标iframe
  _onRecv = null;           // 接收消息回调函数
  _receiver = null;         // 接收方对象-JvtIframeApi

  _seq = 0;           // 用于生成序列号
  _map = new Map();   // 用于存储回调函数

  constructor(props) {
    const {
      name = 'iframe-server',
      target = document.getElementById('id-weblab-iframe').contentWindow,
      onRecv = null,
      receiver = null,
    } = props;

    this._name = name;
    this._target = target;
    this._onRecv = onRecv;
    this._receiver = receiver;

    this.start();
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
   * @param {*} event event.data 必须满足{seq, source, type, data}的IframeData格式
   */
  _dispatch = (event) => {
    console.log(`[${this._name}] recv:`, event.data);

    if (event.data?.source && event.data.source !== IFRAME_SOURCE) {
      console.warn(`[${this._name}] source error:`, event.data.source);
      return;
    }

    if (event.data.seq && this._map.has(event.data.seq)) {
      const cb = this._map.get(event.data.seq);
      cb && cb(event.data);
      this._map.delete(event.data.seq);
      return;
    }

    this._onRecv && this._onRecv(event.data);

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
   * @param {*} data : 消息数据, 必须满足./protocol.js中的IframeData格式
   * @param {*} cb :回调函数, 接收消息的响应数据
   */
  send = (data, cb = null) => {
    if (!data.seq) {
      data.seq = this._createSeq();
    }

    if (!data.source) {
      data.source = IFRAME_SOURCE;
    }

    console.log(`[${this._name}] send:`, data);
    this._target?.postMessage(data, '*');

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
   * 开始监听消息: 只接受指定域名下的消息
   */
  start = () => {
    window.addEventListener('message', this._dispatch);
  }

  /**
   * 停止监听消息
   */
  stop = () => {
    window.removeEventListener('message', this._dispatch);
  }
}