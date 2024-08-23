
// iframe 交互，并处理 Electron 调用
class IframeServerApi extends JvtIframeApi {
  _nativeApi = null;

  _isEstablished = false;
  _welcomeContent = '';

  static create(target) {
    const iframeApi = new IframeServerApi({
      name: 'iframe-server',
      target,
      onRecv: (data) => {
        // console.log('[main] recv:', message);
        if (data.type === IFRAME_TYPE_PING) {
          return iframeApi._send({
            ...data,
            data: 'pong from host!'
          });
        }
      }
    });
    const electronApi = NativeClientApi.create();
    electronApi.setIframeApi(iframeApi);
    iframeApi.setNativeApi(electronApi);
    return iframeApi;
  }

  constructor(props) {
    super(props);
  }

  setNativeApi = (api) => {
    this._nativeApi = api;
  }

  // 1.receive: iframe => host -> electron => iframe
  onEstablished = (data) => {
    this._isEstablished = true;
    this._welcomeContent && this.welcome(this._welcomeContent);
  }

  onNotifySysMsg = async (data) => {
    const { title, body, message } = data.data;

    new window.Notification(title, { body }).onclick = () => { 
      alert(message) 
    }

    this._send({
      ...data,
      data: {
        errMsg: this._nativeApi?.isValid() ? '' : '请在Electron环境下运行!'
      }
    });
  }

  onOpenFile = async (data) => {
    let filePath = 'invalid file path!';

    if (this._nativeApi?.isValid() ) {
      try {
        filePath = await this._nativeApi?.openFile();
      } catch (error) {
        console.error(error);
      }
    }

    this._send({
      ...data,
      data: {
        filePath,
        errMsg: this._nativeApi?.isValid() ? '' : '请在Electron环境下运行!'
      }
    });
  }

  // 2.send: host => iframe
  welcome = (data) => {
    this._welcomeContent = data;
    if (this._isEstablished) {
      const type = this._getType(new Error());
      this._send({ type, data });
    }
  }
}

// electron 交互
class NativeClientApi extends JvtNativeApi {
  _iframeApi = null;

  static create() {
    return new NativeClientApi({
      name: 'native-renderer',
      hostType: 'client',
      ipcType: 'ipcOnSingle'
    });
  }

  constructor(props) {
    super(props);
  }

  setIframeApi = (api) => {
    this._iframeApi = api;
  }

  isValid = () => {
    return window.JvtNativeAPI ? true : false;
  }

  // 1.send: host => electron

  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data }, {isWait: true});
  }

  // 2、notice: electron => host => iframe
  onWelcome = (data) => {
    console.log('[renderer] onWelcome:', data);
    this._iframeApi?.welcome(data.data);
  }
}