[TOC]

# Beyond Compare永久试用

​	Beyond Compare每次启动后会先检查注册信息，试用期到期后就不能继续使用。解决方法是在启动前，先删除注册信息，然后再启动，这样就可以永久免费试用了。

## 1.mac版

* 1.[下载](https://www.scootersoftware.com/download.php)安装

* 2.进入Mac应用程序目录下，找到刚刚安装好的Beyond Compare，路径如下: /Applications/Beyond Compare.app/Contents/MacOS。

* 3.修改启动程序文件BCompare为BCompare.real。

* 4.在当前目录下新建一个文件BCompare，文件内容如下：

  ```shell
  #!/bin/bash
  rm "/Users/$(whoami)/Library/Application Support/Beyond Compare/registry.dat"
  "`dirname "$0"`"/BCompare.real $@
  ```

* 5.保存BCompare文件

* 6.修改文件的权限

  ```shell
  $ chmod a+x /Applications/Beyond\ Compare.app/Contents/MacOS/BCompare
  ```

* 7.启动Beyond Compare。enjoy it!

  

## 2.windows版

* 1.[下载](https://www.scootersoftware.com/download.php)安装

* 2.删除文件：BC4Key.txt、BCState.xml

   * 删除注册表信息，重新计算30天过期，如：

    ```shell
    regedit:
    删除： 计算机\HKEY_CURRENT_USER\Software\Scooter Software\Beyond Compare 4\CacheId
    ```

  * 同理，可写一个批处理, 如下：

    ```shell
    #reuse_bc.bat
    reg delete "HKEY_CURRENT_USER\Software\Scooter Software\Beyond Compare 4" /v CacheID /f
    ```
  
  *附加一个序列号：
  
  ```shell
  #Beyond Compare Version 4.0 (build 18847)/BCompare-4.0.0.18847.1418105535序列号:
  H1bJTd2SauPv5Garuaq0Ig43uqq5NJOEw94wxdZTpU-pFB9GmyPk677gJ
  vC1Ro6sbAvKR4pVwtxdCfuoZDb6hJ5bVQKqlfihJfSYZt-xVrVU27+0Ja
  hFbqTmYskatMTgPyjvv99CF2Te8ec+Ys2SPxyZAF0YwOCNOWmsyqN5y9t
  q2Kw2pjoiDs5gIH-uw5U49JzOB6otS7kThBJE-H9A76u4uUvR8DKb+VcB
  rWu5qSJGEnbsXNfJdq5L2D8QgRdV-sXHp2A-7j1X2n4WIISvU1V9koIyS
  NisHFBTcWJS0sC5BTFwrtfLEE9lEwz2bxHQpWJiu12ZeKpi+7oUSqebX+
  ```

