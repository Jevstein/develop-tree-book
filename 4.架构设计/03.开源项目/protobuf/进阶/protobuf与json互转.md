[TOC]

# protobuf与json的互转

​	在工程化中，经常会遇到诸如：1）用json格式写功能测试用例，转成内部protobuf进行序列化；2）多语言模块调用时，原本采用了json格式作为协议交互，需要将内部实现的protobuf自动转换成json；3）特殊情况下，将protobuf转成json格式保存，便于阅读等。。。

​	假如有protobuf如下：

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

​	分别生成不同语言的源码，步骤略。详见《[protobuf的跨平台安装和多语言调用](../基础/protobuf的安装和使用.md)》

## 1.python版

​	导入protobuf模块，如：

```shell
$ pip3 install protobuf
$ python
>>> import google.protobuf
```

### 1.1.第三方pbjson支持

#### 1.1.1.pbjson.py

 * 1.首先，引入simplejson模块

   ```shell
   $ pip3 install simplejson
   $ python
   >>> import simplejson
   ```

 * 2.其次，引入第三方源码pbjson.py文件。该文件来自[GitHub.NextTuesday.py-pb-converters](https://github.com/NextTuesday/py-pb-converters)，如下：

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

#### 1.1.2.示例

```python
#!/usr/bin/env python
# coding=utf-8
# file: main.py

# from addressbook_pb2 import AddressBook
import addressbook_pb2
# from google.protobuf.json_format import MessageToJson

#import sys
#sys.path.append("../..")
#from src.python import addressbook_pb2
import pbjson
import simplejson

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
    addrbook2 = "addressbook.json"

    print("\r\n========= 演示protobuf的json数据的文件读写 =========")
    print("1.将protobuf的json数据写入文件 ...")
    write_to_jsonfile(addrbook2)

    print("\r\n2.读出文件中保存protobuf的json数据 ...")
    read_from_jsonfile(addrbook2)

if __name__ == "__main__":
    main()
```



### 1.2.protobuf语法支持

#### 1.2.1.pb2json & pb2dict

```python
#!/usr/bin/env python
# coding=utf-8
# file: main.py
from google.protobuf.json_format import MessageToJson
from google.protobuf.json_format import MessageToDict

def pb2json_pb2dict():
    address_book = addressbook_pb2.AddressBook()
    person = address_book.persons.add()
    person.age = 120
    person.name = "Bob"

    json_obj = MessageToJson(address_book)
    print("  1).json_obj from protobuf ->\n", json_obj, type(json_obj))

    dict_obj = MessageToDict(address_book)
    print("  2).dict_obj from protobuf ->\n", dict_obj, type(dict_obj))

def main():
    print("\r\n========= 演示语言自带protobuf到json/dict的转换 =========")
    pb2json_pb2dict()
```



#### 1.2.2.json2obj

```python
#!/usr/bin/env python
# coding=utf-8
# file: main.py
import json
import time

class JsonClass(object):
    def to_json_string(self):
        return json.dumps(self, default=lambda obj: obj.__dict__)

    def from_json_string(self, json_string):
        data = json.loads(json_string)
        for key in self.__dict__.keys():
            setattr(self, key, data[key])

class Task(JsonClass):
    def __init__(self, id=None, name=None, timestamp=None):
        self.id = id
        self.name = name
        self.timestamp = timestamp

def json2obj():
    # 序列化
    task = Task(1, "a", time.time())
    print("  1).序列化: ", task.to_json_string())

    # 反序列化
    json_string = '{"timestamp": 1560948789.5293133, "name": "a", "id": 1}'
    task = Task()
    task.from_json_string(json_string)
    print("  2).反序列化：", task.id, task.name, task.timestamp, type(task))

def main():
    print("\r\n========= 演示json转object =========")
    json2obj()
```



### 1.3.proto文档转成json文档



## 2.c++版

