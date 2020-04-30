[TOC]

# rapidjson库json格式的封装及解析

> [rapidjson库进行json格式的封装及解析](https://www.cnblogs.com/blowing-in-the-wind/articles/6825683.html)
>
> [rapidjson总结----string和rapijson的互相转换](https://blog.csdn.net/lk142500/article/details/80350929)

## 1.简介

* 【效率对比】：

  |      |      |      |
  | ---- | ---- | ---- |
  |      |      |      |
  |      |      |      |
  |      |      |      |

* 

## 2.安装

## 3.使用

### 3.1.组装

### 3.2.解析

## 4.原理



1.字符串json封装及解析的实例

```c++
#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"  
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include <iostream>
using namespace rapidjson;
using namespace std;
int main() 
{

//一，转json格式
    //1,获取Document对象
    Document doc;  
    doc.SetObject();    //key-value 相当与map
    //doc.Setvalue();        //数组型 相当与vector
    Document::AllocatorType &allocator=doc.GetAllocator(); //获取分配器

    //2，给doc对象赋值
    doc.AddMember("name","张山",allocator);
    
    //添加数组型数据
    Value array1(kArrayType);
    for(int i=0;i<3;i++)  
    {  
        Value int_object(kObjectType);  
        int_object.SetInt(i);  
        array1.PushBack(int_object,allocator);  
    }
    
    doc.AddMember("number",array1,allocator);

    //3，将doc对象的值写入字符串
    StringBuffer buffer;  
    //PrettyWriter<StringBuffer> writer(buffer);  //PrettyWriter是格式化的json，如果是Writer则是换行空格压缩后的json  
    Writer<StringBuffer> writer(buffer);
    doc.Accept(writer); 

    cout<<buffer.GetString()<<endl;

//二，解析json格式
    //1，将json格式字符串转换
    string readdate;
    readdate = buffer.GetString();
    Document document;  
    document.Parse<0>(readdate.c_str());  
    
    //2,取出自己想要的值
    Value &node1=document["name"];  
    cout<<"name:"<<node1.GetString()<<endl; 

    Value &node2=document["number"];  
    cout<<"number: "<<endl;  
    if(node2.IsArray())  
    {  
        for(int i=0;i<node2.Size();i++)  
            cout<<'\t'<<node2[i].GetInt()<<endl;  
    }  

    return 0;
}
```

二，文件json封装及解析的实例

 

**1 两个问题**

（1）标准json和非标准json：

标准json要求键必须都是双引号的字符串，而非标准json可以单引号。

例如：

{a : 'abc'}

{'a' : 'abc'}

{a : "abc"}

{"a" : "abc"}

只有第4个是标准json

（2）json中的[]与{}:

在 JSON 里 [] 是 Array {} 是Ojbect 

[] Array 的key 是 int 从0算起
{} 的key 是 string 

var a= Array(); 
a[a.length] = '3'; 
a[a.length] = '4'; 
a[a.length] = '5'; 

a toJSON 后 ='["3", "4", "5"]' 

var a = new Object(); 

a['test1'] = '3'; 
a['test2'] = '4'; 
a['test3'] = '5'; 

a toJSON 后 = '{"test1":"3", "test2":"4", "test3":"5"}' 

**2 rapidjson读写[测试](http://lib.csdn.net/base/softwaretest)**

下载rapidjson库，解压后关联到工程。

代码：

```c++
#include <iostream>  
#include <string>  
#include <fstream>  
//包含rapidjson必要头文件,rapidjson文件夹拷贝到工程目录，或者设置include路径，或者加入到工程树  
#include "rapidjson/document.h"  
#include "rapidjson/filestream.h"  
#include "rapidjson/prettywriter.h"  
#include "rapidjson/stringbuffer.h"  
using namespace std;  
using namespace rapidjson;  //引入rapidjson命名空间  
  
//写json文件  
void json_write()  
{  
    Document doc;  
    doc.SetObject();  
    Document::AllocatorType &allocator=doc.GetAllocator(); //获取分配器  
    //1.添加字符串对象  
    doc.AddMember("author","tashaxing",allocator);   
    //2.添加数组对象  
    Value array1(kArrayType);  
    for(int i=0;i<3;i++)  
    {  
        Value int_object(kObjectType);  
        int_object.SetInt(i);  
        array1.PushBack(int_object,allocator);  
    }  
    doc.AddMember("number",array1,allocator);  
    //3.添加复合对象  
    Value object(kObjectType);  
    object.AddMember("language1","C++",allocator);  
    object.AddMember("language2","java",allocator);  
    doc.AddMember("language",object,allocator);  
    //4.添加对象数组和复合对象的组合  
    Value array2(kArrayType);  
    Value object1(kObjectType);  
    object1.AddMember("hobby","drawing",allocator);  
    array2.PushBack(object1,allocator);  
    Value object2(kObjectType);  
    object2.AddMember("height",1.71,allocator);  
    array2.PushBack(object2,allocator);  
    doc.AddMember("information",array2,allocator);  
    StringBuffer buffer;  
    PrettyWriter<StringBuffer> pretty_writer(buffer);  //PrettyWriter是格式化的json，如果是Writer则是换行空格压缩后的json  
    doc.Accept(pretty_writer);  
    //打印到屏幕  
    cout<<"the json output:"<<endl;  
    cout<<buffer.GetString()<<endl;  
    //输出到文件  
    ofstream fout;  
    fout.open("test");    //可以使绝对和相对路径，用\\隔开目录，test, test.json, test.txt 都行，不局限于文件格式后缀，只要是文本文档  
    fout<<buffer.GetString();  
    fout.close();  
}  
  
//读json文件  
void json_read()  
{  
    cout<<"the json read:"<<endl;  
    ifstream fin;  
    fin.open("test");  
    string str;  
    string str_in="";  
    while(getline(fin,str))    //一行一行地读到字符串str_in中  
    {  
        str_in=str_in+str+'\n';  
    }  
    //解析并打印出来  
    Document document;  
    document.Parse<0>(str_in.c_str());  
  
    Value &node1=document["author"];  
    cout<<"author: "<<node1.GetString()<<endl;  
  
    Value &node2=document["number"];  
    cout<<"number: "<<endl;  
    if(node2.IsArray())  
    {  
        for(int i=0;i<node2.Size();i++)  
            cout<<'\t'<<node2[i].GetInt()<<endl;  
    }  
  
    Value &node3=document["language"];  
    cout<<"language: "<<endl;  
    Value &tmp=node3["language1"];  
    cout<<'\t'<<"language1: "<<tmp.GetString()<<endl;  
    tmp=node3["language2"];  
    cout<<'\t'<<"language2: "<<tmp.GetString()<<endl;  
  
    Value &node4=document["information"];  
    cout<<"information: "<<endl;  
    if(node4.IsArray())  
    {  
        int i=0;  
        Value &data=node4[i];   //注意，此处下表索引只能用变量，不能用常量，例如node[0]编译错误  
        cout<<'\t'<<"hobby: "<<data["hobby"].GetString()<<endl;  
        i=1;  
        data=node4[i];  
        cout<<'\t'<<"height: "<<data["height"].GetDouble()<<endl;  
    }  
  
}  
int main(int argc,char **argv)  
{  
    //写、读 测试  
    json_write();  
    json_read();  
    return 0;  
}
```

