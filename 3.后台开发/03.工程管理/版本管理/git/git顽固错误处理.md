[TOC]

# git错误处理
##  1. 对象文件为空（object-file-is-empty）解决方案
###  1.1. 背景介绍
​	在日常开发过程中我们可能因为操作不当导致git版本库出问题，最经常出的一个问题就是对象文件为空错误object-file-is-empty，一般提示如下所示：  
```shell
error: object file .git/objects/31/65329bb680e30595f242b7c4d8406ca63eeab0 is empty
fatal: loose object 3165329bb680e30595f242b7c4d8406ca63eeab0 (stored in .git/objects/31/65329bb680e30595f242b7c4d8406ca63eeab0) is corrupt
```

###  1.2. 解决方案
​	git init重头开始，最暴力最直接解决方案，但是这样之前的commit就没有了，短期的还好，长期的项目提交全不见了，貌似不太好

​	git clone/fetch克隆或拉取其他人的项目，这样可以回溯到那个人项目的最新提交记录，可以挽救一些，万一你的项目比他新好多呢

​	总之，以上都不是最优的解决方案，最优的解决方案，就是我们可以恢复本机项目原本的git log记录，修一下坏的节点就好

###  1.3. 最优解决方案

1.运行: git fsck --full  
```shell
luyi@ubuntu:~/projects/example$ git fsck --full
error: object file .git/objects/3a/60046cdd45cf3e943d1294b3cb251a63fb9552 is empty
error: object file .git/objects/3a/60046cdd45cf3e943d1294b3cb251a63fb9552 is empty
fatal: loose object 3a60046cdd45cf3e943d1294b3cb251a63fb9552 (stored in .git/objects/3a/60046cdd45cf3e943d1294b3cb251a63fb9552) is corrupt
```
2. 选中空文件，删除 rm filepath  
```shell
luyi@ubuntu:~/projects/example$ rm .git/objects/3a/60046cdd45cf3e943d1294b3cb251a63fb9552
rm: remove write-protected regular empty file ‘.git/objects/3a/60046cdd45cf3e943d1294b3cb251a63fb9552’? y
```
3.再次运行 git fsck --full 一般会检查到另外一个新的空文件，再删之。一劳永逸的办法就是在.git目录下```find . -type f -empty -delete -print``` 会删除全部空文件
```shell
luyi@ubuntu:~/projects/example/.git$ find . -type f -empty -delete -print
./objects/c6/492f7ad72197e2fb247dcb7d9215035acdca7f
./objects/9f/fe81f4bb7367c00539a9a0d366ff2a7558bfed
./objects/7c/b9a39246389a8417006b9365f6136823034110
./objects/de/1092e8c90cb025e99501a4be0035753b259572
./objects/6f/a8c9109f2e0d29095490ca8f4eaf024a6e2dcb
```
4.至此，所有空文件删除完毕，再运行 git fsck --full，还是有错，head指向元素不存在，是之前一个空文件，我们已经删了。肿么办呢？
```shell
luyi@ubuntu:~/projects/example/.git$ git fsck --full
Checking object directories: 100% (256/256), done.
Checking objects: 100% (103719/103719), done.
error: HEAD: invalid sha1 pointer c6492f7ad72197e2fb247dcb7d9215035acdca7f
error: refs/heads/ia does not point to a valid object!
dangling blob 2a12b47881cd879987df8e50c9d900847c025bf4
dangling blob 5d4a7c616f0e59dd82608979e85d56f7a6785884
dangling blob cd6facde8c37f8389c12f3742185174a0536197b
dangling blob c2d0c0fba535d89cca9633d1b0ab780c8199dfd9
dangling blob 5117513970702f484278fd87732135a39588a073
dangling blob ac45f1874a0e42a6b9586594179f9825f3a40fd0
dangling blob c3355ad882b378740822e673d304e2cc091f1412
dangling blob 4d64dedf9f3518f25f7b7e3b1ad0dd6b477e0ce3
dangling blob 2487eae5cc4bfc23bc896c4051cb8f5522664e33
dangling blob 2a1907848af8aea53cb84e392225a5b6c4a81a5b
dangling blob 114233d9981a7933eacbff45a2b106ef1b61cfa9
dangling blob 9879ef3dd84a5515719fa7f35f982ac4d6a34e37
dangling blob f5b3bfd49e04c18ad12d590450a306a109b9151c
dangling blob 5fdb9f048aead1c85474fbca29b2ee327c821680
```
5.手动获得最后两条reflog ,运行tail -n 2 .git/logs/refs/heads/ia
```shell
luyi@ubuntu:~/projects/example$ tail -n 2 .git/logs/refs/heads/ia
3a0ecb6511eb0815eb49a0939073ee8ac8674f8a 99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5 卢祎 <luy@jjmmw.com> 1477039998 +0800    commit: nested into app
```
6.head当前是指向最新的那一条记录，所以我们看一下parent commit 即倒数第二条提交 git show 
``` shell
99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5
luyi@ubuntu:~/projects/example$ git show 99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5commit 99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5
Date:   Fri Oct 21 16:53:18 2016 +0800

    nested into app

diff --git a/pzbm/templates/pzbm/base.html b/pzbm/templates/pzbm/base.html
index 70331c5..c96d12c 100644
--- a/pzbm/templates/pzbm/base.html
+++ b/pzbm/templates/pzbm/base.html
@@ -6,7 +6,7 @@
```
我们可以看到内容，是好着的

7.那么我们就重新设置head,使其指向倒数第二条 git update-ref HEAD 99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5
```shell
luyi@ubuntu:~/projects/example$ git update-ref HEAD 99cb711e331e1a2f9b0d2b1d27b3cdff8bbe0ba5
luyi@ubuntu:~/projects/example$ git s
On branch ia
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    modified:   pzbm/templates/pzbm/invest_advisor/reports.html
```
8.最后提交以下新代码就OK了。这样保留下来我们的git log记录，只是修一下坏的节点而已

> 参考:     
> 1.[git错误：对象文件为空（object-file-is-empty）解决方案](https://segmentfault.com/a/1190000008734662)     