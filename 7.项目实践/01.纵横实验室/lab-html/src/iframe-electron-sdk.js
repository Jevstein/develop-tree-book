
// iframe 交互，并处理 Electron 调用
class IframeHostElectronApi extends JvtIframeApi {
  _electronApi = null;

  static create(target) {
    const electronApi = ElectronApi.create();

    const api = new IframeHostElectronApi({name: 'iframe-server-api'});
    const communicator = new JvtIframeCommunicator({
      name: 'iframe-server',
      target, //: document.getElementById('id-weblab-iframe').contentWindow,
      receiver: api,
      onRecv: (data) => {
        // console.log('[main] recv:', message);
        if (data.type === IFRAME_TYPE_PING) {
          return communicator.send({
            ...data,
            data: 'pong from host!'
          });
        }
      }
    });
    api.bind({ communicator });
    api.setElectronApi(electronApi);

    electronApi.setIframeElectronApi(api);
    return api;
  }

  constructor(props) {
    super(props);
  }

  setElectronApi = (api) => {
    this._electronApi = api;
  }

  //--------------------------- 1.receive: iframe => host -> electron => iframe  ---------------------------

  onOpenFile = async (data) => {
    let filePath = 'xxx/xxx/xxx';
    // const filePath = await window.electronAPI.openFile()

    try {
      filePath = await this._electronApi?.openFile();
    } catch (error) {
      console.error(error);
    }

    this._send({
      ...data,
      data: filePath
    });
  }

  //--------------------------- 2.send: host => iframe  ---------------------------

}

// electron 交互
class ElectronApi extends JvtNativeApi {
  _iframeElectronApi = null;

  static create() {
    const api = new ElectronApi({name: 'electron-renderer-api'});
    const communicator = new JvtNativeCommunicatorIpcRenderer({
      receiver: api,
      // onRecv: (data) => {
      //   // console.log('[main] recv:', message);
      // }
    });
    api.bind({ communicator });
    return api;
  }

  constructor(props) {
    super(props);
  }

  setIframeElectronApi = (api) => {
    this._iframeElectronApi = api;
  }

  //--------------------------- 1.send: host => electron  ---------------------------

  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data });
  }

  //--------------------------- 2、notice: electron => host => iframe  ---------------------------
}