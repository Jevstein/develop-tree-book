[TOC]

# tree: 树形展示所有文件

## 1.安装

### 1.1.mac下的安装

```shell
$ ruby -e"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew update
$ brew search tree

$ brew install tree  #安装
```

​	【**暴力操作**】:  <font color=red>brew下载后，发现使用不了。找到tree执行文件，剪切到"/usr/local/bin"目录，成功！</font>

* **不安装tree却拥有tree功能的骚操作**：

```shell
 #1.find命令
 $ find . -print | sed -e's;[^/]*/;|____;g;s;____|; |;g'
 
 #2.仿tree：将find写入~/.bash_profile, 使用别名tree作为命令
 $ open ~/.bash_profile
 	 alias tree="find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'"
 $ source ~/.bash_profile
 $ tree
```



### 1.2.linux下的安装

```shell
# 1.centOS下的安装：
$ yum -y install tree

#2.Ubuntu下安装：
$ sudo apt-get install tree
```



### 1.3.windows下的安装

​	Windows下CMD可以使用`dir` 命令来以树结构打印目录文件，Powershell 工具可以使用 `tree` 命令。故可以直接使用命令：

```shell
# /F 显示每个文件夹中文件的名称。（带扩展名）
# /A 使用ASCII字符，而不使用扩展字符。(显示中文)
$ tree /f /A >tree.txt
```

但是，为了更接近于linux，常使用Git-Bash 作为命令行工具，那就需要安装tree，步骤如下：

* 1.从[Tree for Windows](https://link.jianshu.com/?t=http%3A%2F%2Fgnuwin32.sourceforge.net%2Fpackages%2Ftree.htm)中选择下载 `Binaries zip`文件

* 2.解压，找到bin/tree.exe，复制

* 3.粘贴到“C:\\Program Files\Git\usr\bin"，完成！

  

## 2.使用

```shell
$ tree --help
$ tree -N -L 3 -I "images" > dir.txt
$ tree -N -L 2
.
├── 1.编程语言
│   ├── assembly
│   ├── c
│   ├── c++
│   ├── go
│   ├── java
│   ├── lua
│   ├── objective-c
│   └── python
├── 2.前端开发
│   └── 前端开发
├── 3.后台开发
│   ├── 01.操作系统
│   ├── 02.环境搭建
│   ├── 03.工程管理
│   ├── 04.数据结构
│   ├── 05.进程管理
│   ├── 06.网络原理
│   ├── 07.内存管理
│   ├── 08.线程管理
│   └── 09.存储管理
├── 4.架构设计
│   ├── 01.高级算法
│   ├── 02.设计模式
│   ├── 03.开源项目
│   ├── 04.SDK开发
│   ├── 05.系统专栏
│   ├── 06.集群专栏
│   ├── 07.分布式架构
│   ├── 08.工程化管理
│   ├── 09.高性能优化
│   └── 10.网络安全
├── 5.专业领域
│   ├── 01.音视频开发
│   └── 02.区块链技术
├── 6.实用技巧
└── 7.项目实践
```



