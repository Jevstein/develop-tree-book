[TOC]

# shell使用指南

## 1、常用命令



## 2、脚本示例
shell脚本（shell script）：指将各类命令预先放入到一个文件中，方便一次性执行的一个程序文件，脚本名以 .sh结尾（扩展名sh代表shell）

1、示例：
```shell
  #!/bin/bash 第一行：指定该文件执行的程序，一般默认为bash
  echo "The first argument is $1" 
  echo "The second argument is $2"

  a='test1'                     # 定义一个静态变量
  echo $a                       # 打印变量a的内容
  b=`date`                      # 定义一个动态变量
  echo $b                       # 打印变量b的内容
  if [ '$a' = 'test1' ] then    # if判断语句，括号内必须要有空格[ 空格 xx=yy 空格]
    echo "输出"$a
  fi
```

2、执行
  1）shell脚本不能执行时，需要给shell脚本赋权限：chmod +x test.sh
  2）执行一个文件名为test.sh的shell脚本：
    常规模式： /xxx/xxx/test.sh   或者  ./test.sh；
    debug模式：
      (1) sh -x test.sh    （用于开发时调试）
      (2) 在shell脚本第一行加入参数 -x： #!/bin/bash -x
  3）传参执行
    ./script.sh hello world

## 3、常用技巧

### 1）输出带颜色的字体

```bash
#!/bin/bash

#字体色范围：30-37
$ echo -e "\033[30m 黑色字 \033[0m"
$ echo -e "\033[31m 红色字 \033[0m"
$ echo -e "\033[32m 绿色字 \033[0m"
$ echo -e "\033[33m ×××字 \033[0m"
$ echo -e "\033[34m 蓝色字 \033[0m"
$ echo -e "\033[35m 紫色字 \033[0m"
$ echo -e "\033[36m 天蓝字 \033[0m"
$ echo -e "\033[37m 白色字 \033[0m"

#字背景颜色范围：40-47
$ echo -e "\033[40;37m 黑底白字 \033[0m"
$ echo -e "\033[41;30m 红底黑字 \033[0m"
$ echo -e "\033[42;34m 绿底蓝字 \033[0m"
$ echo -e "\033[43;34m 黄底蓝字 \033[0m"
$ echo -e "\033[44;30m 蓝底黑字 \033[0m"
$ echo -e "\033[45;30m 紫底黑字 \033[0m"
$ echo -e "\033[46;30m 天蓝底黑字 \033[0m"
$ echo -e "\033[47;34m 白底蓝字 \033[0m"
```



### 2）相对路径切换到输入命令后的那个文件夹

如执行命令:  $ ./weapp-em-desktop/harmony

```bash
#!/bin/bash
# 切换到工作目录: ./weapp-em-desktop/harmony
work_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$work_dir"
```

此时，bash脚本中执行的命令，其工作目录（或相对目录）为./weapp-em-desktop/harmony下；而不再是终端输入时所在的目录



> 巨人的肩膀：
> [shell脚本编写法则](https://www.jianshu.com/p/0eee6e408bee)
> [Shell脚本传递参数的4种方式（位置参数、特殊变量、环境变量和命名参数）实例说明](https://blog.csdn.net/ken2232/article/details/132020592)
> [shell中echo打印有颜色字体](https://blog.51cto.com/u_16099199/12186602)
