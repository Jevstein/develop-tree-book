class IframeClientApi extends JvtIframeApi {
  static create(target) {
    return new IframeClientApi({
      name: 'iframe-client',
      target,
    });
  }

  constructor(props) {
    super(props);
  }

  //--------------------------- send: iframe => host --------------------------- 
  established = (data) => {
    const type = this._getType(new Error());
    this._send({ type, data });
  }

  openFile = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data }, 15000);
  }

  notifySysMsg = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data }, 15000);
  }

  execSql = async (data) => {
    const type = this._getType(new Error());
    return await this._exec({ type, data }, 15000);
  }

  //--------------------------- notice: host => iframe  --------------------------- 
  onWelcome = (data) => {
    alert(data.data);
  }
}