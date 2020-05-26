[TOC]

# nginx环境搭建

## 1.下载安装

* 1.[官网下载](http://nginx.org/en/download.html)

* 2.配置conf

* 3.启动nginx

  * windows启动脚本

  ```bat
  @echo off
  nginx.exe -c conf/nginx_im.conf
  echo nginx已启动。
  pause
  
  @echo off
  tskill nginx
  nginx.exe -c conf/nginx_im.conf
  echo nginx已启动。
  pause
  
  @echo off
  tskill nginx
  echo 已终止所有nginx进程。
  ```

  

