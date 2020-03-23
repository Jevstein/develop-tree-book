[toc]

# scp免密码传输文件

## 1.背景需求

* 1.将本机MatchServerWJD 拷贝到192.168.0.128，如：

  ```shell
  $ scp -P 22 MatchServerWJD wolfplus@192.168.0.128:/home/wolfplus/sbin/wjdebug/match/
  ```

* 2.SCP简介
  　　SCP(Secure Copy,安全复制)是一个在远程（本地与远程）服务器间安全的进行文件传输的方法。它以SSH协议为基础，使用SSH协议的22端口。
* 3.SCP无密码传输原理
  　　将**来源服务器A**中的密钥文件 "./.ssh/**id_rsa.pub**"内容， 拷贝到**目标服务器B**的"./.ssh/**authorized_keys**"，建立信任关系。

## 2.操作环境
**来源服务器A**，IP：192.168.0.232；
**目标服务器B**，IP：192.168.0.128；
实现：A免密码输入拷贝文件到B。

## 3.操作方法
   1.在**来源服务器A** 上执行如下命令来生成配对密钥：**ssh-keygen -t rsa**
　　1). 切换到ssh目录中，如：`cd .ssh`；
　　2). 输入命令：`ssh-keygen -t rsa`；
　　3). 下一步输入文件名, 如： `id_rsa`；
　　4). 下一步Enter same passphrase again，设为：`空`
 如： 
![在这里插入图片描述](https://img-blog.csdn.net/20180929100603563?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pldnN0ZWlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
如此便生成两文件：
       ![在这里插入图片描述](https://img-blog.csdn.net/20180929100821952?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pldnN0ZWlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

   2. 将**来源服务器A** /home/yiwenqiang/.ssh/ 目录中的 id_rsa.pub 文件复制到**目标服务器B** 的 /home/wolfplus/.ssh/ 目录中，并改名为 **authorized_keys**。 如： `scp -P 22 id_rsa.pub wolfplus@192.168.0.128:/home/wolfplus/.ssh/authorized_keys`
![在这里插入图片描述](https://img-blog.csdn.net/20180929100900678?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pldnN0ZWlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
![在这里插入图片描述](https://img-blog.csdn.net/2018092910091193?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pldnN0ZWlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
    至此，从**来源服务器A**scp拷贝文件到**目标服务器B**就不需要密码了。

   3.注意：
　　1.用**sudo**命令
　　2.第2步中复制文件时可能 ~/.ssh/ **目录并不存在**，需要手动创建。
　　3.在第2步中如果机器中**已经存在authorized_keys文件**，那么这个文件可能包含多个SSH验证信息，这时要用 **cat >>** 命令将内容附加上去。如：
　　1）.首先在**来源服务器A** 上执行 ：
          `scp -P 22 id_rsa.pub wolfplus@192.168.0.128:/home/wolfplus/.ssh/s.pub`
　　2）.然后在**目标服务器B**上执行 ：
          `cat ~/.ssh/s.pub >> ~/.ssh/authorized_keys`
          

   ## 4.验证需求

```shell
$ scp -P 22 MatchServerWJD wolfplus@192.168.0.128:/home/wolfplus/sbin/wjdebug/match/
```
  ![在这里插入图片描述](https://img-blog.csdn.net/20180929100936635?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pldnN0ZWlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
`Successfully！`

<font color=gray size=1>
参考:
https://www.cnblogs.com/wayne173/p/5505863.html
https://wenku.baidu.com/view/fef1a25fe87101f69f319509.html
</font>