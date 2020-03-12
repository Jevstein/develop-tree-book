#!/usr/bin/env python
# coding=utf-8
# file: main.py

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