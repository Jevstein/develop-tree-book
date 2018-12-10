<!-- vscode-markdown-toc -->
* 1. [docker原理](#docker)
* 2. [docker安装](#docker-1)
	* 2.1. [Ubuntu安装](#Ubuntu)
		* 2.1.1. [系统要求](#)
		* 2.1.2. [卸载旧版本](#-1)
		* 2.1.3. [更新apt-get](#apt-get)
		* 2.1.4. [安装可选内核模块](#-1)
		* 2.1.5. [安装基本软件](#-1)
		* 2.1.6. [安装 Docker CE](#DockerCE)
		* 2.1.7. [测试docker](#docker-1)
		* 2.1.8. [启动docker](#docker-1)
		* 2.1.9. [建立docker用户组](#docker-1)
		* 2.1.10. [测试 Docker 是否安装正确](#Docker)
		* 2.1.11. [镜像加速](#-1)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# docker实践

##  1. <a name='docker'></a>docker原理
##  2. <a name='docker-1'></a>docker安装
###  2.1. <a name='Ubuntu'></a>Ubuntu安装
####  2.1.1. <a name=''></a>系统要求
Docker CE 支持以下版本的 Ubuntu 操作系统：
* Bionic 18.04 (LTS)
* Artful 17.10 (Docker CE 17.11 Edge +)
* Xenial 16.04 (LTS)
* Trusty 14.04 (LTS)

Docker CE 可以安装在 64 位的 x86 平台或 ARM 平台上。Ubuntu 发行版中，LTS（Long-
Term-Support）长期支持版本，会获得 5 年的升级维护支持，这样的版本会更稳定，因此在
生产环境中推荐使用 LTS 版本,当前最新的 LTS 版本为 Ubuntu 18.04。

####  2.1.2. <a name='-1'></a>卸载旧版本
旧版本的 Docker 称为 docker 或者 docker-engine ，使用以下命令卸载旧版本：
```
$ sudo apt-get remove docker docker-engine docker.io
```

####  2.1.3. <a name='apt-get'></a>更新apt-get
```
$ sudo apt-get update
```

####  2.1.4. <a name='-1'></a>安装可选内核模块

```
$ sudo apt-get install \
    linux-image-extra-$(uname -r) \
    linux-image-extra-virtual
```
**注: Ubuntu 16.04+ 上的 Docker CE默认使用`overlay2`存储层驱动, `无需手动配置`。**

####  2.1.5. <a name='-1'></a>安装基本软件
* 由于apt源使用HTTPS以确保软件下载过程中不被篡改。因此，我们首先需要添加使用HTTPS传输的软件包以及CA证书：
```
$ sudo apt-get install apt-transport-https ca-certificates curl software-properties-common lrzsz -y
```
* 为了确认所下载软件包的合法性，需要添加软件源的GPG密钥。并向source.list中添加Docker软件源。
    * 使用官方推荐源 {`不推荐`}
    ```
    $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

    $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

    ```
    * **使用阿里云的源 {推荐}**
    
    ```
    $ curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

    $ sudo add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
    ```

    * **使用国内其它源 {推荐}**
    ```
    $ curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

    $ sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
    ```
* 注意：如果遇到"curl: (1) Protocol "https" not supported or disabled in libcurl"错误，根据错误提示需要解决curl对https协议的支持.
```
$ curl --version
// 若是curl版本过低则升级重装

$ curl-config --protocols
// 查看可支持的协议

$ cd /home/**/curl-7.61.1/
$ ./configure
// 发现：“SSL support: no (--with-ssl / --with-gnutls)”
// 即：不支持SSL/https

$ vim /etc/ld.so.conf
// 在这里面将openssl生成的库文件所在目录加入，并使用命令ldconfig刷新缓存

$ ./configure --prefix=/usr/local/curl --with-ssl=/usr/local/ssl

// 重装curl
$ make
$ sudo make install
```

####  2.1.6. <a name='DockerCE'></a>安装 Docker CE
更新apt软件包缓存，并安装docker-ce
```
// 软件源升级
$ sudo apt-get update

$ sudo apt-get install docker-ce -y
```

**[附注]**: 
* 可指定查看版本和指定版本安装docker
```
//查看支持的docker版本
$ sudo apt-cache madison docker-ce

//指定版本安装docker：
$ sudo apt-get install docker-ce=<VERSION> -y
```
* 也可用脚本安装
```
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
```

####  2.1.7. <a name='docker-1'></a>测试docker
```
$ sudo docker version
```

####  2.1.8. <a name='docker-1'></a>启动docker
```
$ sudo systemctl enable docker
$ sudo systemctl start docker
```

Ubuntu 14.04 请使用以下命令启动：
```
$ sudo service docker start
```

####  2.1.9. <a name='docker-1'></a>建立docker用户组
默认情况下， docker命令会使用Unix socket与Docker引擎通讯。而只有root用户和docker组的用户才可以访问Docker引擎的Unix socket。出于安全考虑，一般Linux系统上不会直接使用root用户。因此，更好地做法是将需要使用docker的用户加入docker
用户组。
* 建立docker组：
```
$ sudo groupadd docker
```
* 将当前用户加入 docker 组：
```
$ sudo usermod -aG docker $USER
```

####  2.1.10. <a name='Docker'></a>测试 Docker 是否安装正确
```
$ docker run hello-world
```
正常将输出：
```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
ca4f61b1923c: Pull complete
Digest: sha256:be0cd392e45be79ffeffa6b05338b98ebb16c87b255f48e297ec7f98e123905c
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
This message shows that your installation appears to be working correctly.
To generate this message, Docker took the following steps:
1. The Docker client contacted the Docker daemon.
2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
(amd64)
3. The Docker daemon created a new container from that image which runs the
executable that produces the output you are currently reading.
4. The Docker daemon streamed that output to the Docker client, which sent it
to your terminal.
To try something more ambitious, you can run an Ubuntu container with:
$ docker run -it ubuntu bash
Share images, automate workflows, and more with a free Docker ID:
https://cloud.docker.com/
For more examples and ideas, visit:
https://docs.docker.com/engine/userguide/
```

####  2.1.11. <a name='-1'></a>镜像加速
鉴于国内网络问题，后续拉取Docker镜像十分缓慢，强烈建议安装Docker之后配置国内镜像加速。。Docker官方和国内很多云服务商都提供了国内加速器服务，例如：
* Docker官方提供的中国registry mirror      
https://registry.docker-cn.com

* 七牛云加速器  
https://reg-mirror.qiniu.com/

* daocloud      
http://guide.daocloud.io/dcs/daocloud-9153151.html

当配置某一个加速器地址之后，若发现拉取不到镜像，请切换到另一个加速器地址。国内各大云服务商均提供了Docker镜像加速服务，建议根据运行Docker的云平台选择对应的镜像加速服务。    
下面介绍daocloud的使用:

1.访问https://dashboard.daocloud.io 网站，登录daocloud账户;   
2.选择“项目”，并点击右上角的“加速器”;    
3.选择linux，拷贝新窗口处显示的一条命令，如："curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://e5d212cc.m.daocloud.io";   
4.执行命令
```
// 执行命令
$ curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://e5d212cc.m.daocloud.io
 
// 修改daemon.json文件，增加"insecure-registries"内容
$ cat /etc/docker/daemon.json
{"registry-mirrors": ["http://e5d212cc.m.daocloud.io"], "insecure-registries": []}
 
//注意：
//docker cloud加速器的默认内容是少了一条配置，所以我们要编辑文件在后面加上绿色背景的内容，然后再重启docker

//重启docker
$ systemctl restart docker
```












> 参考:     
> 《docker-ce入门》     
> 《docker_practice/docker 从入门到实际》
