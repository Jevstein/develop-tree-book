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
const { app, BrowserWindow } = require('electron/main');
const { WebWindow } = require( './electron/web-window');


/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
 * 可以通过使用 app.whenReady() API来监听此事件
 */
app.whenReady().then(() => {
  WebWindow.create();

  // 在 macOS 系统内, 如果没有已开启的应用窗口。点击托盘图标时通常会重新创建一个新窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {// 没有已打开的窗口
      WebWindow.create();
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