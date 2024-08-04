class ElectronCommulator {
  _iframeCommunicator = null;

  _recvMap = {
    [IFRAME_TYPE_ELECTRON_SIMPLE]: (data) => this._handleSimple(data),
  }

  constructor(props) {


  }

  _handleSimple = (data) => {
    console.log(data);
  }

  bindIframeCommunicator = (communicator) => {
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