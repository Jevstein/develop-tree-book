# 搭建nodejs服务器

> https://www.jianshu.com/p/8de5d3d48507
>
> [Node.js安装及环境配置之Windows篇](https://www.cnblogs.com/liuqiyun/p/8133904.html)
>
> [node-koa](https://github.com/Hansen-hjs/node-koa)

#### 一：下载安装nodejs和安装express框架

进入这个nodejs中文网链接[ 下载nodejs](https://nodejs.org/en/download/):

```shell
$ node -v
v12.16.3

$ npm -v
6.14.4
```



###### 环境配置

说明：这里的环境配置主要配置的是npm安装的全局模块所在的路径，以及缓存cache的路径，之所以要配置，是因为以后在执行类似：npm install express [-g] （后面的可选参数-g，g代表global全局安装的意思）的安装语句时，会将安装的模块安装到【C:\Users\用户名\AppData\Roaming\npm】路径中，占C盘空间。
例如：我希望将全模块所在路径和缓存路径放在我node.js安装的文件夹中，则在我安装的文件夹【D:\Develop\nodejs】下创建两个文件夹【node_global】及【node_cache】如下图：

创建完两个空文件夹之后，打开cmd命令窗口，输入

```shell
$ npm config set prefix "D:\Develop\nodejs\node_global"
$ npm config set cache "D:\Develop\nodejs\node_cache"
```

设置环境变量，关闭cmd窗口，“我的电脑”-右键-“属性”-“高级系统设置”-“高级”-“环境变量”;

在【系统变量】下新建【NODE_PATH】，输入【D:\Develop\nodejs\node_global\node_modules】，将【用户变量】下的【Path】修改为【D:\Develop\nodejs\node_global】



###### 六、测试

配置完后，安装个module测试下，我们就安装最常用的express模块，打开cmd窗口，
输入如下命令进行模块的全局安装：

```
npm install express -g     # -g是全局安装的意思
```



1.[简易搭建nodejs服务器](https://www.jianshu.com/p/8de5d3d48507)

2.[【node.js】搭建本地服务器](https://blog.csdn.net/w390058785/article/details/79726905)

3.JS之搭建服务器](https://www.jianshu.com/p/82714f49fa2b)

新建一个server.js文件

```jsx
var http = require("http");
console.log("http");

var server = http.createServer(request,response){
    response.setHeader("Content-Type","text/html; charset=utf-8");
    response.write("<h1>Hello World</h1>");
    response.end();
}

server.linste(9000);
```

运行方法：打开终端，切换到server.js所在目，执行`node server.js`，然后打开浏览器，在地址栏中输入`localhost:9000`。

`console.log("http")`的结果会在终端显示。





```shell
npm init
npm install
```





作者：饥人谷_Tom
链接：https://www.jianshu.com/p/82714f49fa2b
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



## nodejs与nginx的完美搭配

[nginx下载](http://nginx.org/en/download.html)