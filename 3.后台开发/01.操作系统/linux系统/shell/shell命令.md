# shell

## 1.shell命令

## 2.shell脚本
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

> 巨人的肩膀：
> [shell脚本编写法则](https://www.jianshu.com/p/0eee6e408bee)
> [Shell脚本传递参数的4种方式（位置参数、特殊变量、环境变量和命名参数）实例说明](https://blog.csdn.net/ken2232/article/details/132020592)
