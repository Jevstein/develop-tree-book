[TOC]

# web环境完全安装指南



https://blog.csdn.net/m0_60437766/article/details/132116277

## 一、环境安装



### 1、node.js

#### 1、安装node.js

TODO: ...

 [images](../../1.编程语言/rust/images) node.js安装成功后，将自动安装上npm，检查如下：

```shell
node -v
npm -v
```



#### 2、mac用node.js的多版本管理器n来升级和切换

```shell
#1、清除node.js的cache
sudo npm cache clean -f 

#2、使用npm安装n模块
sudo npm install -g n

#3、查看node所有版本
npm view node versions

#4、切换版本
sudo n latest # 升级到最新版本
sudo n stable # 升级到稳定版本
sudo n xx.xx  # 升级到具体版本号

#5、查看当前安装的版本号
node -v

#6、检查目前安装了哪些版本的node，会出现已安装的node版本，选一个就可以直接切换了
n
```



### 2、nvm

-- 用于多版本管理

## 二、常用命令

### 1、npm命令

```shell
#  -g 安装到全局环境下
npm install yarn -g
```





### 2、yarn 命令

参考：https://blog.51cto.com/u_16099264/7874185

```shell
yarn add xxx：安装具体的某个包
yarn serve：运行项目
yarn build：编译项目
yarn -v：yarn版本
yarn init：初始化项目
yarn remove <package-name>： 删除
```





## 三、打包、发布