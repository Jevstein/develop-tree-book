[TOC]

# mac实用技巧

## 1.解决Mac看不见隐藏系统文件

​	输入终端命令，注意空格和大小写 

### 1.1.显示隐藏文件

```shell
$ defaults write com.apple.finder AppleShowAllFiles -bool true 
#或者
$ defaults write com.apple.finder AppleShowAllFiles YES
```

### 1.2.不显示隐藏文件

```shell
$ defaults write com.apple.finder AppleShowAllFiles -bool false
#或者
$ defaults write com.apple.finder AppleShowAllFiles NO
```

​	**重启Finder即可！**

 
