[TOC]

# git

## 1.git的原理
## 2.git的使用
## 3.git server的搭建

## 4.git常用命令

![Git常用命令速查表](.\images\git常用命令.jpg)

### 4.1. 环境配置

```shell
$ git config --global user.name <your name>
$ git config --global user.email <your_email@example.com>
$ git config --global push.default simple
$ git config --global core.quotepath false			#解决中文乱码
$ git config --global core.editor /usr/bin/vim
$ git config --global credential.helper store
$ git config --global credential.helper wincred
$ git config --global core.ignorecase false

#附注：windows下可通过git的配置文件编辑和修改信息，目录如：
C:\Users\用户名\.gitconfig文件
```

> 参考：[Git 运行配置（git config）](https://www.jianshu.com/p/f29ca723db4f)



### 4.2. 其它

#### 恢复本地误删除的文件

* 1.命令：

```shell
$ git reset HEAD [ 被删除的文件或文件夹 ]	
$ git checkout [ 被删除的文件或文件夹 ]
```

* 2.示例：假如误删了文件"../../script.py", 操作如下：

```shell
$ git reset HEAD ../../script.py
$ git checkout ../../script.py
```

