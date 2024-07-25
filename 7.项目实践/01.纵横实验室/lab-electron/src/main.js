const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // win.loadFile('./src/index.html')
  win.loadFile('./../lab-html/src/index.html')
  // win.loadURL('file:///Users/yiwenqiang/Desktop/studio/jvtstudio/develop-tree-book/7.%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5/01.%E7%BA%B5%E6%A8%AA%E5%AE%9E%E9%AA%8C%E5%AE%A4/lab-html/src/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})