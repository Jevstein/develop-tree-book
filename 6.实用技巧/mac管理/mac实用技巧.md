[TOC]

# mac实用技巧

## 1.解决Mac看不见隐藏系统文件

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

 

## 2、解决在网页上下载的软件, 不在启动台出现的问题

```shell
$ defaults write com.apple.dock ResetLaunchPad -bool true
$ killall Dock
```



## 3、截屏、录屏

```shell
Shift-Command-5
```

