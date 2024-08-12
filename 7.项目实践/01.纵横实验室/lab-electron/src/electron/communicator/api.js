/**
 * @created : 2024/08/07
 * @author  : Jevstein
 * @version : 1.0.0
 * @desc    : ipcMain-ipcRenderer通信接口定义
 *  其中，交互数据格式，定义如下：
 *  {
 *    seq: '0',                // 序列号（流水号）：默认不传，由JvtNativeCommunicator内部生成
 *    type: NATIVE_TYPE_PING,  // 消息类型
 *    data: xxx,               // 消息内容
 *  }
 */

class JvtNativeApi {
  openFile = (data) => {

  }
}

// 接口方法
class JvtNativeApiEngine extends JvtNativeApi {
  _communicator = null; // JvtNativeCommunicator

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
    console.error('JvtNativeApi.onRecv:', data);
  }

  _send = (data, cb) => {
    if (!this._communicator) {
      console.error('JvtNativeApi._send: communicator is not defined');
      return;
    }

    return this._communicator.send(data, cb);
  }

  _exec = async (data, timeout) => {
    if (!this._communicator) {
      console.error('JvtNativeApi._exec: communicator is not defined');
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
class JvtNativeCaller extends JvtNativeApiEngine {
  constructor(props) {
    super(props);
  }

  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }
}

// 接口方法 - 接收方
class JvtNativeReceiver extends JvtNativeApiEngine {
  constructor(props) {
    super(props);
  }

  openFile = (data) => {
    this._send({
      ...data,
      data: "pong"
    });
  }
}