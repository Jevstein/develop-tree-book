[TOC]

# web开发环境完全搭建指南



## 一、环境安装



### 1、node.js

​	Node.js® 是一个免费、开源、跨平台的 JavaScript 运行时环境，它让开发人员能够创建服务器、Web 应用、命令行工具和脚本。号称在任何地方都可运行 JavaScript。

​	Node.js发布于2009年5月，由Ryan Dahl开发，是一个基于[Chrome](https://baike.baidu.com/item/Chrome/5633839?fromModule=lemma_inlink) [V8](https://baike.baidu.com/item/V8/6178125?fromModule=lemma_inlink)引擎的[JavaScript](https://baike.baidu.com/item/JavaScript/321142?fromModule=lemma_inlink)[运行环境](https://baike.baidu.com/item/运行环境/6555199?fromModule=lemma_inlink)，使用了一个[事件驱动](https://baike.baidu.com/item/事件驱动/9597519?fromModule=lemma_inlink)、非阻塞式I/O模型， [1]让JavaScript 运行在[服务端](https://baike.baidu.com/item/服务端/6492316?fromModule=lemma_inlink)的[开发平台](https://baike.baidu.com/item/开发平台/8956190?fromModule=lemma_inlink)，它让JavaScript成为与[PHP](https://baike.baidu.com/item/PHP/9337?fromModule=lemma_inlink)、[Python](https://baike.baidu.com/item/Python/407313?fromModule=lemma_inlink)、[Perl](https://baike.baidu.com/item/Perl/851577?fromModule=lemma_inlink)、[Ruby](https://baike.baidu.com/item/Ruby/11419?fromModule=lemma_inlink)等服务端语言平起平坐的[脚本语言](https://baike.baidu.com/item/脚本语言/1379708?fromModule=lemma_inlink)。 [2]

​	Node.js对一些特殊[用例](https://baike.baidu.com/item/用例/163511?fromModule=lemma_inlink)进行优化，提供替代的[API](https://baike.baidu.com/item/API/10154?fromModule=lemma_inlink)，使得V8在非浏览器环境下运行得更好，V8引擎执行Javascript的速度非常快，性能非常好，基于Chrome JavaScript[运行时](https://baike.baidu.com/item/运行时/3335184?fromModule=lemma_inlink)建立的平台， 用于方便地搭建响应速度快、易于扩展的[网络应用](https://baike.baidu.com/item/网络应用/2196523?fromModule=lemma_inlink)。



#### 1）下载安装

* [官网下载](https://nodejs.org/zh-cn)安装 - 适用于windows

* 使用命令下载安装

  ```shell
  # 方法一：brew命令 - 适用于macOS
  $ brew install node
  
  # 方法二：nvm命令
  $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  $ nvm install node
  
  # 方法三：apt命令 - 适用于linux
  $ sudo apt-get update
  $ sudo apt-get install node
  或者：
  $ sudo apt update
  $ sudo apt install nod
  ```
  

node.js安装成功后，将自动安装上npm。检查如下：

```shell
# 查看版本号，检查是否安装成功
$ node -v
$ npm -v

# 卸载
$ brew uninstall node
$ npm uninstall npm -g
$ sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/{npm*,node*,man1/node*}
```



#### 2）多版本管理器

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

  ```shell
  略
  ```

  

  

### 2、nginx







### 3、web常规项目的搭建步骤

```shell
# 1、拉取工程代码，或新建工程目录
$ git clone 'xxx'

# 2、安装nodejs
-- 官网下载：https://nodejs.org/zh-cn
$ node -v
$ npm -v

# 3、切换nodejs版本
$ npm view node versions
$ npm install n
$ n xx.xx.xx

# 4、切换镜像仓库
$ yarn config get registry # 查看
$ yarn config set registry http://10.10.27.63:4873/ # 切换

# 5、安装node_modules依赖
$ yarn install

# 6、更新weapp脚手架
$ yarn upwedep

-- 若部分模块安装失败，可单独安装
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
-- 1、官网推荐命令：
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

-- 2、官网安装包（https://github.com/Homebrew/brew/releases/tag/4.1.4）：
运行Homebrew.4.14.pkg，最后配置环境命令：
$ echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.bash_profile 
$ source ~/.bash_profile
$ echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc   
$ source ~/.zshrc

-- 3、ruby命令
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"

-- 4、zsh命令
$ /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

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
$ npm uninstall npm -g: 卸载


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



### 6、code

​	使用 `zsh` （一个 Unix shell）时尝试运行 `code` 命令，比如：

$ code electron-quick-start， 即可用vscode 打开code electron-quick-start项目。

```shell
# 1、确认是否安装了 code 命令对应的程序，比如： Visual Studio Code 编辑器

# 2、若已安装Visual Studio Code，则确保它的安装目录被加入到你的 PATH 环境变量中。你可以通过编辑 &#126;/.zshrc 文件来永久添加路径
$ export PATH=$PATH:/path/to/visual-studio-code/folder/

# 3、设置别名在 zsh 配置文件中
$ alias code='/path/to/visual-studio-code/folder/code'

# 4、重启 zsh 或重新打开终端后，再次尝试运行 code 命令
$ code electron-quick-start
```





## 三、打包、发布



## 四、常见命令错误

### 1、brew-在更新或安装时报root权限的错误

```shell
Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
build scripts full access to your system.


解决：
$ sudo chown -R $(whoami) /usr/local
把/use/local的owner换成自己，就有write权限了

$ whoami就是一个命令，会echo当前登录用戶的名字。比如erica,就直接
$ sudo chown -R erica /usr/local
$ brew install 或者 
$ brew update 

链接：https://www.jianshu.com/p/0b40983e5727
```





>巨人的肩膀：
>[Mac安装npm全面指南](https://blog.csdn.net/m0_60437766/article/details/132116277)
>[mac安装brew小白指引](https://blog.csdn.net/ganyingxie123456/article/details/132182152)

