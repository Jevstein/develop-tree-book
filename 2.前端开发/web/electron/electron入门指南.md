



[TOC]

# electron入门指南



**electron 学习资料**
1、[Electron社区](https://www.electronjs.org/zh/docs/latest/)



## 一、electron简介



## 二、electron环境搭建

### 1、搭建命令

```shell
#1、检查并安装node.js, 参考：《../web环境完全安装指南》
$ node -v
$ npm -v

#2、使用脚手架,创建应用程序
$ mkdir lab-electron && cd lab-electron
$ npm init 或 yarn init

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
$ npm install --save-dev electron 或 yarn add --dev electron

-- 查看electron版本
$ electron -v

#4、预执行Electron, 在package.json文件增加如下：
{
  "scripts": {
    "start": "electron ."
  }
}

#5、创建main.js、index.html文件，见下文源码

#6、启动
$ npm start 或 yarn start 或 electron .
```



### 2、源码文件

#### 1.main.js

```javascript
const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
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
```



#### 2.index.html源码

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







> 巨人的肩膀：
> [深入理解Electron（一）Electron架构介绍](https://zhuanlan.zhihu.com/p/604169213)
> [深入理解Electron系列](https://www.zhihu.com/column/c_1606275988706549760)
> 
>
> 
