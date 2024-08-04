/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @desc    : iframe-communicator - 用于iframe之间通信的消息交互器
 */

class JvtIframeCommunicator {
  _target = null;     // 目标iframe
  _onRecv = null;     // 接收消息
  _name = '';         // iframe名称

  _seq = 0;           // 用于生成序列号
  _map = new Map();   // 用于存储回调函数

  constructor(props) {
    const {
      onRecv = null,
      target = document.getElementById('id-weblab-iframe').contentWindow,
      name = 'iframe-server'
    } = props;

    this._target = target;
    this._onRecv = onRecv;
    this._name = name;

    this.start();
  }

  /**
   * createSeq - 生成序列号
   * @returns {string} : 序列号
   */
  _createSeq = () => {
    if (this._seq >= 9007199254740992) {
      this._seq = 0;
    }
    return `${this._name}_${++this._seq}_${new Date().getTime()}`;
  }

  /**
   * 消息分发器
   * @param {*} event 
   */
  _dispatch = (event) => {
    console.log(`[${this._name}] recv:`, event.data);

    if (event.data.seq && this._map.has(event.data.seq)) {
      const cb = this._map.get(event.data.seq);
      cb && cb(event.data);
      this._map.delete(event.data.seq);
      return;
    }

    this._onRecv && this._onRecv(event.data);
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
  get = (data) => {
    return new Promise((resolve) => {
      this.send(data, (res) => {
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