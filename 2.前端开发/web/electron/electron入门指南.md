



[TOC]

# electron 快速入门指南



**electron 学习资料**
1、[官网](https://www.electronjs.org/)
2、[Electron社区](https://www.electronjs.org/zh/docs/latest/)



## 一、electron 简介



## 二、electron 环境搭建

### 1、项目示例

```shell
.lab-electron
├── .forge
│   └── config.js
├── doc
│   └── readme.md
├── package.json
├── src
│   ├── index.html
│   └── main.js
└── yarn.lock
```



### 2、搭建命令

```shell
#1、检查并安装node.js, 参考：《../web开发环境完全搭建指南》
$ node -v
$ npm -v

#2、使用脚手架,创建应用程序
$ mkdir lab-electron && cd lab-electron
$ npm init 或 $ yarn init

-- 执行命令后，将生成package.json文件如下：
{
  "name": "lab-electron",
  "version": "1.0.0",
  "description": "electron 实验室",
  "main": "main.js",
  "author": "Jevstein",
  "license": "MIT"
}

#3、安装electron包，增加到应用的开发依赖中
$ npm install --save-dev electron 或 
$ yarn add --dev electron

-- 查看electron版本
$ electron -v

#4、预执行Electron, 在package.json文件增加如下：
{
  "scripts": {
    "start": "electron ."
  }
}

#5、创建main.js、index.html等文件
-- 见下面文件

#6、启动
$ npm start 
或 $ yarn start 
或 $ electron .

#7、打包发布： https://www.electronforge.io/
-- 1.Add a description to your package.json file, otherwise rpmbuild will fail. Blank description are not valid.
	To build an RPM package for Linux, you will need to install its required system dependencies：https://www.electronforge.io/config/makers/rpm

-- 2.安装electron-forge
$ npm install --save-dev @electron-forge/cli 或
$ yarn add --dev @electron-forge/cli

-- 3.使用 Forge 的 make 命令来创建可分发的应用程序
npx electron-forge package
$ npm run make 或 
$ yarn make
$ npx electron-forge package 

```



### 3、项目文件

#### 	1) main.js

```javascript
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

const { app, BrowserWindow } = require('electron/main')

/**
 * 创建浏览器窗口: 
 * 将index.html或url，加载进一个新的BrowserWindow实例
 * @param 
 * @returns
 */
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('./src/index.html')
  // win.loadURL('http://xxx')
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 可以通过使用 app.whenReady() API来监听此事件
 */
app.whenReady().then(() => {
  createWindow()

  // 当 Linux 和 Windows 应用在没有窗口打开时退出了，
  // macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口
  // 所以为了实现这一特性，监听 app 模块的 activate 事件 -- 当应用激活时，如果没有已打开的窗口，则创建一个新的窗口
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
```



#### 	2)  index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <meta
      http-equiv="X-Content-Security-Policy"
      content="default-src 'self'; script-src 'self'"
    />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
    <p id="info"></p>
  </body>
  <script src="./renderer.js"></script>
</html>
```

#### 	3) .forge/config.js

```
module.exports = {
  packagerConfig: {
    // 配置打包选项，例如应用程序名称、版本等
  },
  makers: [
    {
      name: '@electron-forge/maker-deb', // 为Linux生成.deb包
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm', // 为Linux生成.rpm包
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg', // 为macOS生成.dmg包
      config: {}
    },
    {
      name: '@electron-forge/maker-zip', // 为所有平台生成.zip包
      config: {}
    },
    {
      name: '@electron-forge/maker-exe', // 为Windows生成.exe安装程序
      config: {}
    }
  ]
};
```



### 4、打包发布





>巨人的肩膀：
> [深入理解Electron（一）Electron架构介绍](https://zhuanlan.zhihu.com/p/604169213)
> [深入理解Electron系列](https://www.zhihu.com/column/c_1606275988706549760)
> [Electron简介及快速入门](https://zhuanlan.zhihu.com/p/661319459)
