
const { dialog } = require('electron/main')
const { JvtNativeApi } = require('./ipc/api')

class ElectronIpcApi extends JvtNativeApi {

  static create() {
    return new ElectronIpcApi({
      name: 'electron-main',
      hostType: 'server',
      ipcType: 'ipcOnSingle'
    });
  }

  constructor(props) {
    super(props);
  }

  // 1.send: host => electron

  onOpenFile = async (data) => {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
      return filePaths[0]
    }
  }

  // 2、notice: electron => host => iframe
}

module.exports = {
  ElectronIpcApi,
};