#!/usr/bin/env python
# coding=utf-8
# file: main.py

# from addressbook_pb2 import AddressBook
# import addressbook_pb2
from google.protobuf.json_format import MessageToJson
from google.protobuf.json_format import MessageToDict

import sys
sys.path.append("../..")
from src.python import addressbook_pb2
import pbjson
import simplejson
import json
import time

def write_to_bytesfile(filename):
    address_book = addressbook_pb2.AddressBook()
    person = address_book.persons.add()
    person.age = 120
    person.name = "Bob"
    print("  1).person ->\n", person, type(person))

    bytes_data = address_book.SerializeToString()
    print("  2).serialize to string -> ", bytes_data, type(bytes_data))

    print("  3).write to file ...")
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

    print("  3).write to file ...")
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

def pb2json_pb2dict():
    address_book = addressbook_pb2.AddressBook()
    person = address_book.persons.add()
    person.age = 120
    person.name = "Bob"

    json_obj = MessageToJson(address_book)
    print("  1).json_obj from protobuf ->\n", json_obj, type(json_obj))

    dict_obj = MessageToDict(address_book)
    print("  2).dict_obj from protobuf ->\n", dict_obj, type(dict_obj))

# json2obj
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

def input_pbjson():
    address_book = addressbook_pb2.AddressBook()
    # person = address_book.persons.add()
    # person.age = 120
    # person.name = "Bob"

    json_obj = MessageToJson(address_book)
    print("json_obj ->\n", json_obj)

    # 通过type创建类。 type()返回的是创建的类对象的引用。
    Test2 = type("MyClass2",(object,),{"name":"张三","age":23}) # Test2是MyClass2类的引用，一般变量名和类名保持一致。
    print(Test2()) # <__main__.MyClass2 object at 0x7fa05a4ca9e8>

    test = Test2()
    print(test.name, test.age)

# # 通过class关键字创建类
# class MyClass1(object):
#     name = "张三" # 类属性 (所有实例对象共用)
#     age = 23
# https://www.jb51.net/article/172134.htm
  


def main():
    # addrbook1 = "addressbook"
    # addrbook2 = "addressbook.json"

    # print("========= 演示protobuf的bytes数据的文件读写 =========")
    # print("1.将protobuf的bytes数据写入文件 ...")
    # write_to_bytesfile(addrbook1)

    # print("\r\n2.读出文件中保存protobuf的bytes数据 ...")
    # read_from_bytesfile(addrbook1)

    # print("\r\n========= 演示protobuf的json数据的文件读写 =========")
    # print("1.将protobuf的json数据写入文件 ...")
    # write_to_jsonfile(addrbook2)

    # print("\r\n2.读出文件中保存protobuf的json数据 ...")
    # read_from_jsonfile(addrbook2)

    # print("\r\n========= 演示语言自带protobuf到json/dict的互转 =========")
    # pb2json_pb2dict()

    # print("\r\n========= 演示json转object =========")
    # json2obj()

    print("\r\n========= input pbjson =========")
    input_pbjson()

if __name__ == "__main__":
    main()