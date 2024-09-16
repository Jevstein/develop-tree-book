
const path = require('node:path');// 导入 Node.js 的 path 模块
const { app, dialog } = require('electron/main')
const { JvtNativeApi } = require('../base/communicator/native/api')
const { SqlBuilder } = require('./sql-builder');

class NativeServerApi extends JvtNativeApi {

  _sqlBuilder = null;

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

  onOpenFile = async (result) => {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (!canceled) {
      const path = filePaths[0]
      // this._engine._win.webContents.send('jvt-native-on', path)
      return path;
    }
  }

  onExecSql = async (result) => {
    if (!this._sqlBuilder) {
      let filePath = 'userdata.db';//:memory:
      if (app.isPackaged) {
        const exeDir = path.dirname(app.getPath('exe'));
        filePath = path.join(exeDir, '..', 'resources', filePath);
      } else {
        filePath = path.join(__dirname, '..', '..', 'out', filePath);
      }

      this._sqlBuilder = SqlBuilder.create();
      const result = await this._sqlBuilder.connect(filePath);
      if (result?.ret?.code !== 0) {
        this._sqlBuilder = null;
        return;
      }
    }

    const sqlResults = await this._sqlBuilder.debugger(result.data);

    this._send({
      ...result,
      data: sqlResults
    });
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