/**
 * @created : 2024/07/25
 * @author  : Jevstein
 * @version : 1.0
 * @desc    : electron 入口文件，两个核心模块：
 *            1、app - 用于控制应用程序的事件生命周期
 *            2、BrowserWindow - 用于创建和管理应用程序窗口
 * @history :
 *  - 2024/07/25 Jevstein 创建
 */

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow } = require('electron/main')
// const path = require('node:path')
const { ElectronIpcApi } = require( './electron/electron-ipc-api')

const _createWindowSimple = () => {
    // 导入 Node.js 的 path 模块
    const path = require('node:path');

    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
  
  // 1) 加载文件
  win.loadFile('./src/index.html');
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

const _createWindowLabHtml = () => {
  const path = require('node:path');
  const win = new BrowserWindow({
    width: 1800,
    height: 1600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // 开启沙箱模式: 若无此项，preload.js 脚本将无法访问 Node.js 环境(从而报错Error: module not found: ./electron/native/bridge)
      // nodeIntegration: true,
      // contextIsolation: false, // 如果需要在渲染进程中使用 Electron 的模块，则需要设置为 false
    },
  });
  win.loadFile('./../lab-html/src/index.html');
  win.webContents.openDevTools();
  return win;
}

/**
 * 创建浏览器窗口: 
 * 将index.html或url，加载进一个新的BrowserWindow实例
 * @param 
 * @returns
 */
const createWindow = () => {
  const type = 2; // 1: 简易demo, 2: lab-html 实验室
  switch (type) {
    case 1: return _createWindowSimple();
    case 2: return _createWindowLabHtml();
    default:
      console.log('未知类型');
      break;
  }
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
 * 可以通过使用 app.whenReady() API来监听此事件
 */
app.whenReady().then(() => {
  const win = createWindow();
  const api = ElectronIpcApi.create(win); // ipcMain.on('jvt-native-on', handleFileOpen)
  setTimeout(() => {
    // win.webContents.send('jvt-native-on', {
    //   data: "IPC 双向交互已建立，欢迎使用！",
    //   seq: "native-main-engine_1_1724171403182",
    //   source: "native",
    //   type: "welcome"
    // })
    api.welcome('electron ipc 双向通信已建立，欢迎使用！');
  }, 500);


  // 在 macOS 系统内, 如果没有已开启的应用窗口
  // 点击托盘图标时通常会重新创建一个新窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {// 没有已打开的窗口
      createWindow();
    }
  })
})

/**
 * 当所有窗口都被关闭时，退出应用程序
 */
app.on('window-all-closed', () => {
  // 在 macOS X 上，通常用户在明确地按下 Cmd + Q 之前，应用会保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
})