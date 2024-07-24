[TOC]

# git使用指南



## 一、git的原理



## 二、git的使用



## 三、git server的搭建



## 四、git使用命令

![Git常用命令速查表](.\images\git常用命令.jpg)



### 1、环境配置命令

```shell
$ git config --global user.name <your name>
$ git config --global user.email <your_email@example.com>
$ git config --global push.default simple
$ git config --global core.quotepath false			#解决中文乱码
$ git config --global core.editor /usr/bin/vim
$ git config --global credential.helper store
$ git config --global credential.helper wincred
$ git config --global core.ignorecase false
$ git config --global pull.rebase false #此时拉取，Git会默认使用merge来合并代码，而不是rebase。注意：rebase=改变历史，merge=保留历史

#附注：windows下可通过git的配置文件编辑和修改信息，目录如：
C:\Users\用户名\.gitconfig文件
```



### 2、常用命令合集

```shell
# 1、新项目
$ git clone 'http://xxx/yyy.git'
$ git init

# 2、切换分支
$ git checkout <分支名称>
$ git checkout -b <分支名称> # 新建分支

# 3、添加文件
$ git add .
$ git add ./xxx/xxx.md

-- 1）撤销
	$ git rm xxx
	$ git rm cached --xxx
	
-- 2）改名
	$ git mv xxx yyy

# 4、提交
$ git commit -m 'xxx'
*日志格式可参考：
  1）fix(input): no.23035 修复Input输入英文无法显示的问题
  2）feat(input): no.23036 新增autoFocus参数用于自动获取焦点
  3）perf(input): no.23037 优化Input输入卡顿的问题
  4）docs(input): no.23036 添加autoFocus功能示例
  5）test(input): no.23038 添加Input autoFous功能的单元测试
  
-- 1）撤销
	$ git reset --soft HEAD^ #保留更改内容
	$ git reset --soft <commit_hash>^
	$ git reset --hard HEAD^ #完全撤销
	$ git reset --hard <commit_hash>^

-- 2）修改最后一次提交[日志]
	$ git commit --amend

# 5、查看
$ git status
$ git diff xxx

# 6、推送
$ git push

# 7、拉取
$ git pull
$ git pull origin xxx # 分支拉取且合并

-- 1）建议用merge（保留历史）方式pull，且自行解决冲突
	$ git config --global pull.rebase false

# 8、标签

# 9、日志
$ git log
$ git log -p xxx
$ git blame xxx


```



### 3、常用命令解析

#### 1）恢复本地误删除的文件

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



#### 2）修改分支名称

假设分支名称为oldName，想要修改为 newName

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



### 4、常见错误处理

#### 1）fatal: Authentication failed for ...
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

  

#### 2）You have divergent branches and need to specify how to reconcile them...

执行“git pull origin test”时报错，如：

* 问题：

  ```shell
  ➜git:(test) git pull origin test
  hint: You have divergent branches and need to specify how to reconcile them.
  hint: You can do so by running one of the following commands sometime before
  hint: your next pull:
  hint: 
  hint:   git config pull.rebase false  # merge
  hint:   git config pull.rebase true   # rebase
  hint:   git config pull.ff only       # fast-forward only
  hint: 
  hint: You can replace "git config" with "git config --global" to set a default
  hint: preference for all repositories. You can also pass --rebase, --no-rebase,
  hint: or --ff-only on the command line to override the configured default per
  hint: invocation.
  fatal: Need to specify how to reconcile divergent branches.
  ```

* 翻译：

  ```shell
  ➜git:(test) git pull origin test
  提示: 您有不同的分支，需要指定如何协调它们。
  提示: 您可以通过在之前某个时间运行以下命令之一来做到这一点
  提示: 你的下一招:
  提示: 
  提示: git config pull.rebase false 	# 合并(默认策略)
  提示: git config pull.rebase true  	# Rebase
  提示: git config pull.ff only	 	# 仅快进
  提示: 
  提示: 可以将“git config”替换为“git config——global”来设置默认值
  提示: 首选所有存储库。你也可以传递——rebase，——no-rebase，
  提示: 或命令行上的——ff-only，以覆盖配置的默认per
  提示: 调用。
  fatal: 需要指定如何协调不同的分支。
  ```

* 解决：

  ​	由于拉取pull分支前，进行过[merge](https://so.csdn.net/so/search?q=merge&spm=1001.2101.3001.7020)合并更新分支操作，而其他人在你之前已经push过一个版本，导致版本不一致。可以执行`git config pull.rebase false`，则默认将pull下来的代码与现有改动的代码进行合并；若造成代码冲突，需要自行处理
  
  ```shell
  git config pull.rebase false
  ```

  
  
  





> 巨人的肩膀：
> [Git 运行配置（git config）](https://www.jianshu.com/p/f29ca723db4f)