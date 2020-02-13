[TOC]

# git

## 1.git的原理
## 2.git的使用
## 3.git server的搭建

## 4.git常用命令

### 4.1.恢复本地误删除的文件

* 1.命令：

```shell
$git reset HEAD [ 被删除的文件或文件夹 ]	
$git checkout [ 被删除的文件或文件夹 ]
```

* 2.示例：假如误删了文件"../../script.py", 操作如下：

```shell
$git reset HEAD ../../script.py
$git checkout ../../script.py
```

