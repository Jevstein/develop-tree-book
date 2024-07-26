[TOC]

# web开发环境完全搭建指南



## 一、环境安装



### 1、node.js

​	Node.js发布于2009年5月，由Ryan Dahl开发，是一个基于[Chrome](https://baike.baidu.com/item/Chrome/5633839?fromModule=lemma_inlink) [V8](https://baike.baidu.com/item/V8/6178125?fromModule=lemma_inlink)引擎的[JavaScript](https://baike.baidu.com/item/JavaScript/321142?fromModule=lemma_inlink)[运行环境](https://baike.baidu.com/item/运行环境/6555199?fromModule=lemma_inlink)，使用了一个[事件驱动](https://baike.baidu.com/item/事件驱动/9597519?fromModule=lemma_inlink)、非阻塞式I/O模型， [1]让JavaScript 运行在[服务端](https://baike.baidu.com/item/服务端/6492316?fromModule=lemma_inlink)的[开发平台](https://baike.baidu.com/item/开发平台/8956190?fromModule=lemma_inlink)，它让JavaScript成为与[PHP](https://baike.baidu.com/item/PHP/9337?fromModule=lemma_inlink)、[Python](https://baike.baidu.com/item/Python/407313?fromModule=lemma_inlink)、[Perl](https://baike.baidu.com/item/Perl/851577?fromModule=lemma_inlink)、[Ruby](https://baike.baidu.com/item/Ruby/11419?fromModule=lemma_inlink)等服务端语言平起平坐的[脚本语言](https://baike.baidu.com/item/脚本语言/1379708?fromModule=lemma_inlink)。 [2]

​	Node.js对一些特殊[用例](https://baike.baidu.com/item/用例/163511?fromModule=lemma_inlink)进行优化，提供替代的[API](https://baike.baidu.com/item/API/10154?fromModule=lemma_inlink)，使得V8在非浏览器环境下运行得更好，V8引擎执行Javascript的速度非常快，性能非常好，基于Chrome JavaScript[运行时](https://baike.baidu.com/item/运行时/3335184?fromModule=lemma_inlink)建立的平台， 用于方便地搭建响应速度快、易于扩展的[网络应用](https://baike.baidu.com/item/网络应用/2196523?fromModule=lemma_inlink)。



#### 1、下载安装

* [官网下载](https://nodejs.org/zh-cn)安装 - 比较适用于windows

* 使用命令下载安装

  ```shell
  # 方法一：brew命令
  $ brew install node
  
  # 方法二：nvm命令
  $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  $ nvm install node
  
  # 方法三：apt命令 - 比较适用于linux
  $ sudo apt-get update
  $ sudo apt-get install node
  或者：
  $ sudo apt update
  $ sudo apt install nod
  ```
  

node.js安装成功后，将自动安装上npm。检查如下：

```shell
$ node -v
$ npm -v
```



#### 2、多版本管理器

* **1）n命令**

  用n命令来来升级和切换node.js，管理非常简便！

  ```shell
  #1、清除node.js的cache
  $ sudo npm cache clean -f 
  
  #2、使用npm安装n模块
  $ sudo npm install -g n
  
  #3、查看node所有版本
  $ npm view node versions
  
  #4、切换版本
  $ sudo n latest # 升级到最新版本
  $ sudo n stable # 升级到稳定版本
  $ sudo n xx.xx  # 升级到具体版本号
  
  #5、查看当前安装的版本号
  $ node -v
  
  #6、检查目前安装了哪些版本的node，会出现已安装的node版本，选一个就可以直接切换了
  $ n
  ```

  

* **2）nvm**

  略

  

### 2、web常规项目的搭建步骤

```shell
# 1、拉取工程代码，或新建工程目录
$ git clone 'xxx'

# 2、安装nodejs
-- 官网下载
$ node -v
$ npm -v

# 3、切换nodejs版本
$ npm view node versions
$ npm install n
$ n xx.xx

# 4、切换镜像仓库
$ yarn config get registry # 查看
$ yarn config set registry http://10.10.27.63:4873/ # 切换

# 5、安装node_modules依赖
$ yarn install

# 6、更新脚手架
$ yarn upwedep

-- 若部分库安装失败，可单独安装
$ yarn add xxx

# 7、运行项目
$ yarn start

# 8、打包
$ yarn build
```





## 二、常用命令

### 1、ruby



### 2、brew

​	[brew](https://brew.sh/)全称叫Homebrew，是Mac系统上的软件包管理工具，方便安装软件或卸载软件，相当于linux下的apt-get、yum神器。

```shell
# 1、安装与卸载
$ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"

# 2、常规使用
$ echo "$(brew --repo)" : 查看默认安装目录：/usr/local/Homebrew
$ brew -v : 查看版本
$ brew list --versions : 列举所有安装的包以及版本号
$ brew info git : 查看git的详细信息
$ brew –cache : 查看所安软件的安装包下载的目录，可以定期清理该目录
$ brew deps --installed --tree : 以树形展示所有已安装包的依赖
$ brew search git : 查找软件包

$ brew update : 自身检查和升级

$ brew install <包名> : 安装软件包
$ brew uninstall <包名> –force : 卸载软件包
$ brew install bigwig-club/brew/upic --cask : 安装第三方软件upic
$ brew cleanup：清理所有已安装的软件的旧版本（brew默认不会卸载软件的旧版本）

$ brew outdated : 检查所安装的软件是否有过期需要升级，查看是否有新版本可用
$ brew upgrade : 升级所有已安装的软件
$ brew upgrade <包名> : 升级指定包

$ brew link <包名> : 将指定软件的安装文件symlink到Homebrew上
$ brew link --overwrite <包名> : 如果symlink失败，使用overwrite命令

$ brew tap : 自动更新已经存在的tap,并列出当前已经tapped的仓库

$ brew pin <包名>：锁定某一软件为特定版本
$ brew unpin <包名>：解除锁定

```



### 3、npm

```shell
# 安装node_modules依赖
$ npm install 或
$ npm i
	在git clone项目的时候，项目文件中并没有 node_modules文件夹，项目的依赖文件可能很大。直接执行，npm会根据package.json配置文件中的依赖配置下载安装。
	
--【参数说明】：
-global=-g，全局安装，安装后的包位于系统预设目录下
--save=-S，安装的包将写入package.json里面的dependencies，dependencies：生产环境需要依赖的库
--save-dev=-D，安装的包将写入packege.json里面的devDependencies，devdependencies：只有开发环境下需要依赖的库
--force=-f，强制安装
--verbose，可以尝试打印更详细的错误信息

# 常用命令
$ npm run install xxx: 安装指定模块
$ npm run start: 运行项目


```



### 4、yarn 

​	参考：https://blog.51cto.com/u_16099264/7874185

```shell
# 安装yarn命令
$ npm install yarn -g

$ yarn -v：yarn版本
$ yarn init：初始化项目
$ yarn add <package-name>：安装具体的某个包
$ yarn remove <package-name>： 删除具体的某个包
$ yarn serve：运行项目
$ yarn build：编译项目

# 切换镜像仓库
$ yarn config get registry # 查看
$ yarn config set registry http://10.10.27.63:4873/ # 切换
```



### 5、nvm

-- 用于多版本管理



## 三、打包、发布





>巨人的肩膀：
>[Mac安装npm全面指南](https://blog.csdn.net/m0_60437766/article/details/132116277)

