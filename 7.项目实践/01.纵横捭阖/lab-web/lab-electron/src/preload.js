// // 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// // 它拥有与Chrome扩展一样的沙盒。
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }
//   // 访问 Node.js process.versions 对象，并写入版本号
//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency])
//   }
// })

// 导入 ipcOn 模块
const { JvtBridge } = require('./base/communicator/native/bridge')
JvtBridge.create('ipcOn');