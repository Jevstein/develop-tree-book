
// iframe 交互，并处理 Electron 调用
class IframeServerApi extends JvtIframeApi {
  _nativeApi = null;

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
    const electronApi = NativeApi.create();
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

  onOpenFile = async (data) => {
    let filePath = 'xxx/xxx/xxx';
    try {
      filePath = await this._nativeApi?.openFile();
    } catch (error) {
      console.error(error);
    }

    this._send({
      ...data,
      data: filePath
    });
  }

  // 2.send: host => iframe

}

// electron 交互
class NativeApi extends JvtNativeApi {
  _iframeApi = null;

  static create() {
    return new NativeApi({
      name: 'electron-renderer',
      type: 'ipcRendererOn'
    });
  }

  constructor(props) {
    super(props);
  }

  setIframeApi = (api) => {
    this._iframeApi = api;
  }

  // 1.send: host => electron

  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }

  // 2、notice: electron => host => iframe
}