[TOC]

# protobuf的跨平台安装和多语言调用

## 1.前言

​	写个例子，演示在不同的操作系统、不同的编程语言使用protobuf的方法。例子的源目录结构如下：

```shell
.
├── demo  						 #<--- 各种语言对应的demo
│   ├── cpp
│   │   └── main.cpp
│   └── python
│       └── main.py
├── lib
│   └── libprotobuf.a  #<--- 从/usr/local/protobuf/lib拷贝而来的静态库
├── proto							 #<--- 手动定义出满足protobuf协议格式的数据结构
│   └── addressbook.proto
└── src								 #<--- 通过protoc编译生成的对应addressbook.proto的各种语言的源码文件
```

### 1.1.定义protobuf协议

　　.proto文件是protobuf一个重要的文件，它定义了需要序列化数据的结构。一般使用protobuf的3个步骤是：

* 1.在.proto文件中定义消息格式

* 2.用protobuf编译器编译.proto文件，从而生成c++/java语言等对应的文件

* 3.用C++/Java等对应的protobuf API来写或者读消息

​	.proto文件定义举例：

```protobuf
//addressbook.proto
syntax = "proto2";//指定版本：第一行非空白非注释行。若不指定，默认为proto2

package tutorial;
 
message Person {
    required string name = 1;  //注意：Required fields are not allowed in proto3
    optional int32 age = 2;    //注意：Explicit 'optional' labels are disallowed in the Proto3 syntax.
}
 
message AddressBook {
    repeated Person persons = 1;
}
```



## 2.mac/linux下的安装与使用

### 2.1.安装protobuf

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
  $ ln -s /usr/local/protobuf/bin/protoc /usr/local/bin/ #手动做个软链接
  $ ln -s /usr/local/protobuf/include/google /usr/local/include/#软链接目录(必须是绝对路径)
  
  #7.查看版本号:
  $ protoc --version
  
  #8.安装protobuf的python模块(若不用python，可跳过):
  $ cd ./python 
  $ python setup.py build 
  $ python setup.py test 
  $ python setup.py install
  
  #9.验证Python模块是否被正确安装(若不用python，可跳过):
  $ python
  >>> import google.protobuf
  ```

  ​	*此外，在mac下也可以直接使用brew进行安装，终端命令如下：

  ```shell
  $ brew install protobuf 
  $ brew install autoconf automake libtool  #安装protobuf所需要的依赖
  $ protoc --version
  ```

*  3.修改配置：

  * (1)配置protoc： 

    ​	上一步中我们做了“软链接”，若是没做的话，用户会找不到protoc命令。除了直接做“软链接”外，还可以使用其它方式，如：

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
 
    $ sudo ldconfig 								#linux下刷新生效
    #$ sudo update_dyld_shared_cache #mac下刷新生效
    ```
  



### 2.2.编译.proto文件

​	将前面的addressbook.proto文件，通过protoc编译生成相关编程语言的接口代码。一般的命令格式（详见帮助：$protoc -h）如下：

```shell
$protoc -I=$SRC_DIR --*_out=$DST_DIR $SRC_DIR/*.proto
```

​	示例：切换到工程根目录下，执行 --->

```shell
#1.编译为c++:
$ protoc -I=./proto --cpp_out=./src/cpp ./proto/addressbook.proto

#2.编译为python:
$ protoc -I=./proto --python_out=./src/python ./proto/addressbook.proto

#3.编译为java:
$ protoc -I=./proto --java_out=./src/java ./proto/addressbook.proto

#4.编译为c#:
$ protoc -I=./proto --csharp_out=./src/csharp ./proto/addressbook.proto
```

​	命令执行完成后，会产生.protobuf对应的语言文件（如c++的两个文件：addressbook.pb.h和addressbook.pb.cc）。具体如下：

```shell
.
├── demo
├── lib
├── proto
│   └── addressbook.proto
└── src
    ├── cpp
    │   ├── addressbook.pb.cc
    │   └── addressbook.pb.h
    ├── csharp
    │   └── Addressbook.cs
    ├── java
    │   └── tutorial
    │       └── Addressbook.java
    └── python
        └── addressbook_pb2.py
```



### 2.3.调用示例

#### 2.3.1.c++版

​	该示例的大致功能：通过.proto文件定义结构，实现向一个文件写入和读出该结构信息并打印出来的功能。

* 1.源码

  ```c++
  //demo/cpp/main.cpp
  #include <iostream>
  #include <fstream>
  #include <string>
  #include "addressbook.pb.h"
  
  bool write_to_addressbook(const std::string &file_name)
  {
      tutorial::AddressBook address_book;
  
      tutorial::Person *person = address_book.add_person();
      person->set_name("alice");
      person->set_age(18);
  
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
   
       for (int i = 0; i < address_book.person_size(); i++) {
           const tutorial::Person& person = address_book.person(i);
   
           std::cout << "result: " << person.name() << " " << person.age() << std::endl;
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

* 2.编译: 

  ​	切换到demo/cpp目录，执行:

  ```shell
  $ g++ -o sample ../../src/cpp/addressbook.pb.cc main.cpp -I../../src/cpp -L../../lib -lprotobuf -std=c++14 -stdlib=libc++
  ```
  ​	*如果配置了/etc/profile，也可以用下面的命令执行编译

  ```shell
  $ g++ -o sample ../../src/cpp/addressbook.pb.cc main.cpp -I../../src/cpp `pkg-config --cflags --libs protobuf` -std=c++14 -stdlib=libc++
  ```

* 3.运行

  ```shell
  $ ./sample
  1.input address book(wirte a file) ...
  2.output address book(read a file) ...
result: alice 18
  ```
  



#### 2.3.2.python版

##### 2.3.2.1.源码示例

​	该示例演示：通过.proto文件定义的结构，实现向一个文件写入和读出该结构的二进制信息，以及向另一个文件写入和读出json信息，并打印出来

​	【**注**】如果在上述安装过程中没有安装python的protobuf模块，则还可以用pip命令进行安装：

```shell
$ pip3 install protobuf
$ python
>>> import google.protobuf

#若要使用json，还得安装simplejson模块
$ pip3 install simplejson
$ python
>>> import simplejson
```

* 1.源码

  ```python
  #!/usr/bin/env python
  # coding=utf-8
  # file: demo/python/main.py
  
  # from addressbook_pb2 import AddressBook
  # import addressbook_pb2
  import sys
  sys.path.append("../..")
  from src.python import addressbook_pb2
  import pbjson
  import simplejson
  
  def write_to_bytesfile(filename):
      address_book = addressbook_pb2.AddressBook()
      person = address_book.persons.add()
      person.age = 120
      person.name = "Bob"
      print("  1).person ->\n", person, type(person))
  
      bytes_data = address_book.SerializeToString()
      print("  2).serialize to string -> ", bytes_data, type(bytes_data))
  
      print("  3).input to file ...")
      with open(filename, 'wb') as file_obj:
          file_obj.write(bytes_data)
  
  def read_from_bytesfile(filename):
      with open(filename, "rb") as file_obj:
          bytes_data = file_obj.read()
      print("  1).bytes_data from file ->\n", bytes_data, type(bytes_data))
  
      address_book = addressbook_pb2.AddressBook()
      address_book.ParseFromString(bytes_data)
      print("  2).parse address_book from bytes_data ->\n", address_book, type(address_book))
  
      print("  3).use address_book ->")
      for person in address_book.persons:
          print("name: {}, age: {}".format(person.name,person.age))
  
  def write_to_jsonfile(filename):
      address_book = addressbook_pb2.AddressBook()
      person = address_book.persons.add()
      person.age = 120
      person.name = "Safly"
      print("  1).person -> \n", person, type(person))
  
      #Convert Protobuf to json
      json_data = pbjson.pb2json(address_book)
      print("  2).convert protobuf to json -> \n", json_data)
  
      print("  3).input to file ...")
      with open(filename, 'w') as file_obj:
          file_obj.write(str(json_data))
  
  def read_from_jsonfile(filename):
      with open(filename, "r") as file_obj:
          # json_data = file_obj.read() #这句并不是json数据
          json_data = simplejson.load(file_obj)
  
      # 或者 
      # file_obj = open(filename)
      # json_data = simplejson.load(file_obj)
      # file_obj.close
  
      print("  1).json_data from file ->\n", json_data, type(json_data))
  
      address_book = pbjson.dict2pb(addressbook_pb2.AddressBook, json_data)
      print("  2).parse address_book from json_data ->\n", address_book, type(address_book))
  
      print("  3).use address_book ->")
      for person in address_book.persons:
          print("name: {}, age: {}".format(person.name,person.age))
  
  def main():
      addrbook1 = "addressbook"
      addrbook2 = "addressbook.json"
  
      print("========= 演示protobuf的bytes数据的文件读写 =========")
      print("1.将protobuf的bytes数据写入文件 ...")
      write_to_bytesfile(addrbook1)
  
      print("\r\n2.读出文件中保存protobuf的bytes数据 ...")
      read_from_bytesfile(addrbook1)
  
      print("\r\n========= 演示protobuf的json数据的文件读写 =========")
      print("1.将protobuf的json数据写入文件 ...")
      write_to_jsonfile(addrbook2)
  
      print("\r\n2.读出文件中保存protobuf的json数据 ...")
      read_from_jsonfile(addrbook2)
  
  if __name__ == "__main__":
      main()
  ```
  

  
* 2.运行

  ```shell
  ========= 演示protobuf的json数据的文件读写 =========
  1.将protobuf的json数据写入文件 ...
    1).person -> 
   name: "Safly"
  age: 120
   <class 'addressbook_pb2.Person'>
    2).convert protobuf to json -> 
   {
      "persons": [
          {
              "age": 120,
              "name": "Safly"
          }
      ]
  }
    3).input to file ...
  
  2.读出文件中保存protobuf的json数据 ...
    1).json_data from file ->
   {'persons': [{'age': 120, 'name': 'Safly'}]} <class 'dict'>
    2).parse address_book from json_data ->
   persons {
    name: "Safly"
    age: 120
  }
   <class 'addressbook_pb2.AddressBook'>
    3).use address_book ->
  name: Safly, age: 120
  ```

  ##### 2.3.2.2.跨文件夹import *py文件的方法

```shell
.
├── demo
│   └── python
│       ├── main.py
│       └── pbjson.py
├── lib
├── proto
│   └── addressbook.proto
└── src
    └── python
        └── addressbook_pb2.py
```

​	如上文件目录，main.py要导入 addressbook_pb2.py的AddressBook结构，就可以在main.py开头，写上如下：

```python
import sys
sys.path.append("../..")
from src.python import addressbook_pb2
```

* 【**注**】若导入失败，可在addressbook_pb2.py对应的目录，即src/python/文件夹下新建一个空文件`__init__.py`。于是新的目录结构如下：

  ```shell
  .
  ├── demo
  │   └── python
  │       ├── main.py
  │       └── pbjson.py
  ├── lib
  ├── proto
  │   └── addressbook.proto
  └── src
      └── python
          ├── __init__.py #空文件
          └── addressbook_pb2.py
  ```

  

> 参考：
> [Python使用import导入相对路径的其他py文件](https://www.cnblogs.com/zhuxiaoxi/p/10003609.html)
> [Python中import的跨文件夹使用](https://blog.csdn.net/qq_28072715/article/details/80939699)



  ##### 2.3.2.3.protobuf与json互转

​	要实现protobuf与json的互转，除了需要python引入simplejson模块外，还需要引入pbjson.py文件。该文件来自[GitHub.NextTuesday.py-pb-converters](https://github.com/NextTuesday/py-pb-converters)，如下：

```python
import simplejson
from google.protobuf.descriptor import FieldDescriptor as FD

class ConvertException(Exception):
    pass

def dict2pb(cls, adict, strict=False):
    """
    Takes a class representing the ProtoBuf Message and fills it with data from
    the dict.
    """
    obj = cls()
    for field in obj.DESCRIPTOR.fields:
        if not field.label == field.LABEL_REQUIRED:
            continue
        if not field.has_default_value:
            continue
        if not field.name in adict:
            raise ConvertException('Field "%s" missing from descriptor dictionary.'
                                   % field.name)
    field_names = set([field.name for field in obj.DESCRIPTOR.fields])
    if strict:
        for key in adict.keys():
            if key not in field_names:
                raise ConvertException(
                    'Key "%s" can not be mapped to field in %s class.'
                    % (key, type(obj)))
    for field in obj.DESCRIPTOR.fields:
        if not field.name in adict:
            continue
        msg_type = field.message_type
        if field.label == FD.LABEL_REPEATED:
            if field.type == FD.TYPE_MESSAGE:
                for sub_dict in adict[field.name]:
                    item = getattr(obj, field.name).add()
                    item.CopyFrom(dict2pb(msg_type._concrete_class, sub_dict))
            else:
                map(getattr(obj, field.name).append, adict[field.name])
        else:
            if field.type == FD.TYPE_MESSAGE:
                value = dict2pb(msg_type._concrete_class, adict[field.name])
                getattr(obj, field.name).CopyFrom(value)
            else:
                setattr(obj, field.name, adict[field.name])
    return obj


def pb2dict(obj):
    """
    Takes a ProtoBuf Message obj and convertes it to a dict.
    """
    adict = {}
    if not obj.IsInitialized():
        return None
    for field in obj.DESCRIPTOR.fields:
        if not getattr(obj, field.name):
            continue
        if not field.label == FD.LABEL_REPEATED:
            if not field.type == FD.TYPE_MESSAGE:
                adict[field.name] = getattr(obj, field.name)
            else:
                value = pb2dict(getattr(obj, field.name))
                if value:
                    adict[field.name] = value
        else:
            if field.type == FD.TYPE_MESSAGE:
                adict[field.name] = \
                    [pb2dict(v) for v in getattr(obj, field.name)]
            else:
                adict[field.name] = [v for v in getattr(obj, field.name)]
    return adict


def json2pb(cls, json, strict=False):
    """
    Takes a class representing the Protobuf Message and fills it with data from
    the json string.
    """
    return dict2pb(cls, simplejson.loads(json), strict)


def pb2json(obj):
    """
    Takes a ProtoBuf Message obj and convertes it to a json string.
    """
    return simplejson.dumps(pb2dict(obj), sort_keys=True, indent=4)
```

​	当然，你也可以不用pbjson.py文件，自己造轮子。

  


## 3.windows下的安装与使用