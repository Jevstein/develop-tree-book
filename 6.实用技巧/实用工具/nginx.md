[TOC]

# nginx

## 1.安装
## 1.1.mac安装
命令式安装
```shell
#1、更新brew 
   $brew update

#1、查询要安装的软件是否存在
   $brew search nginx

#2、查看安装信息
   $brew info nginx

#3、正式安装
   $brew install nginx
   brew install nginx后，也会同时安装nginx的相关依赖

#4、查看nginx版本
   $nginx -v

#5、运行
   $nginx
   $nginx -c nginx.config

#6、查看运行状态
   $ps -ef | grep nginx

#7、重新运行
   $nginx -s reload

#7、终止运行
   $nginx -s stop
```

## 2.使用

## 3.常用命令
```shell
    ./nginx -v #查看nginx 版本
    ./nginx  #启动命令
    ./nginx -s stop #关闭命令
    ./nginx -s reload #重新加载命令
    ./nginx -c nginx.config #指定配置文件启动
    ./nginx -t -c nginx.config #检查指定配置文件是否正确
    
    #查看nginx 监听了哪些端口
    ps -ef  | grep nginx
    netstat -anp | grep ${pid} # pid 为上面查询出来的nginx进程号

```

## 4.shell脚本
```shell
   # ! /bin/bash

   # $1命令：help、start、restart、stop
   # $2命令：×.conf

   echo "The first argument is $1" 
   echo "The second argument is $2"

   path='/opt/homebrew/Cellar/nginx/1.25.2/bin/'
   if [$1 == 'help' || $1 == '']; then
      echo '帮助：'
      echo '帮助：'
   fi

   /opt/homebrew/Cellar/nginx/1.25.2/bin/nginx -c /opt/homebrew/etc/nginx/nginx_weapp-inc-release.conf
```

> 巨人的肩膀：
> [最新版XMind Zen水印去除](https://www.jianshu.com/p/efaad7a099fe)
> [Xmind ZEN永久使用（非破解）](http://www.manongjc.com/article/39182.html)





