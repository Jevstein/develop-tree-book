// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
 
 
const createWindow = () => {
    // 创建窗口
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 开启node
            nodeIntegration: true,
            // 取消上下文隔离
            contextIsolation: false,
            // 开启remote
            enableRemoteModule:true,
        }
    });
    // 加载本地文件
    mainWindow.loadFile(path.join(__dirname, "index.html"));
    // 加载远程地址
    // mainWindow.loadURL('https://github.com');
 
    // 开启调试模式
    mainWindow.webContents.openDevTools();
 
}
 
// 监听应用的启动事件
app.on("ready", createWindow);
 
// 兼容MacOS系统的窗口关闭功能
app.on("window-all-closed", () => {
    // 非MacOS直接退出
    if (process.platform != "darwin") {
        app.quit();
    }
});
 
// 点击MacOS底部菜单时重新启动窗口
app.on("activate", () => {
    if (BrowserWindow.getAllWindows.length == 0) {
        createWindow();
    }
})