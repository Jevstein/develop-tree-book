<!-- vscode-markdown-toc -->
* 1. [环境搭建](#)
	* 1.1. [linux下安装Golang的SDK](#linuxGolangSDK)
	* 1.2. [ mac下安装Golang的SDK](#macGolangSDK)
		* 1.2.1. [下载sdk安装包](#sdk)
		* 1.2.2. [配置Go环境变量GOPATH和GOBIN](#GoGOPATHGOBIN)
		* 1.2.3. [编辑测试demo：](#demo)
		* 1.2.4. [问题总结](#-1)
* 2. [初识go](#go)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


# golang
##  1. <a name=''></a>环境搭建
###  1.1. <a name='linuxGolangSDK'></a>linux下安装Golang的SDK
[下载安装包SDK(需翻墙)](https://golang.org/dl/)  
[安装SDK包指导](https://blog.csdn.net/liuli9/article/details/81003869)  

安装步骤:  
```
$ wget https://dl.google.com/go/go1.12.2.linux-amd64.tar.gz
$ sudo tar -C /usr/local -xzf go1.12.2.linux-amd64.tar.gz
$ vim $HOME/.profile
  export PATH=$PATH:/usr/local/go/bin
$ source $HOME/.profile
$ go version
$ go env

环境变量配置：
$ sudo vim /etc/profile  #对所有用户起作用
  export GOROOT=/usr/local/go
  export GOPATH=/home/bruce/goProject 
  export GOBIN=$GOPATH/bin
  export PATH=$PATH:$GOROOT/bin
  export PATH=$PATH:$GOPATH/bin
```

###  1.2. <a name='macGolangSDK'></a> mac下安装Golang的SDK
参考: [Mac下安装与配置Go语言开发环境](https://www.cnblogs.com/hopkings/p/5809850.html)  

####  1.2.1. <a name='sdk'></a>下载sdk安装包  
[官网sdk安装包](https://storage.googleapis.com/golang/go1.7.darwin-amd64.pkg)

####  1.2.2. <a name='GoGOPATHGOBIN'></a>配置Go环境变量GOPATH和GOBIN   
　　（1）打开终端，cd ~  
（2）查看是否有.bash_profile文件：  
　　　　  ls -all  
（3）有则跳过此步，没有则：  
　　　　1）创建：touch .bash_profile  
　　　　2）编辑：open -e .bash_profile  
　　　　3）自定义GOPATH和GOBIN位置：   
```
    export GOPATH=/Users/***/Desktop/studio/YiTechStudio/labgo/
    export GOBIN=$GOPATH/bin
    export PATH=$PATH:$GOBIN
```   
　　注意: 其中，GOPATH是用来告诉Golang命令和其他相关工具，在哪里可以找到你系统上的Go包目录。GOPATH是一个路径列表，类似于PATH的设置  

　　（4）编译：source .bash_profile  
　　　*查看Go环境变量：go env  
　　  或者：go version  
####  1.2.3. <a name='demo'></a>编辑测试demo：  
　　（1）在GOPATH下新建项目(文件夹)，然后新建测试文件并保存测试内容：
```
    /**
    * 测试项目：/Users/hopkings/www/Go/Test/  
        或 ~/www/Go/Test/
    * 文件路径：
        /Users/hopkings/www/Go/Test/main.go
    */
    package main
    
    import (
        "fmt"
    )
    
    func main() {
        fmt.Println("hello world!");
    }
```

　　（2）运行测试 - 终端运行：  
```
    /**
    * 生成编译文件
    * @output:
    *          [ `go build main.go` | done: 1.151276122s ]
    */
    go build ~/www/Go/Test/main.go
 
    /**
    * 只查看运行结果
    * @output:
    *         hello world!
    */
    go run ~/www/Go/Test/main.go　

```

####  1.2.4. <a name='-1'></a>问题总结  
1.若在item中输入：go env  
显示zsh: command not found: go  
解决：
```
    打开 .zshrc
    加入 export PATH=$PATH:/usr/local/go/bin
    打开新页面 输入go env
```

##  2. <a name='go'></a>初识go
```
func 函数名(参数列表)(返回值列表) { //函数体
}

对应的一个实例如下:
func Compute(value1 int, value2 float64)(result float64, err error) { //函数体
}
```