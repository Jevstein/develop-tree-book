[TOC]

# mac实用技巧

## 1、解决Mac看不见隐藏系统文件

​	输入终端命令，注意空格和大小写 

```shell
#1、显示隐藏文件
$ defaults write com.apple.finder AppleShowAllFiles -bool true 
#或
$ defaults write com.apple.finder AppleShowAllFiles YES

#2、不显示隐藏文件
$ defaults write com.apple.finder AppleShowAllFiles -bool false
#或
$ defaults write com.apple.finder AppleShowAllFiles NO
```

​	**重启Finder即可！**

快捷键显示或隐藏文件及文件夹：**Command + Shift + .**  （即命令键、Shift键和句号键同时按下）

 

## 2、解决在网页上下载的软件, 不在启动台出现的问题

```shell
$ defaults write com.apple.dock ResetLaunchPad -bool true
$ killall Dock
```



## 3、截屏、录屏

```shell
Shift-Command-5
```



## 4、安全性与隐私

### 1）允许从以下位置下载的应用程序下，无“任何来源”

```shell
$ sudo spctl --master-disable
```

