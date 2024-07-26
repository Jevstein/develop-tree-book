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

/**
 * 创建浏览器窗口: 
 * 将index.html或url，加载进一个新的BrowserWindow实例
 * @param 
 * @returns
 */
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1800,
    height: 1600
  })

  // 加载文件
  // win.loadFile('./src/index.html')
  // win.loadFile(path.resolve(__dirname,'src/index.html'))
  win.loadFile('./../lab-html/src/index.html')
  // 或 
  // 加载URL
  // win.loadURL('file:///Users/yiwenqiang/Desktop/studio/jvtstudio/develop-tree-book/7.%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5/01.%E7%BA%B5%E6%A8%AA%E5%AE%9E%E9%AA%8C%E5%AE%A4/lab-html/src/index.html')

  // 打开开发调试工具
  win.webContents.openDevTools()
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 可以通过使用 app.whenReady() API来监听此事件
 */
app.whenReady().then(() => {
  createWindow()

  // 在 macOS 系统内, 如果没有已开启的应用窗口
  // 点击托盘图标时通常会重新创建一个新窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {// 没有已打开的窗口
      createWindow()
    }
  })
})

/**
 * 当所有窗口都被关闭时退出应用程序:
 * 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
 * 为了实现这一点，需要监听 app 模块的 'window-all-closed' 事件。
 * 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})