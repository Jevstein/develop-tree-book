/**
 * @created : 2024/08/07
 * @author  : Jevstein
 * @desc    : native-communicator - 用于客户端（Electron）之间通信的消息交互器
 */

class JvtNativeCommunicator {
  _name = '';         // native名称
  _target = null;     // 目标native
  _receiver = null;   // 接收方对象-JvtNativeReceiver
  _onRecv = null;     // 接收消息回调函数

  _seq = 0;           // 用于生成序列号
  _map = new Map();   // 用于存储回调函数

  constructor(props) {
    const {
      name = 'native-server',
      target = document.getElementById('id-weblab-native').contentWindow,
      onRecv = null,
      receiver = null,
    } = props;

    this._name = name;
    this._target = target;
    this._receiver = receiver;
    this._onRecv = onRecv;

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

    if (this._receiver) {
      const func = this._receiver[event.data.type];
      if (func) {
        func(event.data);
      } else{
        this._receiver.onRecv?.(event.data);
      }
    }
  }

  /**
   * 发送消息
   * @param {*} data : 消息数据, 必须满足./protocol.js中的NativeData格式
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