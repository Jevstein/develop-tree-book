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



## 5、查看app安装位置

如： 查看当前的python3安装在哪了？

```bash
-- 1.which
$ which python3
/usr/local/bin/python3

-- 2.type
$ type python3
python3 is /usr/local/bin/python3

-- 3. 使用ls命令结合which命令
$ ls -l $(which python3)
会显示Python 3的可执行文件的详细信息，包括它的权限、所有者、大小和最后修改时间等

-- 4. 使用python3 -m site
python3 -m site

-- 5. 使用brew（如果你通过Homebrew安装
$ brew --prefix python3
/usr/local/Cellar/python/3.x.x/bin/python3
```

