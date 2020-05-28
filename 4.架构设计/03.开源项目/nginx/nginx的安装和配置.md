[TOC]

# nginx的安装和配置

## 1.安装

### 1.1.mac下的安装

* 1.brew自动安装

  ```shell
  #1.安装Command Line tools
  $ xcode-select --install
  
  #2.安装brew
  $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  $ brew update
  
  #3.安装nginx
  $ brew install nginx
  
  #4.验证
  nginx安装好后，在浏览器访问（默认端口为8080），输入：http://localhost:8080/ 
  则可看到nginx在本计算机搭建的服务器
  ```

  * 安装路径：

  ```shell
  #配置文件:
  /usr/local/etc/nginx/nginx.conf
  #可执行文件:
  /usr/local/Cellar/nginx
  /usr/local/Cellar/openssl@1.1
  ```

  

* 2.官网[下载](http://nginx.org/en/download.html)安装

  ```shell
  
  ```




## 2.运行

```shell
#运行
$ nginx

#停止
$ nginx -s stop
```

* 批处理脚本

  ```shell
  #start.bat
  
  #stop.bat
  
  #restart.bat
  ```

  

## 3.配置

```shell

```

