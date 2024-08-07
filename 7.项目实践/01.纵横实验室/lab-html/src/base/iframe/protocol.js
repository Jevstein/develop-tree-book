
/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @version : 1.0.0
 * @desc    : iframe-protocol - 消息协议
 *  其中，iframe交互的数据格式，定义如下：
 *  {
 *    seq: '0',                // 序列号（流水号）：默认不传，由JvtIframeCommunicator内部生成
 *    type: IFRAME_TYPE_PING,  // 消息类型
 *    data: xxx,               // 消息内容
 *  }
 */

// 消息类型
const IFRAME_TYPE_PING = 10000; // iframe 回传

// ------------------------------- API 调用方式 -------------------------------     

class JvtIframeApi {
  /**
   * ping 方法
   * @param {*} data {
   *    no: '123',
   * }
   * @returns {*} {
   *    name: 'xxx',
   *    age: 18,
   * }
   */
  ping = (data) => {
    return {};
  }
}

// 接口方法
class JvtIframeApiEngine extends JvtIframeApi {
  _communicator = null; // JvtIframeCommunicator

  constructor(props) {
    super(props);
    this.bind(props);
  }

  bind = (props) => {
    if (!props) {
      return;
    }

    const { communicator } = props;
    this._communicator = communicator;
  }

  onRecv = (data) => {
    console.error('JvtIframeApi.onRecv:', data);
  }

  _send = (data, cb) => {
    if (!this._communicator) {
      console.error('JvtIframeApi._send: communicator is not defined');
      return;
    }

    return this._communicator.send(data, cb);
  }

  _exec = async (data, timeout) => {
    if (!this._communicator) {
      console.error('JvtIframeApi._exec: communicator is not defined');
      return;
    }

    return await this._communicator.exec(data, timeout);
  }

  _getType = (error) => {
    // const type1 = methodName.name;
    // const type2 = methodName.toString().match(/^function\s*([^\s(]+)/)[1];
    // const type3 = arguments.callee.name;
    return error?.stack?.match?.(/at\s+(.*)\s+\(/)?.[1]?.split('.')?.pop();
  }
}

// 接口方法 - 调用方
class JvtIframeCaller extends JvtIframeApiEngine {
  constructor(props) {
    super(props);
  }

  ping = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }
}

// 接口方法 - 接收方
class JvtIframeReceiver extends JvtIframeApiEngine {
  constructor(props) {
    super(props);
  }

  ping = (data) => {
    this._send({
      ...data,
      data: "pong"
    });
  }
}