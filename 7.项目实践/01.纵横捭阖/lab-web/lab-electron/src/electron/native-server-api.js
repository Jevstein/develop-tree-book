
const { dialog } = require('electron/main')
const { JvtNativeApi } = require('./base/native/api')

class NativeServerApi extends JvtNativeApi {

  static create(win) {
    return new NativeServerApi({
      name: 'native-main',
      hostType: 'server',
      ipcType: 'ipcOnSingle',
      win,
    });
  }

  constructor(props) {
    super(props);
  }

  // 1.send: host => electron

  onOpenFile = async (data) => {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (!canceled) {
      const path = filePaths[0]
      // this._engine._win.webContents.send('jvt-native-on', path)
      return path;
    }
  }

  // 2、notice: electron => host => iframe

  welcome = (data) => {
    const type = this._getType(new Error());
    this._send({ type, data });// this._engine._win.webContents.send('jvt-native-on', { type, data });
  }
}

module.exports = {
  NativeServerApi,
};