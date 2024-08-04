[TOC]

# web入门指南



## 一、基础介绍

```html
<!DOCTYPE html>
<html>
	<!-- 1、头部定义 -->
  <head>
    <!-- meta元素提供的信息是用户不可见的，它不显示在页面中，一般用来定义页面信息的名称、关键字、作者等。
      而在一个html头页面中可以有多个meta元素。meta元素的属性有两种：name和tttp-equiv -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="format-detection" content="telephone=no,address=no">
    <meta name="apple-mobile-web-app-status-bar-style" content="white">
    <title>web研究院</title>
    <!-- <link href="css/style" rel="stylesheet" type="text/css" /> -->
    <!-- 2、引入css外部样式表 -->
    <style type="text/css">
      html,
      body {
        width: 100%;
        height: calc(100% - 1px);
        margin: 0;
        display: flex;
        justify-content: start;
        overflow: hidden;
      }
    </style>
  </head>
	<!-- 3、body定义 -->
  <body>
    <div class="weblab-dir">
      入门指南
    </div>
    
		<!-- 4、JavaScript -->
    <script>
      function main() {
        alert('hello world!')
      }

      this.main();
    </script>
  </body>
</html>
```



## 二、web环境搭建

详见 [web开发环境完全搭建指南](./web开发环境完全搭建指南.md)



## 三、常见框架

react、vue、jQuery、taro等



## 四、基础知识

### 1、浏览器原理

[现代浏览器内部工作原理（附详细流程图）](http://www.51testing.com/html/16/n-4457716.html)
[深入理解浏览器工作原理 - 小火柴的蓝色理想 - 博客园 (cnblogs.com)](https://www.cnblogs.com/xiaohuochai/p/9174471.html)
[⑤浏览器的工作原理（上） - 简书 (jianshu.com)](https://www.jianshu.com/p/4de8a9f4cf5a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)



### 2、调试技巧

[前端chrome浏览器调试总结](https://www.cnblogs.com/soyxiaobi/p/9598761.html)
[sourcemap-全网最优雅的 React 源码调试方式](https://zhuanlan.zhihu.com/p/548297074)



### 3、日志打印

```js
console.groupCollapsed(this.prefix, (new Date()).toLocaleString(), ...args);
console.trace(); // hidden in collapsed group
console.groupEnd();
```

自定义输出样式 - console.log() 和 console.error() 支持在输出的内容前添加样式，例如文本颜色、背景颜色和字体加粗等。
console.log("%cThis is a styled message!", "color: red; background-color: yellow; font-weight: bold;");
这些是console对象的高级用法，可以让我们更方便地调试和输出信息。



[javascript日志打印6个方法](https://baijiahao.baidu.com/s?id=1680120408559571060&wfr=spider&for=pc)



### 4、iframe



#### 1、iframe用法



#### 2、iframe交互

​	通过postmessage、onmessage等方式实现页面间的交互

##### 1）基本原理

###### ① 宿主页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,address=no">
  <meta name="apple-mobile-web-app-status-bar-style" content="white">
  <title>iframe宿主-demo</title>
</head>
<body>
  <div class='weblab-iframe'>
    <iframe id='id-weblab-iframe' name="top" frameborder="0" scrolling="yes"></iframe>
  </div>
  <script>
    const target = document.querySelector('.id-weblab-iframe') // iframe对象
    // 监听消息：只接受指定域名下的消息
    window.addEventListener('message', (event) => {
      console.log('【宿主】收到数据: ', event.data)
      switch (event.data.type) {
        case 'IFRAME_TYPE_SIMPLE': { // 回复：发送回复消息
          	const data = {
             	...event.data,
             	data: 'great!'
          	}
      			console.log('【宿主】发送数据: ', data)
          	target?.contentWindow?.postMessage(data, '*')
        } break;
        default:
        break;
      }
   }, false)
  </script>
</body>

</html>
```

###### ② iframe子页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,address=no">
  <meta name="apple-mobile-web-app-status-bar-style" content="white">
  <title>iframe子页面-client</title>
</head>
<body>
  <div class='weblab-iframe'>
    <button onclick="handleClickTest(event)">发送-接收消息</button>
  </div>
  <script>
    // 发送消息
    function handleClickTest(event) {
        const data = {
        	type: 'IFRAME_TYPE_SIMPLE',
        	data: 'hello, I am an iframe!'
      	}
      	console.log('【iframe】主动发送数据: ', data)
      	window.parent.postMessage(data, '*');
    }
    
    // 监听消息：只接受指定域名下的消息
    window.addEventListener('message', (event) => {
      console.log('【iframe】收到数据: ', event.data)
   }, false)
  </script>
</body>

</html>
```



##### 2）封装实践

![iframe交互](./images/iframe交互.png)

示例文件如下：

###### ①  communicator.js

```javascript
/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @desc    : iframe-communicator - 用于iframe之间通信的消息分发器
 */

class JvtIframeCommunicator {
  _target = null;     // 目标iframe
  _onRecv = null;     // 接收消息
  _name = '';         // iframe名称

  _map = new Map();   // 用于存储回调函数
  _seqCount = 0;      // 用于生成序列号

  constructor(props) {
    const {
      onRecv = null,
      target = document.getElementById('id-weblab-iframe').contentWindow,
      name = 'iframe-server'
    } = props;

    this._target = target;
    this._onRecv = onRecv;
    this._name = name;

    this.start();
  }

  /**
   * createSeq - 生成序列号
   * @returns {string} : 序列号
   */
  _createSeq = () => {
    if (this._seqCount >= 9007199254740992) {
      this._seqCount = 0;
    }
    return `${this._name}_${++this._seqCount}_${new Date().getTime()}`;
  }

  /**
   * 消息分发器
   * @param {*} event 
   */
  _dispatch = (event) => {
    console.log(`[${this._name}] recv:`, event.data);
    this._onRecv && this._onRecv(event.data);

    if (event.data.seq && this._map.has(event.data.seq)) {
      const cb = this._map.get(event.data.seq);
      cb && cb(event.data);
      this._map.delete(event.data.seq);
    }
  }

  /**
   * 发送消息
   * @param {*} data : 消息数据, 必须满足./protocol.js中的IframeData格式
   * @param {*} cb :回调函数, 接收消息的响应数据
   */
  send = (data, cb = null) => {
    if (!data.seq) {
      data.seq = this._createSeq();
    }

    console.log(`[${this._name}] send:`, data);
    this._target?.postMessage(data, '*');

    if (cb) {
      this._map.set(data.seq, cb);
    }
  }

  /**
   * 开始监听消息: 只接受指定域名下的消息
   */
  start = () => {
    window.addEventListener('message', this._dispatch);
  }

  /**
   * 停止监听消息
   */
  stop = () => {
    window.removeEventListener('message', this._dispatch);
  }
}
```

###### ② protocol.js

```javascript
/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @desc    : iframe-protocol - 消息协议
 */

// 数据格式
// class IframeData {
//   seq = 0;      // 流水号-对应每条消息的唯一标识
//   type = null;  // 消息类型
//   data = null;  // 消息内容
// }

// 消息类型
 const IFRAME_TYPE_SIMPLE                  = 10000; // 简单消息
```

###### ③ 宿主页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,address=no">
  <meta name="apple-mobile-web-app-status-bar-style" content="white">
  <title>iframe宿主-demo</title>
</head>
<body>
  <div class='weblab-iframe'>
    <iframe id='id-weblab-iframe' name="top" frameborder="0" scrolling="yes"></iframe>
  </div>
  <script>
    const iframeCommunicator = new JvtIframeCommunicator({
        name: 'iframe-server',
        target: document.getElementById('id-weblab-iframe').contentWindow,
        onRecv: (message) => {
          console.log('[宿主] receive message:', message);
          iframeCommunicator.send({
            ...message,
            data: 'great!'
          });
        }
      });
   }, false)
  </script>
</body>

</html>
```

###### ④ iframe子页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,address=no">
  <meta name="apple-mobile-web-app-status-bar-style" content="white">
  <title>iframe子页面-client</title>
</head>
<body>
  <div class='weblab-iframe'>
    <button onclick="handleClickTest(event)">发送-接收消息</button>
  </div>
  <script>
    const _iframeCommunicator = new JvtIframeCommunicator({
        name: 'iframe-client',
        target: window.parent,
        onRecv: (data) => {
          console.log('[子页面] receive:', data);
        }
   	});
    
    function handleClickTest(event) {
      this._iframeCommunicator.send({
        type: IFRAME_TYPE_SIMPLE,
        data: 'hello, I am an iframe!'
      }, (data) => {
        console.log('[子页面] get response:', data);
        alert(`get - ${data.data}`);
      });
    }
  </script>
</body>

</html>
```







### 5、websocket

[WebSocket](https://zhuanlan.zhihu.com/p/408291927)
[Web 开发技术.Web API 接口参考](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/close_event)





## 五、项目实践

详见 lab-html



>巨人的肩膀：
>[Web前端之JavaScript入门](https://blog.csdn.net/ANingL/article/details/104527605)

