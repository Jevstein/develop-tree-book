[TOC]

# nginx

## 1.安装
### 1.1.mac安装
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

#8、终止运行
   $nginx -s stop
   $sudo killall nginx
   
#9.卸载
		$brew uninstall nginx
```

## 2.使用

```shell
$nginx -c nginx.config
$nginx -s reload
$nginx -s stop
```



## 3.命令
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

# $1命令：help、start、restart、stop、view、info
# $2命令：dev、release、beta、prod、pg
exe_path="/opt/homebrew/Cellar/nginx/1.25.2/bin/"
conf_path="/opt/homebrew/etc/nginx/"

if [[ $1 = "start" ]]; then
  ${exe_path}nginx -s stop
  if [[ $2 = "dev" ]]; then
    ${exe_path}nginx -c ${conf_path}nginx_weapp-dev.conf
  elif [[ $2 = "release" ]]; then
    ${exe_path}nginx -c ${conf_path}nginx_weapp-release.conf
  elif [[ $2 = "beta" ]]; then
    ${exe_path}nginx -c ${conf_path}nginx_weapp-beta.conf
  elif [[ $2 = "prod" ]]; then
    ${exe_path}nginx -c ${conf_path}nginx_weapp-prod.conf
  elif [[ $2 = "pg" ]]; then
    ${exe_path}nginx -c ${conf_path}nginx_weapp-pg.conf
  else
    ${exe_path}nginx -c ${conf_path}nginx_weapp-dev.conf
  fi
  ps -ef | grep nginx
elif [[ $1 = "restart" ]]; then
  ${exe_path}nginx -s reload
  ps -ef | grep nginx
elif [[ $1 = "stop" ]]; then
  ${exe_path}nginx -s stop
  ps -ef | grep nginx
elif [[ $1 = "view" ]]; then
  ps -ef | grep nginx
elif [[ $1 = "info" ]]; then
  nginx -v
  brew info nginx
else
  nginx -v
  echo "========= 当前进程 ========="
  ps -ef | grep nginx
  echo "========= 命令提示 ========="
  echo "1、帮助: ./nginx.sh 或 ./nginx.sh help"
  echo "2、查看: ./nginx.sh view"
  echo "3、运行"
  echo "  ./nginx.sh start dev"
  echo "  ./nginx.sh start release"
  echo "  ./nginx.sh start beta"
  echo "  ./nginx.sh start prod"
  echo "  ./nginx.sh start pg"
  echo "4、重启: ./nginx.sh restart"
  echo "5、关闭: ./nginx.sh stop"
  echo "6、安装信息: ./nginx.sh info"
fi
```

> 巨人的肩膀：
> 





