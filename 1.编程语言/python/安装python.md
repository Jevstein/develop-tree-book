[TOC]

# 安装python

## 1.mac下的python安装

### 1.1.升级新版本

​	Mac系统自带python，但是一般都是python的低版本，如下在终端输入命令可查看当前的python版本号：

```shell
$python -V
Python 2.7.10
```

​	低版本Python 2.7到2020年就会停止维护了，因此，很有必要将其升级。又因为mac有些软件依赖于自带python，所以不建议删除之前的老版本，而是让老版本和新版本共存。以下为升级步骤：

* 1.[官网下载](https://www.python.org/downloads/mac-osx/)最新版本(或指定版本)，本文下载的是：python-3.8.1-macosx10.9.pkg

* 2.点击下载好的pkg文件进行安装

* 3.安装完成后，默认安装路径为：/Library/Frameworks/Python.framework/Versions/3.8

* 4.修改profile文件

​	   1). 在终端输入命令：

```shell
$open ~/.bash_profile
```

​		打开~/.bash_profile后，添加：alias python="/Library/Frameworks/Python.framework/Versions/3.8/bin

如下：

```shell
# Setting PATH for Python 3.8
# The original version is saved in .bash_profile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.8/bin:${PATH}"
export PATH

alias python="/Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8"
```

​	2). 添加完成后command+s保存，再到终端输入命令：source ~/.bash_profile，则最终生效。此时查看版本号则为最新版本，如下：

```shell
$ source ~/.bash_profile
$ python -V
Python 3.8.1
```

### 1.2.兼容旧版本

​	以上第一步就完成了pyhon新版本的升级，同时也兼容了旧版本。如果想恢复到旧版本，只需更新~/.bash_profile，注释掉alias python那行即可，如下：

```shell
$open ~/.bash_profile

# Setting PATH for Python 3.8
# The original version is saved in .bash_profile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.8/bin:${PATH}"
export PATH

# alias python="/Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8"

$ source ~/.bash_profile
$ python -V
Python 2.7.10
```

注：<font color=red>这里实际测试和预期不一样，即使已经注释了，Python 2.7.10也没有出现，而且../Versions/目录下也没有原来2.7.10的相关版本，似乎安装新版本的时候自动将其覆盖了。但是，在上一步的source ~/.bash_profile操作之前，是有python2.7.10的。</font>

### 1.3.彻底删除旧版本



## 2.windows的python安装

