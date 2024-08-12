
/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @version : 1.0.0
 * @desc    : iframe-protocol - 消息协议
 *  其中，iframe交互的数据格式，定义如下：
 *  {
 *    seq: '0',                // 序列号（流水号）：默认不传，由JvtIframeCommunicator内部生成
 *    source: 'iframe',        // iframe来源-固定
 *    type: IFRAME_TYPE_PING,  // 消息类型
 *    data: xxx,               // 消息内容
 *  }
 */

// ------------------------------- 1、消息交互（不推荐） ------------------------------- 

// 消息类型
const IFRAME_TYPE_PING = 10000; // iframe 回传

// ------------------------------- 2、API 调用方式（推荐） -------------------------------     

// 接口方法 - 基类
class JvtIframeApiAbstract {
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

  onPing = (data) => {
    // console.error('JvtIframeApi.onPing:', data);
  }
}

// 接口方法 - 实现类
class JvtIframeCommunicator extends JvtIframeApiAbstract {
  _name = 'iframe-api';               // iframe api 名称
  _isOnPrefix = undefined;            // 在JvtIframeEngine中，是否开仅处理带on开头的函数: true=开, false=关, undefined=全部（默认）-效率较低

  _engine = null;                     // JvtIframeEngine
 _recvApiObject = undefined;          // 接收到的api列表

  constructor(props) {
    super(props);

    const {
      name,
      target,
      isOnPrefix,
      onRecv
    } = props;

    this._name = name;
    this._isOnPrefix = isOnPrefix;

    this._engine = new JvtIframeEngine({
      name: `${name}-engine`,
      target,
      receiver: this,
      onRecv
    });
  }

  onRecv = (data) => {
    console.warn('JvtIframeApi.onRecv:', data);
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
      console.error('JvtIframeApi._send: engine is not defined');
      return;
    }

    return this._engine.send(data, cb);
  }

  _exec = async (data, timeout) => {
    if (!this._engine) {
      console.error('JvtIframeApi._exec: engine is not defined');
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
 
// 接口方法 - 业务实现类（建议在业务层中继承该类后，再实现具体的业务逻辑）
class JvtIframeApi extends JvtIframeCommunicator {
  constructor(props) {
    super({ ...props, isOnPrefix: true });
  }

  // ====== 业务调用接口：用于发送方发送 ======
  ping = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }

  // ====== 业务回调接口：用于接收方接收 ======
  onPing = (data) => {
    this._send({
      ...data,
      data: "pong"
    });
  }
}