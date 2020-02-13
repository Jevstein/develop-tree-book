[TOC]

# GNU make

## 前言
我们的工程开发会用到大量的开源项目，对GNU开源项目的编译，一般有以下步骤：
```shell
./configure
sudo make
sudo make install
```
那这个过程是如何工作起来的呢？而且有时候它还能生成一些编译的头文件，比如我们经常看到的config.h，这个config.h还能控制make选择部分源码进行编译，这又是如何工作的呢？

一般Makefile都是手工写的，而对于大型工程而言手工写还是比较有挑战的，幸运的是GNU这个开源的组织提供了Autoconf和Automake来编写Makefile。


> 参考:   
> 《动脑学院.lee老师》