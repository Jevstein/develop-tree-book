[TOC]

# protobuf的跨平台安装和多语言应用

## 1.前言

​	写个例子，演示在不同的操作系统、不同的编程语言使用protobuf的方法。例子的源目录结构如下：

```shell
.
├── demo
│   └── cpp
│       └── main.cpp
├── lib
│   └── libprotobuf.a  #<--- 从/usr/local/protobuf/lib拷贝来的
├── proto
│   └── addressbook.proto
└── src								 #<--- 通过protoc编译生成的对应addressbook.proto的各种语言源码文件的目录
```

### 1.1.定义protobuf协议

　　.proto文件是protobuf一个重要的文件，它定义了需要序列化数据的结构。一般使用protobuf的3个步骤是：

* 1.在.proto文件中定义消息格式

* 2.用protobuf编译器编译.proto文件，从而生成c++/java语言等对应的文件

* 3.用C++/Java等对应的protobuf API来写或者读消息

​	.proto文件定义举例：

```protobuf
//addressbook.proto
package tutorial;
 
message Persion {
    required string name = 1;
    required int32 age = 2;
}
 
message AddressBook {
    repeated Persion persion = 1;
}
```



## 2.mac/linux下的安装与使用

### 2.1.安装

* 1.下载源码: [github.protobuf](https://github.com/protocolbuffers/protobuf/releases), 本文版本：v3.6.1

* 2.终端下安装： 

  ```shell
  #1.解压：
  $ tar -zvf protobuf-cpp-3.6.1.tar.gz
  
  #2.切换目录:
  $ cd protobuf
  
  #3.指定安装目录:
  $ ./configure --prefix=/usr/local/protobuf
  
  #4.编译:
  $ make
  
  #5.测试:
  $ make check
  
  #6.安装:
  $ sudo make install
  $ ln -s /usr/local/protobuf/bin/protoc /usr/local/bin/ #手动做个软连接
  $ ln -s /usr/local/protobuf/include/google /usr/local/include/#软连接目录(必须是绝对路径)
  
  #7.查看版本号:
  $ protoc --version
  ```

*  3.修改配置：

  * (1)配置protoc： 

    ​	上一步中我们做了“软连接”，若是没做的话，用户会找不到protoc命令。除了直接做“软连接”外，还可以使用其它方式，如：

    ```shell
    $ vim /etc/profile
    export PATH=$PATH:/usr/local/protobuf/bin/
    export PKG_CONFIG_PATH=/usr/local/protobuf/lib/pkgconfig/
    
    $ source /etc/profile
    ```

  * (2) 配置动态链接库：

    ```shell
    $ vim /etc/ld.so.conf
     在新行处添加:/usr/local/protobuf/lib
 
    $ ldconfig
    ```
  

### 2.2.示例（C++版）

​	该示例的大致功能：通过.proto文件协议定义的结构，实现向一个文件写入和读出该结构信息并打印出来的功能。

#### 2.2.1. 编译.proto文件

​	将前面的addressbook.proto文件，通过protoc编译生成相关的c++接口代码。命令格式为：

```shell
protoc -I=$SRC_DIR --cpp_out=$DST_DIR $SRC_DIR/*.proto
```

​	示例：切换到工程根目录下，执行 -->

```shell
$ protoc -I=./proto --cpp_out=./src/cpp ./proto/addressbook.proto
```

​	命令执行完成后，会产生.protobuf对应的两个c++文件：addressbook.pb.h和addressbook.pb.cc。如下：

```shell
.
├── demo
├── proto
└── src
    └── cpp
        ├── addressbook.pb.cc
        └── addressbook.pb.h
```

#### 2.2.2. demo调用

* 1.源码

  ```c++
  #include <iostream>
  #include <fstream>
  #include <string>
  #include "addressbook.pb.h"
  
  bool write_to_addressbook(const std::string &file_name)
  {
      tutorial::AddressBook address_book;
  
      tutorial::Persion *persion = address_book.add_persion();
      persion->set_name("alice");
      persion->set_age(18);
  
      {
          std::fstream output(file_name, std::ios::out | std::ios::trunc | std::ios::binary);
          if (!address_book.SerializeToOstream(&output)) {
              std::cerr << "failed to write address book!" << std::endl;
              return false;
          }
          output.close();
      }
  
      return true;
  }
  
  bool read_from_addressbook(const std::string &file_name)
  {
      tutorial::AddressBook address_book;
   
       {
           std::fstream input(file_name, std::ios::in | std::ios::binary);
           if (!address_book.ParseFromIstream(&input)) {
               std::cerr << "failed to parse address book!" << std::endl;
               return false;
           }
           input.close();
       }
   
       for (int i = 0; i < address_book.persion_size(); i++) {
           const tutorial::Persion& persion = address_book.persion(i);
   
           std::cout << "result: " << persion.name() << " " << persion.age() << std::endl;
       }
  
      return true;
  }
  
  
  int main(int argc, char **argv) {
      //GOOGLE_PROTOBUF_VERIFY_VERSION;
  
      std::string file_name("./addressbook");
  
      std::cout << "1.input address book(wirte a file) ...\n";
      if (!write_to_addressbook(file_name))
          return -1;
  
      std::cout << "2.output address book(read a file) ...\n";
      if (!read_from_addressbook(file_name))
          return -1;
  
      // Optional: Delete all global objects allocated by libprotobuf.
      //google::protobuf::ShutdownProtobufLibrary();
  
      return 0;
  }
  ```

* 2.编译: 切换到demo/cpp目录，执行:

  ```shell
  $ g++ -o sample ../../src/cpp/addressbook.pb.cc main.cpp -I../../src/cpp -L../../lib -lprotobuf -std=c++14 -stdlib=libc++
  ```
  ​	*如果配置了/etc/profile，也可以用下面的命令执行编译

  ```shell
  $ g++ -o sample ../../src/cpp/addressbook.pb.cc main.cpp -I../../src/cpp `pkg-config --cflags --libs protobuf` -std=c++14 -stdlib=libc++
  ```

* 3.结果

  ```shell
  $ ./sample
  1.input address book(wirte a file) ...
  2.output address book(read a file) ...
result: alice 18
  ```
  

### 2.3.示例（python版）



## 3.windows下的安装与使用