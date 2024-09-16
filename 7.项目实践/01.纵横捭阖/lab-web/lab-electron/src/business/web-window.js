/**
 * @created : 2024/08/23
 * @author  : Jevstein
 * @version : 1.0
 * @desc    : 管理 electron web窗口
 * @history :
 *  - 2024/07/25 Jevstein 创建
 */

const path = require('node:path');// 导入 Node.js 的 path 模块
const { app, BrowserWindow } = require('electron/main');
const { NativeServerApi } = require( './native-server-api');


class WebWindow {
  _browserWindow = null;

  static create() {
    return new WebWindow();
  }

  constructor() {
    this._browserWindow = this._createBrowserWindow(2);
  }

  getBrowserWindow = () => {
    return this._browserWindow;
  }

  _createWindowSimple = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });

    // 1) 加载文件
    win.loadFile('../index.html');
    // win.loadFile(path.resolve(__dirname,'src/index.html'))
    // win.loadFile('./../lab-html/src/index.html')
    // 2)加载URL
    // win.loadURL('file:///Users/yiwenqiang/Desktop/studio/jvtstudio/develop-tree-book/7.%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5/01.%E7%BA%B5%E6%A8%AA%E5%AE%9E%E9%AA%8C%E5%AE%A4/lab-html/src/index.html')

    // // 打开开发调试工具
    // win.webContents.openDevTools()

    // // 当 window 被关闭，这个事件会被发出
    // win.on("closed", function () {
    //   // 取消引用 window 对象，如果你的应用支持多窗口的话，
    //   // 通常会把多个 window 对象存放在一个数组里面，但这次不是
    //   win = null;
    // })
  }

  _createWindowLabHtml = () => {
    let filePath = '';
    if (app.isPackaged) {
      const exeDir = path.dirname(app.getPath('exe'));
      filePath = path.join(exeDir, '..', 'resources', 'lab-html', 'src', 'index.html');
    } else {
      filePath = path.join(__dirname, '..', '..', '..', 'lab-html', 'src', 'index.html');
    }

    const win = new BrowserWindow({
      width: 1800,
      height: 1600,
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload.js'),
        sandbox: false, // 开启沙箱模式: 若无此项，preload.js 脚本将无法访问 Node.js 环境(从而报错Error: module not found: ./base/communicator/native/bridge)
        // nodeIntegration: true,
        // contextIsolation: false, // 如果需要在渲染进程中使用 Electron 的模块，则需要设置为 false
      },
    });
    win.loadFile(filePath);
    win.webContents.openDevTools();
    return win;
  }

  _createBrowserWindow = (type) => {
    const wins = {
      1: this._createWindowSimple,
      2: this._createWindowLabHtml,
    };

    const win = wins[type]?.();
    if (!win) {
      console.error('failed to create window:', type);
      return;
    }

    const api = NativeServerApi.create(win); // ipcMain.on('jvt-native-on', handleFileOpen)
    setTimeout(() => {
      // win.webContents.send('jvt-native-on', {
      //   data: "IPC 双向交互已建立，欢迎使用！",
      //   seq: "native-main-engine_1_1724171403182",
      //   source: "native",
      //   type: "welcome"
      // })
      api.welcome('electron ipc 双向通信已建立，欢迎使用！');
    }, 1500);

    return win;
  }
}

module.exports = {
  WebWindow,
};