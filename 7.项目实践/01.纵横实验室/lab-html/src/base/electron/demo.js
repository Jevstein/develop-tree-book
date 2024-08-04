class ElectronApiDemo {
  _iframeCommunicator = null;
  _electronApi = new JvtElectronApi();

  _recvMap = {
    [IFRAME_TYPE_ELECTRON_SIMPLE]: (data) => this._handleSimple(data),
  }

  constructor(props) {


  }

  _handleSimple = (data) => {
    console.log(data);

    // this._electronApi.xxx();


    this._send({
      ...data,
      data: 'hello from electron',
    });
  }

  _send = (data) => {
    this._iframeCommunicator.send(data);
  }

  bindCommunicator = (communicator) => {
    this._iframeCommunicator = communicator;
  }

  onRecv = (data) => {
    const handler = this._recvMap[data?.type];
    if (handler) {
      handler(data);
      return;
    }

    console.error(`Unknown message: `, data);
  }
}