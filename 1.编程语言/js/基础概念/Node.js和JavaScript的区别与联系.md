

# [Node.js和JavaScript的区别与联系](https://www.cnblogs.com/wsg25/p/10576756.html)

虽然不能说它们一点关系也没有，但它们的确关系不大：

第一，JavaScript是一门编程语言（脚本语言），而Node.js是一个平台，可以简单理解为它是JavaScript的一种执行环境。

第二，JavaScript以前是在浏览器里执行的，需要浏览器里的JavaScript引擎，Firefox有叫做Spidermonkey的引擎，Safari有JavaScriptCore的引擎，Chrome有V8的引擎，

​	现在有人把Chrome有V8的引擎的引擎拿出来做了包装，加入了   内置基本模块（大多用JavaScript编写），就构成了Node.js。

第三，Node.js可以说是JavaScrip的一种独立于浏览器的运行环境。

第四，两者涉及的内容也有较大差别，展示如下：

JavaScript：
ECMAScript（语言基础，如：语法、数据类型结构以及一些内置对象）
DOM（一些操作页面元素的方法）
BOM（一些操作浏览器的方法）
Node.js：
ECMAScript（语言基础，如：语法、数据类型结构以及一些内置对象）
OS（操作系统）
file（文件系统）
net（网络系统）
database（数据库）
————————————————

原文链接：https://blog.csdn.net/elesos/article/details/79201881