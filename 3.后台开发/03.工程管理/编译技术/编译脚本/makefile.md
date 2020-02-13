[TOC]

# makefile
##  1. 简单介绍
  Makefile用来指定规则，make是一个解释makefile中指令的命令工具。一般来说，大多数的IDE都有这个命令，比如：Delphi的make，Visual C++的nmake，Linux下GNU的make。当编译工程时，只要输入make就会去编译，那么这个make命令执行的时候一定需要一个Makefile文件，通过这个Makefile告诉make命令需要怎么样的去编译和链接程序。  
  make的工作规则是：
* 1.如果这个工程没有编译过，那么所有的C文件都要编译并被链接。
* 2.如果这个工程的某几个C文件被修改，那么只需编译被修改的C文件，并链接目标程序。
* 3.如果这个工程的头文件被改变了，那么我们需要编译引用这几个头文件的C文件，并链接目标程序。  
  只要Makefile写得够好，所有的这一切，只用一个make命令就可以完成，make命令会自动智能地根据当前的文件修改的情况来确定哪些文件需要重编译，从而自己编译所需要的文件和链接目标程序。

##  2. 核心规则
* 核心目的  
不管源码文件结构多么复杂，makefile的最终目的都是为了实现一个目标，如: `"g++ -g -o app *c -I*h -l*lib"`.

* 核心语法
```makefile
target ... : prerequisites ...
	command
	 ...
	 ...
```
* 语法说明
	* target ：`目标文件`  
	可以为Object File、执行文件、标签。  
	* prerequisites ：`先决条件`  
	生成target所需要的文件或目标。
	* command：`执行命令`  
	即make需要执行的命令，也可以是任意的Shell命令。  
	**<font color=red>注意：这行一定要以Tab键作为开头</font>**

* 核心原理  
Makefile中最核心的内容就是**建立一个文件的依赖关系**。  
上述语法可简单描述为："target这一个或多个的目标文件依赖于prerequisites中的文件，其生成规则定义在command中"。也就是说，prerequisites中如果有一个或一个以上的文件比target文件的修改日期要新，command所定义的命令就会被执行。


##  3. 示例演练
###  3.1. 原始规则
```makefile
nty_http_server : nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o nty_http_server.o
    gcc -o nty_http_server nty_http_server.o nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o -lpthread
nty_coroutine.o:nty_coroutine.c nty_coroutine.h
    gcc -c nty_coroutine.c
nty_epoll.o:nty_epoll.c nty_coroutine.h
    gcc -c nty_epoll.c
nty_schedule.o:nty_schedule.c nty_coroutine.h
    gcc -c nty_schedule.c
nty_socket.o:nty_socket.c nty_coroutine.h
    gcc -c nty_socket.c
nty_http_server.o:nty_http_server.c nty_coroutine.h
    gcc -c nty_http_server.c

clean :
    rm -rf *.o
```
* 工作原理  
gcc或g++编译的基本方式依旧是：`首先将源码文件(.c)通过gcc -c编译成目标文件(.o), 然后将目标文件(.o)通过gcc -o编译成最终的二进制可执行文件(nty_http_server/.exe)`。而makefile的作用就是组织好各文件的复杂关系，用一个make命令完成gcc或g++的整个过程。而这个复杂关系，正是**从结果（二进制可执行文件）到原因（源代码），通过一级级的依赖，像堆栈一样串行起来的**。如上规则的描述：  
	* 1.首先make在当前目录下找名字为“Makefile”或“makefile”的文件。
	* -> 2.若存在makefile，则找文件中的第一个目标文件（target），即“nty_http_server”这个文件，并把这个文件作为最终的目标文件。
	* -> 3.若“nty_http_server”文件不存在，或“nty_http_server”所依赖的后面的.o文件比“nty_http_server”这个文件的修改时间新，则执行命令生成“nty_http_server”文件。
	* -> 4.若“nty_http_server”所依赖的.o文件也存在，则make会在当前文件中找目标为.o文件的依赖性，若找到则再根据那一个规则生成.o文件。
	* -> 5.最终找到.c文件和.h文件，则make会生成.o文件，然后用 .o文件生成make的终极任务，即可执行文件nty_http_server了。  

make只负责找makefile的依赖关系，在找寻的过程中，如果出现错误，比如最后被依赖的文件找不到，那么make就会直接退出并报错，而对于所定义的命令的错误，或是编译不成功，make根本不理会。  

像clean这种没有被第一个目标文件直接或间接关联，那么它后面所定义的命令将不会被自动执行。当然，可以显示要make执行，即命令“make clean”，如此清除所有的目标文件，以便重编译。

###  3.2. 使用变量
* 变量声明的方法
```makefile
OBJECTS=nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o
```
* 于是上述代码简化为：
```makefile
OBJECTS = nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o nty_http_server.o

nty_http_server : $(OBJECTS)
    gcc -o nty_http_server $(OBJECTS) -lpthread
nty_coroutine.o:nty_coroutine.c nty_coroutine.h
    gcc -c nty_coroutine.c
nty_epoll.o:nty_epoll.c nty_coroutine.h
    gcc -c nty_epoll.c
nty_schedule.o:nty_schedule.c nty_coroutine.h
    gcc -c nty_schedule.c
nty_socket.o:nty_socket.c nty_coroutine.h
    gcc -c nty_socket.c
nty_http_server.o:nty_http_server.c nty_coroutine.h
    gcc -c nty_http_server.c

clean :
    rm -rf $(OBJECTS) nty_http_server
```
###  3.3. 自动推导

####  3.3.1. “隐晦规则”
```makefile
OBJECTS = nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o nty_http_server.o

nty_http_server : $(OBJECTS)
    gcc -o nty_http_server $(OBJECTS) -lpthread
nty_coroutine.o:nty_coroutine.h
nty_epoll.o:nty_coroutine.h
nty_schedule.o:nty_coroutine.h
nty_socket.o:nty_coroutine.h
nty_http_server.o:nty_coroutine.h

.PHONY : clean
clean :
    rm -rf $(OBJECTS) nty_http_server
```
make会自动推导文件以及文件依赖关系后面的命令。如上：只要make看到一个[.o]文件，它就会自动的把[.c]文件加在依赖关系中，如果make找到一个whatever.o，那么whatever.c就会是whatever.o的依赖文件，并且命令cc -c whatever.c也会被推导出来。

其中：“.PHONY”表示clean是个伪目标文件

####  3.3.2. 进一步简化推导
```makefile
OBJECTS=nty_coroutine.o nty_epoll.o nty_schedule.o nty_socket.o nty_http_server.o

nty_http_server : $(OBJECTS)
    gcc -o nty_http_server $(OBJECTS) -lpthread

$(OBJECTS):nty_coroutine.h

.PHONY : clean
clean :
        rm -rf $(OBJECTS) nty_http_server
```

###  3.4. 使用函数
```makefile
SOURCES=$(wildcard *.c)
OBJECTS=$(patsubst %.c,%.o,$(SOURCES))
PROGRAM=nty_http_server
CC=gcc
CFLAGS=-lpthread

$(PROGRAM) : $(OBJECTS)
    $(CC) -o $(PROGRAM) $(OBJECTS) $(CFLAGS)

$(OBJECTS):$(SOURCES)

.PHONY : clean
clean :
    rm -rf $(OBJECTS) $(PROGRAM)
```

####  3.4.1. SOURCES= $(wildcard *.c)
​	产生一个所有以 '.c' 结尾的文件的列表，然后存入变量 SOURCES 里

####  3.4.2. FILES =$(notdir $(SOURCES))
​	把上面以＇.c＇结尾的文件的文件列表中附带的路径去掉，只显示符合条件的文件名

####  3.4.3. OBJS = $(patsubst %.c，%.o，$(SOURCES))
​	patsubst（ patten substitude, 匹配替换的缩写）函数。它需要3个参数：第一个是一个需要匹配的式样，第二个表示用什么来替换它，第三个是一个需要被处理的由空格分隔的字列  
这里将处理所有在 SOURCES列个中的字（一列文件名），如果它的 结尾是 '.c' ，就用'.o' 把 '.c' 取代。注意这里的 % 符号将匹配一个或多个字符，而它每次所匹配的字串叫做一个‘柄’(stem) 。在第二个参数里， % 被解读成用第一参数所匹配的那个柄

####  3.4.4. foreach，origin，call，if then else，addprefix，dir等

####  3.4.5. 变量$@，$^，$<
* $@: 目标文件
* $^: 所有的依赖文件
* $<: 第一个依赖文件

###  3.5. 文件搜索
在一些复杂的工程中，有大量的源文件，而这许多源文件根据分类，会存放在不同的目录中。比如有文件目录如下：
```
├── include
│   ├── bar.h
│   └── foo.h
├── Makefile
└── src
    ├── bar.c
    ├── foo.c
    └── main.c
```
####  3.5.1. VPATH
```makefile
# Makefile

CC      = gcc
OBJ     = main.o foo.o bar.o

CFLAGS  = -I include

VPATH   = src:include

prog : $(OBJ)
	$(CC) -o $@ $(OBJ)

%.o : %.c
	$(CC) $(CFLAGS) -c $<

main.o : foo.h bar.h

.PHONY : clean
clean :
	-rm -f prog $(OBJ)
```

有了VPATH，当make需要去找寻文件的依赖关系时，make会在当当前目录找不到的情况下，按":"的顺序到所指定的目录中去找寻文件。

####  3.5.2. vpath
* 规则  
设置文件搜索路径的另一个方法是使用make的“vpath”关键字（注意，它是全小写的），这不是变量，这是一个make的关键字，这和上面提到的那个VPATH变量很类似，但是它更为灵活。它可以指定不同的文件在不同的搜索目录中。这是一个很灵活的功能。它的使用方法有三种：
	* 1. vpath <pattern> <directories>  
	为符合模式<pattern>的文件指定搜索目录<directories>。
	* 2. vpath <pattern>  
	清除符合模式<pattern>的文件的搜索目录。
	* 3. vpath  
	清除所有已被设置好了的文件搜索目录。

* 用法  
	* vapth使用方法中的<pattern>需要包含“%”字符。“%”的意思是匹配零或若干字符，例如，“%.h”表示所有以“.h”结尾的文件。<pattern>指定了要搜索的文件集，而<directories>则指定了的文件集的搜索的目录。例如：
	```makefile
		vpath %.h ../headers
	```
	该语句表示，要求make在“../headers”目录下搜索所有以“.h”结尾的文件。（如果某文件在当前目录没有找到的话）。   

	* 还可以连续地使用vpath语句，以指定不同搜索策略。如果连续的vpath语句中出现了相同的<pattern>，或是被重复了的<pattern>，那么，make会按照vpath语句的先后顺序来执行搜索。如：
	```makefile
	vpath %.c foo
	vpath %   blish
    vpath %.c bar
  ```
   其表示“.c”结尾的文件，先在“foo”目录，然后是“blish”，最后是“bar”目录。

	* 简化顺序搜索
	```makefile
	vpath %.c foo:bar
	vpath %   blish
  ```
  而上面的语句则表示“.c”结尾的文件，先在“foo”目录，然后是“bar”目录，最后才是“blish”目录。

* 示例

```makefile
# Makefile
CC      = gcc
OBJ     = main.o foo.o bar.o

CPPFLAGS= -Iinclude

#VPATH  = src:include
vpath %.h include
vpath %.c src

prog : $(OBJ)
	$(CC) -o $@ $(OBJ)

%.o : %.c
	$(CC) $(CPPFLAGS) -c $<

main.o : foo.h bar.h

.PHONY : clean
clean :
	-rm -f prog $(OBJ)
```
注：将CFLAGS改为CPPFLAGS，因为-I选项应该是预编译中的选项，而不是编译选项。

###  3.6. Debug & Release

先看debug和release版本之间两行不一样的地方：
```shell
@objcopy --only-keep-debug bin/Release/Server bin/Release/Server.symbol

@objcopy --strip-debug bin/Release/Server
```

man一下objcopy，发现手册里解释如下:
```shell
objcopy - copy and translate object files.

--strip-debug
Do not copy debugging symbols or sections from the source file.
不从源文件中拷贝调试符号或段。

--only-keep-debug
Strip a file, removing contents of any sections that would not be stripped by --strip-debug and leaving the debugging sections intact.
从文件中抽离--strip-debug所剩下的内容。正好与--strip-debug相反，是就是留下完整的调试信息。

```



####  3.6.1. .symbol
调试方法
* 可以在gdb启动时制定symbol文件:
	```shell
	$ gdb -s Server.symbol -e Server -c core
	```
* 也可以在gdb运行过程中加载:
	```shell
	$gdb Server core
	#(这里中间略去gdb启动的信息)
	(gdb) symbol-file Server.symbol
	```
###  3.7. 顶级工程
####  3.7.1. RTSP_PullerModule
请看: [RTSP_PullerModule](https://github.com/zhiyong0804/RTSP_PullerModule.git)

####  3.7.2. docker3
目录结构
 ```
├── bin
│   └── demo
├── lib
│   └── static_library.a
├── include
│   └── *.h
└── src
    ├── demo
	│	├── *.cpp
    │   └── makefile
    ├── static_library
    │   └── *.cpp
    └── share_library
    │   └── *.cpp
    └── makefile
 ```

请看: /dnpractice/examples/docker/docker3

###  3.8. 编译多个main文件
####  3.8.1. 应用场景  
当自己平时看书、看教程、或编写简单程序，往往发现在一个目录下会创建n个源码文件(如.c文件)，而这里的每一个.c文件都含有一个main函数(即每一个.c文件都生成一个app)。此时如果每一个.c文件都配置一个makefile，或每一个.c文件都手敲`"gcc -g -o app app.c"`命令，则显得异常繁琐。是否可以写一个makefile,就可以编出n个应用程序呢? 

####  3.8.2. 设计思路  
* 1.将文件夹下每个.c文件都视为一个程序，编译出来程序的名字（目标）与.c文件的文件名相同（去掉.c后缀），比如app1.c编译出来的程序为app1。实现这个目的的Makefile片断为：
	```shell
	SOURCE = $(wildcard *.c)
	TARGETS = $(patsubst %.c, %, $(SOURCE))
	```
* 2.每个.c文件独立编译为一个目标。若直接手写，则对应命令类似如下:  
	```shell
	gcc app1.c -o app1
	gcc app2.c -o app2
	gcc test.c -o test
	```
* 3.上述代码其实可以抽象为如下:
	```makefile
	$(TARGETS):%:%.c
	$(CC) $< $(CFLAGS) -o $@
	```
	这段脚本厉害了，其中:  
	I)."TARGETS"表示为: app1, app2, test;  
	II).依赖"%:%c": 这是一个模式变量，表示与目标相同的.c文件，展开即为：  
	```makefile
	app1:app1.c
	app2:app2.c
	test:test.c
	```

* 4.于是makefile完整如下
	```makefile
	SOURCE = $(wildcard *.c)
	TARGETS = $(patsubst %.c, %, $(SOURCE))
	
	CC = gcc
	CFLAGS = -Wall -g
	
	all:$(TARGETS)
	
	$(TARGETS):%:%.c
		$(CC) $< $(CFLAGS) -o $@
	
	.PHONY:clean all
	clean:
		-rm -rf $(TARGETS)
	```

####  3.8.3. 详情用例
```makefile
# 1.CONFIG
DEBUG 		= YES
SOURCE 		= $(wildcard *.c)
TARGETS 	= $(patsubst %.c, %, $(SOURCE))

# 2.TOOL CHAIN
CC 			= gcc
CFLAGS 		= -Wall -g
MKDIR_P     = mkdir -p
CP          = cp
RM			= rm
INSTALL		= $(CP)
EXPORET		= $(CP)

ifeq ($(DEBUG), YES)
    OBJ_DIR	= Debug
else
    OBJ_DIR	= Release
endif

# 3.OUTPUT
all: $(TARGETS)

clean:
	-rm -rf $(OBJ_DIR)

# 4.RULE
$(TARGETS):%:%.c
	@$(MKDIR_P) $(OBJ_DIR) ..
	$(CC) $< $(CFLAGS) -o $(OBJ_DIR)/$@

# .PHONY
.PHONY:clean all
```

###  3.9. 其它技巧
####  3.9.1. 通过gcc的-D选项传递变量给C源文件  
* DEBUG 定义  
	一般地，gcc中使用宏，可在程序中写这样的代码段：  
	```  c
	#ifdef DEBUG   
		printf("Debug is define!\n");   
	#endif
	```
	那么可在编译时，传递DEBUG定义，实现Debug版本和Release版本的区别，如下:   
	```shell
	gcc -DDEBUG -o ttt a.c b.c   # debug
	gcc -o ttt a.c b.c           # release

	gcc -UDEBUG -o ttt a.c b.c   #取消宏定义
	```
* 全局变量传递  
	类似的，也可以将Makefile(或者shell)的变量通过gcc的-D宏定义选项传递给C源文件。尤其在一些特别的场合需要把Makefile中定义的变量作为C源代码的初始值.比如__DATE__宏是C已经预定义的宏,但有时候不喜欢该宏的日期格式，则可以自定义。如：    
      
    makefile:
	```makefile
	STR_A = "Hello!"
	STR_B = $(shell date --rfc-3339=date)

	all:
		gcc -DSTR_INFO=\"$(STR_A)\" -DSTR_DATE=\"$(STR_B)\" -DDEBUG -o test main.c

	clean:
		rm -fr *.o test

	# .PHONY
	.PHONY: clean all
	```
  
	测试源码
	```c
	#include <stdlib.h>
	#include <string.h>
	#include <stdio.h>

	const char info[] = STR_INFO;//来自Makefile的宏定义
	const char date[] = STR_DATE;//来自Makefile的宏定义

	int main()
	{
		printf("%s\n", info);
		printf("%s\n", date);
		
	#ifdef DEBUG//来自Makefile的宏定义
		printf("DEBUG: YES\n");
	#else
		printf("DEBUG: NO\n");
	#endif
		
		return 0;
	}
	```
* make时还可以追加宏  
	```shell
	make local_all  "CPPFLAGS += -DSWM_DEBUG"
	```

#### 3.9.2. gcc的几个参数

* -m32/-m64: -m32为生成32位的动态链接库，-m64位生成64位的动态链接库。

  ```shell
  $g++ -m32 hello1.cpp hello2.cpp -fPIC -shared -o ../lib/linux32/libhello.so
  ```

* -Wl,--rpath：运行时链接动态链接库目录的地址

  ```shell
  $g++ -m32 hello.cpp -o hello -L/lib/linux32/ -lname -Wl,--rpath=/lib/linux32/  
  ```


##  4. 常用的make命令及其参数

**注意： makefile文件中的$(MAKE)支持（包含）命令参数**

###  4.1. make -f <makefile>
	选择指定的makefile文件

###  4.2. make -jN
	N为进程数量 

###  4.3. make -n
	“--just-print”
	“--dry-run”
	“--recon”
	不执行参数，这些参数只是打印命令，不管目标是否更新，把规则和连带规则下的命令打印出来，但不执行，这些参数对于我们调试makefile很有用处。

###  4.4. make DEBUG:=YES

###  4.5. make -t
	“-t”
	“--touch”
	这个参数的意思就是把目标文件的时间更新，但不更改目标文件。也就是说，make假装编译目标，但不是真正的编译目标，只是把目标变成已编译过的状态。

###  4.6. make -q
	“-q”
	“--question”
	这个参数的行为是找目标的意思，也就是说，如果目标存在，那么其什么也不会输出，当然也不会执行编译，如果目标不存在，其会打印出一条出错信息。

###  4.7. make -W <file>
	“-W <file>”
	“--what-if=<file>”
	“--assume-new=<file>”
	“--new-file=<file>”
	这个参数需要指定一个文件。一般是是源文件（或依赖文件），Make会根据规则推导来运行依赖于这个文件的命令，一般来说，可以和“-n”参数一同使用，来查看这个依赖文件
	所发生的规则命令。

###  4.8. make -p
	“-p”
	“--print-data-base”
	输出makefile中的所有数据，包括所有的规则和变量。这个参数会让一个简单的makefile都会输出一堆信息。
	   如果你只是想输出信息而不想执行 makefile，你可以使用“make -q -p”命令。
	   如果你想查看执行makefile前的预设变量和规则，你可以使用“make –p –f /dev/null”。这个参数输出的信息会包含着你的makefile文件的文件名和行号，所以，用这个参数来调试你的makefile会是很有用的，特别是当你的环境变量很复杂的时候。



> 参考:     
> 1.《动脑学院.lee老师》     
> 2.[Makefile VPATH和vpath](https://blog.csdn.net/mcgrady_tracy/article/details/27240139)  
> 3.[gdb使用symbol文件调试程序](https://www.jianshu.com/p/7050a8f8841c)  
> 4.[Makefile经典教程(最牛X的教程)](http://blog.csdn.net/wed110/article/details/34853475)  
> 5.[一次编译多个目标](https://blog.csdn.net/yychuyu/article/details/79950414)  [(另附源码)](https://github.com/yychuyu/makefile-demo/blob/master/single/Makefile)