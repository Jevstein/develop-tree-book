/**
 * @created : 2024/08/07
 * @author  : Jevstein
 * @version : 1.0.0
 * @desc    : ipcMain-ipcRenderer通信接口定义
 *  其中，交互数据格式，定义如下：
 *  {
 *    seq: '0',                // 序列号（流水号）：默认不传，由JvtNativeCommunicator内部生成
 *    source: 'native',        // native来源-固定
 *    type: NATIVE_TYPE_PING,  // 消息类型
 *    data: xxx,               // 消息内容
 *  }
 */

// ------------------------------- API 调用方式 -------------------------------  
class JvtNativeApiAbstract {
  openFile = (data) => {

  }
}

// 接口方法
class JvtNativeApiEngine extends JvtNativeApiAbstract {
  _isOnPrefix = undefined;      // 在JvtNativeCommunicator中，是否开仅处理带on开头的函数: true=开, false=关, undefined=全部（默认）-效率较低
  // _recvApis = undefined;     // 接收到的api列表
  _communicator = null;         // JvtNativeCommunicator
  _name = '';

  constructor(props) {
    super(props);

    const {
      isOnPrefix,
      // recvApis,
      communicator, 
      name 
    } = props;

    this._isOnPrefix = isOnPrefix;
    // this._recvApis = recvApis;
    this._communicator = communicator;
    this._name = name;
  }

  bind = (props) => {
    if (!props) {
      return;
    }

    const { 
      communicator, 
      name 
    } = props;

    if (communicator) { this._communicator = communicator };
    if (name) { this._name = name };
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

// ------------------------------- API 调用方式 - 业务继承接口 -------------------------------

// 接口方法 - api(推荐使用)
class JvtNativeApi extends JvtNativeApiEngine {
  constructor(props) {
    super({ ...props, isOnPrefix: true });
  }

  // ====== 业务调用接口：用于发送方发送 ======
  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }

  // ====== 业务回调接口：用于接收方接收 ======
  onOpenFile = (data) => {
    this._send({
      ...data,
      data: "pong"
    });
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
    super({ ...props, isOnPrefix: false });
  }

  openFile = (data) => {
    this._send({
      ...data,
      data: "pong"
    });
  }
}