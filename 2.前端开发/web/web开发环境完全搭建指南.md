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
  $ sudo apt-get install -y nodejs
  或者：
  $ sudo apt update
  $ sudo apt install node
  
  # 方法四：nvm命令-gitee镜像
  $ curl -fsSL https://gitee.com/sdq/nvm/raw/master/install.sh | bash
  $ export NVM_NODEJS_ORG_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
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
  $ npm cache clean -f 
  
  #2、使用npm安装n模块
  $ npm install -g n
  
  #3、查看node所有版本
  $ npm view node versions
  $ n ls-remote 			# 查看node.js 的远程版本
  $ n ls-remote --all # 所有版本
  
  #4、切换版本
  $ n latest # 升级到最新版本
  $ n stable # 升级到稳定版本
  $ n lts    # 升级到最新长期维护版(lts)
  $ n xx.xx  # 升级到具体版本号
  
  #5、查看当前安装的版本号
  $ node -v
  
  #6、检查目前安装了哪些版本的node，会出现已安装的node版本，选一个就可以直接切换了
  $ n
  
  #7、删除某个版本
  $ n rm <version>
  
  #8、指定版本执行js文件
  $ n use 7.4.0 index.js
  ```

  

* **2）nvm命令**

  ```shell
  $ nvm list 或 nvm ls: 查看已安装的node.js
  $ nvm install 20.11.1: 安装20.11.1版本node
  $ nvm use 20.11.1: 切换node到指定的nodejs版本
  ```

  详见下文nvm
  
  
  
#### 3）基本用法

  [菜鸟教程](https://www.runoob.com/nodejs/nodejs-tutorial.html)

  

### 2、nginx







### 3、web项目常规搭建步骤

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
$ npm install yarn
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



### 4、其他

#### 1）切换镜像源 - 推荐使用yrm工具

```shell
#1、vim 编辑配置文件
-- 1.编辑
$ vim ~/.nrmrc # 编辑
registry=https://registry.npm.taobao.org
home=https://npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
electron_custom_dir="7.1.7"
 
$ vim ~/.bashrc # 编辑
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
export NVM_IOJS_ORG_MIRROR=http://npm.taobao.org/mirrors/iojs
export ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/

-- 2.生效
$ source ~/.bashrc

-- 3.删除
$ rm ~/.nrmrc
$ rm ~/.bashrc

#2、npm config get/set
-- 1.查看镜像源使用状态：
$ npm config get registry
-- 2.设置镜像源：
$ npm config set registry https://registry.npmjs.org/
-- 3.清除缓存：
$ npm cache clean -f
-- 4.检查：
$ npm config list

#3、yarn config get/set
-- 1.查看
$ yarn config get registry #  查看
$ yarn config list # 查看所有
-- 2.设置
$ yarn config set registry http://10.10.27.63:4873/ # 切换-ecology
$ yarn config set registry https://registry.npmmirror.com/ --global
$ yarn config set electron_mirror 'https://mirrors.huaweicloud.com/electron/',
$ yarn config set electron_builder_binaries_mirror 'https://mirrors.huaweicloud.com/electron-builder-binaries/'
-- 3.删除
$ yarn config delete electron_mirror


#4、常用镜像源
-- 1.官方镜像：
$ npm config set registry https://registry.npmjs.org/
$ yarn config set registry https://registry.yarnpkg.com/ -- 备选
-- 2.淘宝镜像：
$ npm config set registry http://registry.npm.taobao.org
$ npm config set registry https://registry.npmmirror.com/ -- 更新
-- 3.腾讯镜像：
$ npm config set registry https://mirrors.cloud.tencent.com/npm/
-- 4.华为镜像：
$ npm config set registry https://mirrors.huaweicloud.com/repository/npm/
$ npm config set disturl https://mirrors.huaweicloud.com/nodejs/
$ npm config set electron_mirror https://mirrors.huaweicloud.com/electron/

-- 1.yarn 国内源
$ yarn config set registry https://registry.npmmirror.com/ --global  && \
$ yarn config set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass --global  && \
$ yarn config set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ --global  && \
$ yarn config set puppeteer_download_host https://registry.npmmirror.com/binary.html --global  && \
$ yarn config set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver --global  && \
$ yarn config set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver --global  && \
$ yarn config set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs --global  && \
$ yarn config set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium --global  && \
$ yarn config set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector --global
-- 2.npm 国内源
$ npm set registry https://registry.npmmirror.com/ && \
$ npm set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass && \
$ npm set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ && \
$ npm set puppeteer_download_host https://registry.npmmirror.com/binary.html && \
$ npm set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver && \
$ npm set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver && \
$ npm set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs && \
$ npm set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium && \
$ npm set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector && \
$ npm cache clean --force
```



* 镜像源示例

  执行 **yarn config list** 后: 

  ```javascript
  yarn config v1.22.18
  info yarn config
  {
    'version-tag-prefix': 'v',
    'version-git-tag': true,
    'version-commit-hooks': true,
    'version-git-sign': false,
    'version-git-message': 'v%s',
    'init-version': '1.0.0',
    'init-license': 'MIT',
    'save-prefix': '^',
    'bin-links': true,
    'ignore-scripts': false,
    'ignore-optional': false,
    registry: 'http://10.10.27.63:4873/',
    'strict-ssl': true,
    'user-agent': 'yarn/1.22.18 npm/? node/v16.15.1 darwin arm64',
    electron_builder_binaries_mirror: 'https://mirrors.huaweicloud.com/electron-builder-binaries/',
    electron_mirror: 'https://mirrors.huaweicloud.com/electron/',
    lastUpdateCheck: 1723113503272,
    'sass-binary-site': 'http://npm.taobao.org/mirrors/node-sass'
  }
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
# 安装npm
-- 方法一：下载安装nodejs，即可自动安装npm命令
-- 方法二：

# 安装node_modules依赖
$ npm run install 或 $ npm run i
	在git clone项目的时候，项目文件中并没有 node_modules文件夹，项目的依赖文件可能很大。直接执行，npm会根据package.json配置文件中的依赖配置下载安装。
--【参数说明】：
-global=-g，全局安装，安装后的包位于系统预设目录下
--save=-S，安装的包将写入package.json里面的dependencies，dependencies：生产环境需要依赖的库
--save-dev=-D，安装的包将写入packege.json里面的devDependencies，devdependencies：只有开发环境下需要依赖的库
--force=-f，强制安装
--verbose，可以尝试打印更详细的错误信息

# 常用命令
$ npm -version 或 npm -v: 查看版本号（检查安装是否成功）
$ npm run install xxx: 安装指定模块
$ npm run start: 运行项目
$ npm uninstall npm -g: 卸载
$ npm cache clean --force: 清理缓存


```



### 4、yarn 

Yarn是facebook发布的一款取代npm的包管理工具。主要特点：
- 速度超快。
- Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
- 超级安全。
- 在执行代码之前，Yarn 会通过算法校验每个安装包的完整性。
- 超级可靠。
- 使用详细、简洁的锁文件格式和明确的安装算法，Yarn 能够保证在不同系统上无差异的工作。

```shell
# 安装yarn命令
$ npm install yarn -g

$ yarn upgrade [package]:  # 升级到最新版本
$ yarn upgrade [package]@[version]:  # 升级到指定版本

$ yarn -v：yarn版本
$ yarn init：初始化项目
$ yarn add <package-name@版本号> <--dev> <-D>：安装具体的某个包,未指定@版本号时，默认最新
$ yarn remove <package-name>： 删除具体的某个包
$ yarn serve：运行项目
$ yarn build：编译项目
$ yarn cache clean --force: 清除yarn缓存
$ yarn list <package-name>：查看版本号

# 手动下载安装，如：https://registry.npmmirror.com/fs-xattr/-/fs-xattr-0.3.1.tgz
$ yarn add file:/path/to/fs-xattr-0.3.1.tgz

# 切换镜像仓库
$ yarn config get registry # 查看
$ yarn config set registry http://10.10.27.63:4873/ # 切换
```

[yarn官网](https://yarn.bootcss.com/docs/usage.html)



### 5、nvm

-- 用于多版本管理, [windows安装包下载地址](https://github.com/coreybutler/nvm-windows/releases)

```shell
-- 1、安装nvm
$ brew install nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc  
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc  # 路径需根据实际安装位置调:ml-citation{ref="3" data="citationList"}  
source ~/.zshrc  # 立即生:ml-citation{ref="3,7" data="citationList"}  


$ nvm list 或 nvm ls: 查看已安装的node.js
$ nvm install 20.11.1: 安装20.11.1版本node
$ nvm use 20.11.1: 切换node到指定的nodejs版本

$ nvm ls-remote ：列出所有远程服务器的版本（官方node version list）
$ nvm list (可简化为nvm ls)：列出所有已安装的 node 版本
$ nvm list available ：显示所有可下载的版本
$ nvm install stable ：安装最新版 node
$ nvm install [node版本号] ：安装指定版本 node
$ nvm uninstall [node版本号] ：删除已安装的指定版本
$ nvm use [node版本号] ：切换到指定版本 node
$ nvm current ：当前 node 版本 nvm alias [别名] [node版本号] ：给不同的版本号添加别名
$ nvm unalias [别名] ：删除已定义的别名 nvm alias default [node版本号] ：设置默认版本
```





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



### 7、yrm

​	方便切换镜像源

```shell
$ yarn add yrm --global 									# 安装

$ yrm -h 																	# 帮助
$ yrm ls 																	# 查看
$ yrm test 																# 测速
$ yrm add weaver http://10.10.27.63:4873 	# 添加私有源
$ yrm use <weaver> 												# 切换
$ yrm del <镜像名称>												# 删除
```



### 8、npx

​	`npx` 是 Node.js 的 ‌**npm 包执行工具**‌，随 npm 5.2+ 版本内置。它的核心作用是简化 npm 包的执行流程，无需全局安装即可直接运行命令

```bash
$ npx jest # 若本地 node_modules/.bin 中存在已安装的包（如 jest），直接运行
$ npx create-react-app my-app  # 临时安装并执行远程包（完成后自动清理），无需全局安装 
$ npx npm-check-updates  # 检查项目依赖的最新版本
$ npx node@14 script.js  # 使用 Node.js 14 执行脚本
$ npx -p cowsay -p lolcatjs 'cowsay "Hello" | lolcatjs' # 安装多个包后执行命令

```



### 9、iconutil

`iconutil` 是 macOS 自带的命令行工具，可以将 `.iconset` 文件夹转换为 `.icns` 文件

```bash
 1、创建一个文件夹，命名为 myicon.iconset（名称可以自定义，但必须以 .iconset 结尾）。
  在该文件夹中放置不同分辨率的 PNG 图片，文件名必须遵循以下格式：
  icon_16x16.png
  icon_16x16@2x.png
  icon_32x32.png
  icon_32x32@2x.png
  icon_128x128.png
  icon_128x128@2x.png
  icon_256x256.png
  icon_256x256@2x.png
  icon_512x512.png
  icon_512x512@2x.png
  @2x 表示 Retina 显示屏的高分辨率版本。
  确保所有图片的分辨率正确，并且是透明的 PNG 格式。
  
​ 2、使用 iconutil 命令生成 .icns 文件：
$ iconutil -c icns myicon.iconset -o myicon.icns

[附注]:
	以下命令支持将一张大尺寸的图片，转成小尺寸图片
	$ sips -z 16 16 icon.png --out icon_16x16.png
	$ sips -z 32 32 icon.png --out icon_32x32.png
```



### 10、upx

UPX（Ultimate Packer for eXecutables）, 能显著减小应用体积，又能确保签名有效性。 Electron生成的.exe或.dll文件（如主程序、node.dll）体积庞大（约100MB+），UPX可将其压缩至原体积的30%-50%。

下载地址：[UPX 官网](https://upx.github.io/) 或[GitHub Releases](https://github.com/upx/upx/releases/latest)

```shell
$ brew install upx # 安装

$ upx --version #查看
$ upx --best --ultra-brute --lzma --force-macos xx/compressed.exe # 压缩
$ upx --test xx/compressed.exe # 验证文件完整性


```

附打包应用：
```javascript
const upxPackedFiles_ = [];
async function runUPXCompression(file) {
  const onlyFiles = [
    'EMobile10.exe',
    'eteams.exe',
    '易秒办.exe',
  ];

  const excludeFiles = [
    'd3dcompiler_47.dll',
    'vcruntime140.dll',
    'libEGL.dll'
  ];

  if (onlyFiles.length > 0 && !onlyFiles.some(item => file.indexOf(item) > -1)) {
    console.warn('非仅NPX压缩:', file);
    return;
  }

  if (upxPackedFiles_.some(item => item === file)) {
    console.warn('已经NPX压缩:', file);
    return;
  }

  if (excludeFiles.some(item => file.indexOf(item) > -1)) {
    console.warn('排除NPX压缩:', file);
    return;
  }

  const upxCmd = [
    'C:/Users/Administrator/Desktop/upx.exe',
    '--no-strip',
    // '--best',
    '--lzma',
    // '--ultra-brute', // 太慢了
    '--force',
    `"${file}"`
  ].join(' ');

  // console.log(`UPX压缩:`, upxCmd, file);
  console.log(`UPX压缩:`, file);

  try {
    execSync(upxCmd, { stdio: 'inherit' });
  } catch (error) {
    if (error.status === 255) {
      console.warn('文件已被压缩，跳过');
    } else {
      console.error('UPX压缩失败:', error);
      // process.exit(1);
    }
  }

  upxPackedFiles_.push(file);
}
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



### 2、error An unexpected error occurred: "https://registry.npmjs.org/[sass](https://so.csdn.net/so/search?q=sass&spm=1001.2101.3001.7020): connect ETIMEDOUT 104.16.19.35:443".

​	出现了上述错误，一般是代理的问题，可尝试将 node-sass 镜像源进行设置成国内的，操作如下

```shell
$ yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
$ yarn add sass node-sass -dev
```



### 3、error:0308010C:digital envelope routines::unsupported

   [参考文档](https://blog.csdn.net/m0_65933139/article/details/130690790)

​	如果出现了 "node: --openssl-legacy-provider is not allowed in NODE_OPTIONS" 的错误提示，这个错误是因为 node.js V17版本中最近发布的OpenSSL3.0, 而OpenSSL3.0对允许算法和密钥大小增加了严格的限制，可能会对生态系统造成一些影响.

目前可以通过运行以下命令行临时解决这个问题

```bash
# 方法一：
# Linux & Mac OS：
export NODE_OPTIONS=--openssl-legacy-provider
export NODE_OPTIONS="${NODE_OPTIONS/--openssl-legacy-provider/}"

#Windows
set NODE_OPTIONS=--openssl-legacy-provider
set NODE_OPTIONS=%NODE_OPTIONS:--openssl-legacy-provider=%

# 方法二：
$ env:NODE_OPTIONS="--openssl-legacy-provider"

# 方法三：
卸载Node.js17+版本，安装Node.js17-版本（合适的版本）
```











## 五、细节深入
### 1、devDependencies 和 dependencies 的区别
​	[彻底搞懂devDependencies 和 dependencies 的区别！](https://blog.csdn.net/zz_jesse/article/details/139348751)





>巨人的肩膀：
>[Mac安装npm全面指南](https://blog.csdn.net/m0_60437766/article/details/132116277)
>[mac安装brew小白指引](https://blog.csdn.net/ganyingxie123456/article/details/132182152)
>[nvm安装教程与nvm常见命令，超详细！](https://blog.csdn.net/2301_78542842/article/details/139241143)
>[yarn global add 位置 yarn dev](https://blog.51cto.com/u_16099264/7874185)
>[yarn的安装和使用全网最详细教程](https://www.jb51.net/javascript/306925vlj.htm)

