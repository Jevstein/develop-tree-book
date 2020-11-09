[TOC]

# git常用命令汇总

## 一、常用命令

### 1.修改分支名称

​	假设分支名称为oldName，想要修改为 newName

* 1）本地分支重命名(还没有推送到远程)

  ```shell
  $ git branch -m oldName newName
  ```

* 2）远程分支重命名 (已经推送远程-假设本地分支和远程对应分支名称相同)

  ```shell
  #a.重命名远程分支对应的本地分支
  $ git branch -m oldName newName
  
  #b. 删除远程分支
  $ git push --delete origin oldName
  
  #c. 上传新命名的本地分支
  $ git push origin newName
  
  #d.把修改后的本地分支与远程分支关联
  $ git branch --set-upstream-to origin/newName
  ```

  
  
## 二、常见错误

### 1.fatal: Authentication failed for
* 解决：

```shell
#1、配置用户信息
git config --global user.name [username]
git config --global user.email [email]

#2、查询用户信息
git config --list

#3、如果push遇到在输入密码是熟错后，就会报这个错误fatal: Authentication failed for
git config --system --unset credential.helper
#之后你在push就会提示输入名称和密码
```

