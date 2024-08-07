class ElectronApiDemo {
  _iframeCommunicator = null;
  _electronApi = new JvtElectronApi();

  constructor(props) {

  }

  _send = (data) => {
    this._iframeCommunicator.send(data);
  }

  bind = (data) => {
    this._iframeCommunicator = data.communicator;
  }
}