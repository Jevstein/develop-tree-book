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

// ------------------------------- 1、消息交互（不推荐） ------------------------------- 

// 消息类型
const NATIVE_TYPE_PING = 10000; // electron 回传


// ------------------------------- 2、API 调用方式（推荐） -------------------------------     

// 接口方法 - 基类
class JvtNativeApiAbstract {
  openFile = (data) => {

  }
}

// 接口方法 - 实现类
class JvtNativeApiCommunicator extends JvtNativeApiAbstract {
  _name = 'native-api';               // native api 名称
  _isOnPrefix = undefined;            // 在JvtNativeEngine中，是否开仅处理带on开头的函数: true=开, false=关, undefined=全部（默认）-效率较低

  _engine = null;                     // JvtNativeEngine
 _recvApiObject = undefined;          // 接收到的api列表

  constructor(props) {
    super(props);

    const {
      name,
      isOnPrefix,
      type,
      onRecv
    } = props;

    this._name = name;
    this._isOnPrefix = isOnPrefix;

    this._engine = new JvtNativeEngine({
      name: `${name}-engine`,
      type,
      receiver: this,
      onRecv
    });
  }

  onRecv = (data) => {
    console.error('JvtNativeApi.onRecv:', data);
  }

  _register = (apis) => {
    if (!apis) {
      this._recvApiObject = undefined;
      return;
    }

    if (typeof apis === 'function') {
      this._recvApiObject = { [apis.name]: apis };
      return;
    }

    if (typeof apis === 'object' && apis.length > 0) {
      apis.forEach((api) => {
        if (typeof api === 'function') {
          this._recvApiObject = {
          ...this._recvApiObject,
            [api.name]: api
          };
        }
      });
      return;
    }

    this._recvApiObject = {};
  }

  _send = (data, cb) => {
    if (!this._engine) {
      console.error('JvtNativeApi._send: communicator is not defined');
      return;
    }

    return this._engine.send(data, cb);
  }

  _exec = async (data, timeout) => {
    if (!this._engine) {
      console.error('JvtNativeApi._exec: communicator is not defined');
      return;
    }

    return await this._engine.exec(data, timeout);
  }

  _getType = (error) => {
    // const type1 = methodName.name;
    // const type2 = methodName.toString().match(/^function\s*([^\s(]+)/)[1];
    // const type3 = arguments.callee.name;
    return error?.stack?.match?.(/at\s+(.*)\s+\(/)?.[1]?.split('.')?.pop();
  }
}

// 接口方法 - 业务实现类（建议在业务层中继承该类后，再实现具体的业务逻辑
class JvtNativeApi extends JvtNativeApiCommunicator {
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