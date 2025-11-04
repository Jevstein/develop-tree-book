[TOC]

# weapp-desksdk（electron中间件）

1、web - 客户端(electron)的中间桥梁
2、防止安全漏洞
3、em7、em10通用



## 一、前期调研

### 1、如何防止漏洞？

  [泛微eteams(mac)客户端源码泄漏导致存在云服务API密钥泄漏漏洞](https://www.e-cology.com.cn/sp/workflow/flowpage/view/1185041829996175472__authModule=im&weappAuthStr=eyJtc2dpZCI6IjE3NTkxMjgwMDMxMTgwNzY0NTAiLCJncm91cF9pZCI6IjE3NTkxMjc5NzE3MDIwMDA2ODYiLCJmbGFnIjoxLCJ0aGlyZCI6IjE3NTkxOTQ1MTgxMTgwMjA3NjVfMTc1OTEyODAwMzExODA3NjQ1MCIsImZ1c2VyIjp7InVpZCI6IjQ5NzU2MjQ1OTEzNTI0MzY4MDYiLCJjaWQiOiI4NzQxNTI0MTQ2OTU5MTU1MjAifX0%3D?wea_link_keep_noem=1)
  [泛微eteams(mac)客户端存在RCE漏洞](https://www.e-cology.com.cn/sp/workflow/flowpage/view/1185042607429959727__authModule=im&weappAuthStr=eyJtc2dpZCI6IjE3NTkxMjgwMTMxMTEwMDYxMTciLCJncm91cF9pZCI6IjE3NTkxMjc5NzE3MDIwMDA2ODYiLCJmbGFnIjoxLCJ0aGlyZCI6IjE3NTkxOTQ1MTgxMTgwMjA3NjVfMTc1OTEyODAxMzExMTAwNjExNyIsImZ1c2VyIjp7InVpZCI6IjQ5NzU2MjQ1OTEzNTI0MzY4MDYiLCJjaWQiOiI4NzQxNTI0MTQ2OTU5MTU1MjAifX0%3D?wea_link_keep_noem=1)
  [泛微eteams(windows)客户端源码泄漏导致存在云服务API密钥泄漏漏洞](https://www.e-cology.com.cn/sp/workflow/flowpage/view/1185043067055808513__authModule=im&weappAuthStr=eyJtc2dpZCI6IjE3NTkxMjgwMjIxMTgwNzc4MzkiLCJncm91cF9pZCI6IjE3NTkxMjc5NzE3MDIwMDA2ODYiLCJmbGFnIjoxLCJ0aGlyZCI6IjE3NTkxOTQ1MTgxMTgwMjA3NjVfMTc1OTEyODAyMjExODA3NzgzOSIsImZ1c2VyIjp7InVpZCI6IjQ5NzU2MjQ1OTEzNTI0MzY4MDYiLCJjaWQiOiI4NzQxNTI0MTQ2OTU5MTU1MjAifX0%3D?wea_link_keep_noem=1)
  [泛微eteams(windows)客户端存在远程加载执行任意代码RCE漏洞](eyJtc2dpZCI6IjE3NTkxMjgwMzIxMjEwOTk0NTUiLCJncm91cF9pZCI6IjE3NTkxMjc5NzE3MDIwMDA2ODYiLCJmbGFnIjoxLCJ0aGlyZCI6IjE3NTkxOTQ1MTgxMTgwMjA3NjVfMTc1OTEyODAzMjEyMTA5OTQ1NSIsImZ1c2VyIjp7InVpZCI6IjQ5NzU2MjQ1OTEzNTI0MzY4MDYiLCJjaWQiOiI4NzQxNTI0MTQ2OTU5MTU1MjAifX0)

* 漏洞示例：
  
  https://www.flowerfff.com/el/RCEpc2.html
  
  ````js
  window.emRequire('child_process').exec('ipconfig',(error,stdout,stderr)=>{alert(`stdout:${stdout}`);})
  ````
  
* 解决方案：
  
   1）启用上下文隔离：`contextIsolation=true`隔离了预加载脚本和网页环境，预加载脚本中的变量不会直接暴露给网页
  
  2）禁用 Node.js 集成： `nodeIntegration=false`禁用后，渲染进程运行在纯浏览器环境中，不再有 Node.js访问权限 
  
  3）启用沙箱模式：`sandbox=true`进一步限制了渲染进程的权限（即使通过某些方法获取了 `require`，也无法执行敏感操作）
  
  4）IPC安全方法：最小权限原则（如禁止暴露`remote`对象）
  
  5）其他：禁用远程模块、内容安全策略（CSP）
  
  详见：《二、安全措施》
  
  
  
### 2、如何减少兼容风险？

* 1）`require/emRequire`、`process`等 Node.js 全局变量被移除，以下都不能用：

  'electron'、'electron-is'、'electron-store'、'@electron/remote'、'os'、'fs-extra' 、'fs'、'path'...

  --> 全部改成IPC接口，调用对象window.electronAPI

* 2）兼容老客户端：老客户端可以使用web新基线；新客户端不能使用老web基线

* 3）须保证公共组件使用正常，业务组件即时适配（包括ecode定制）

* 4）云盘：用到的remote都得改

* 5）升级：weapp-desksdk更新，要同时升级基线和客户端

* 6）em7鸿蒙发布测试：需要搭建外网环境

* 7）需要修改的模块：weapp-emmessage、weapp-emjssdk、云盘模块、em7、em10、公共组件(待确认)

* 8）<font color=red>定制客户老web基线</font>：只能用老客户端，还得在老客户端加新功能；如果升级到了新web基线，如何将老客户端定制的功能合到新客户端？

  

### 3、如何建立工程weapp-desksdk？

* 1）如何创建weapp-desksdk（类似emjssdk），支持typescript

* 2）如何分别集成到客户端和web中：npm install？

* 3）如何调试？

  

### 4、怎样达成目标（评估工作量）？

* weapp-desksdk： 11月7日开发完

* em7鸿蒙上架：升级electron25+，11月底

* em10安全漏洞：12月底

  

  

### 5、做成类似RPC的效果是否可行？

* 老接口照旧：自定义IPC接口
* 新接口RPC：send/invoke 共用IPC接口，将api函数名反射成type

![](../../../7.项目实践/01.纵横捭阖/lab-web/lab-html/src/assets/images/iframe-electron.png)



## 二、安全措施

### 1、安全防护方案

  ```js
  1. 禁用 Node.js 集成（核心防护）
    // main.js (主进程)
    const { app, BrowserWindow } = require('electron')
  
    app.whenReady().then(() => {
      const mainWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: false, // 禁用 Node.js 集成
          contextIsolation: true, // 启用上下文隔离
          sandbox: true, // 启用沙箱模式
          preload: path.join(__dirname, 'preload.js') // 预加载脚本
        }
      })
  
      mainWindow.loadFile('index.html')
    })
  
  2. 使用上下文隔离与预加载脚本
    // preload.js (预加载脚本)
    const { contextBridge, ipcRenderer } = require('electron')
  
    // 安全暴露有限的 API 给渲染进程
    contextBridge.exposeInMainWorld('electronAPI', {
      safeSystemCommand: (command) => ipcRenderer.invoke('safe-system-command', command)
    })
  
  3. 主进程实现命令白名单
    // main.js (主进程)
    const { ipcMain } = require('electron')
    const { exec } = require('child_process')
  
    // 允许的命令白名单
    const ALLOWED_COMMANDS = {
      'ipconfig': true,
      'ping': true,
      'tracert': true
    }
  
    ipcMain.handle('safe-system-command', (event, command) => {
      // 验证命令是否在白名单中
      if (!ALLOWED_COMMANDS[command]) {
        throw new Error(`禁止的命令: ${command}`)
      }
  
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error.message)
            return
          }
  
          // 清理敏感信息
          const cleanedOutput = cleanOutput(stdout)
          resolve(cleanedOutput)
        })
      })
    })
  
    // 清理输出中的敏感信息
    function cleanOutput(output) {
      // 移除 IP 地址等敏感信息
      return output.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[REDACTED]')
    }
  
  4. 渲染进程安全调用
    // renderer.js (渲染进程)
    async function getNetworkInfo() {
      try {
        const result = await window.electronAPI.safeSystemCommand('ipconfig')
        console.log('网络信息:', result)
      } catch (error) {
        console.error('执行失败:', error)
      }
    }
  ```



### 2、进阶安全措施

  ```js
  1. 内容安全策略 (CSP)
    <!-- index.html -->
    <head>
      <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self';
        connect-src 'self';
        object-src 'none';
        frame-src 'none';
      ">
    </head>
  
  2. 进程沙箱化
    // main.js
    const mainWindow = new BrowserWindow({
      webPreferences: {
        sandbox: true // 强制沙箱模式
      }
    })
    
  3. 禁用远程模块
     // main.js
    const mainWindow = new BrowserWindow({
      webPreferences: {
        enableRemoteModule: false // 禁用远程模块
      }
    })
    
  4. 安全通信验证
    // main.js
    ipcMain.handle('safe-system-command', (event, command) => {
      // 验证请求来源
      if (event.senderFrame !== event.sender.mainFrame) {
        throw new Error('非法请求来源')
      }
  
      // 验证请求窗口
      if (BrowserWindow.fromWebContents(event.sender) !== mainWindow) {
        throw new Error('非法请求窗口')
      }
  
      // ...其余逻辑
    })
  
  5. 命令执行超时控制
    // main.js
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(require('child_process').exec)
  
    ipcMain.handle('safe-system-command', async (event, command) => {
      // ...白名单验证
  
      try {
        // 设置5秒超时
        const { stdout } = await Promise.race([
          execAsync(command),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('命令执行超时')), 5000)
          )
        ])
  
        return cleanOutput(stdout)
      } catch (error) {
        throw new Error(`命令执行失败: ${error.message}`)
      }
    })
  ```

