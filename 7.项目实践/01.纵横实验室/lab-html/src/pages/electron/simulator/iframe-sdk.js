class IframeClientApi extends JvtIframeApi {
  static create() {
    const api = new IframeClientApi({name: 'iframe-client-api'});
    const communicator = new JvtIframeCommunicator({
      name: 'iframe-client',
      target: window.parent,
      receiver: api,
      // onRecv: (message) => {
      //   console.log('[child] recv:', message);
      // }
    });
    api.bind({ communicator });
    return api;
  }

  constructor(props) {
    super(props);
  }

  //--------------------------- send: iframe => host --------------------------- 
  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data }, 15000);
  }

  //--------------------------- notice: host => iframe  --------------------------- 
  // onOpenFile = (data) => {
  //
  // }
}