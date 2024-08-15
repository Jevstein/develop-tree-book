
const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')

import { JvtNativeApi } from './ipc/api'

export class ElectronIpcApi extends JvtNativeApi {

  static create() {
    return new ElectronIpcApi({
      name: 'electron-main',
      type: 'ipcMainOn'
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