[TOC]

# python的入门语法

## 1.总览	

​	三个源码文件，描述python的基本用法，如下：

 ```shell
grammar.py  #基本语法：入口函数
car.py			#基类
audi.py			#子类
 ```

​	涵盖的基本知识归纳如下：

```shell
#1.程序入口:		`if __name__ == '__main__'`
#2.注释:				单行注释(#) + 多行注释(""" 注释 """)
#3.变量:				bool/str/int/float, 列表(数组)/元组/字典
#4.函数: 				def func(param):  return 0 -> "函数名 + 形参 + 函数体 + 返回值" 
#5.if条件: 			"if(): elif(): else:"; 三目运算(var = a if(a > b) else b)
#6.for循环: 		for i in vars:
#7.while循环:		while (True), break, continue
#8.列表(数组):   vars = ["a", "bc"] 	-> 增、删、改、查
#9.元组(只读):	 vars = (1, 23, 456) 	-> 查
#10.字典: 			vars = {"key1":"value1", "key2":"value2"} -> 增、删、改、查
#11.input:			var = input("please input the number:")
#12.系统函数		 print/min/sort/del/range/str
#13.class类: 	 def class Tiger(Animal): 								-> 属性、方法，继承
#										def __init__(self, name):
#												self.name = name
#14.文件读写：		with open([filename], ['w'、'a'、'r']) as file_obj
#15.多个python文件的相互调用： from audi import Audi
#16.异常处理:		 try: except [FileNotFoundError/ZeroDivisionError]: [pass] else:
#17.存储数据:		 import json, json.dump(), json.load()
```

​	这便是入门python的“降龙十八掌”！咦～，怎么少一掌？。。。。。。哦，原来第十八掌是将前面的一十七掌连起来，融会贯通！请看详解：



## 2.详解

### 2.1. grammar.py

​	此处从`if __name__ == '__main__'`作为入口，请看代码：

#### 1) 头部: 注释、import

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
#grammar.py
"""
note: the basic usage for json
      @allright by Jevstein 2020.02.22
"""

import os
import json

# from car import Car
from audi import Audi

# print("hello world")

def log_title1(title):
    print("\n--------- " + title + " ---------")
```

#### 2) 变量

```python
#描述变量的用法
def var_usage(a, b):
    print("我来自形参1：" + a + ", 我来自形参2：" + b)

    msg = "aaa" #str：字符串
    print("我是一个字符串变量：" + msg)

    v1 = 1      #int: 整型
    v2 = 2.1    #float: 浮点型    

    s1 = v1 + v2 #数学加法
    s2 = v1 - v2 #数学减法
    s3 = v1 * v2 #数学乘法
    s4 = v1 / v2 #数学除法
    print("加减乘除: " + str(s1) + ", " + str(s2) + ", " + str(s3) + ", " + str(s4))

    return 1
```

#### 3) 列表（数组）

```python
#列表/数组: 增、删、改、查
def arr_usage():
    bicycles = ['trek', 'cannondale', 'redline', 'specialized']
    print("遍历：" + bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3])

    #增
    bicycles.append('specialized01')
    print("增：" + bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3] + ", " + bicycles[4])

    #改
    bicycles[2] = "redline001"
    print("改：" + bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3] + ", " + bicycles[4])

    #删
    del bicycles[0]
    print("删：" + bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3])

    #查
    var = bicycles[2]
    print("查[2]:" + var)

    cars = ['bmw', 'audi', 'toyota', 'subaru'] 
    print("车：" + str(cars))
    cars.sort()
    print("排序：" + str(cars))
    cars.reverse()
    print("反转:" + str(cars))
```

#### 4) for循环

```python
#for循环: 遍历、创建
def for_usage():
    magicians = ['alice', 'david', 'carolina']
    v1 = 0
    for i in magicians:
        print ("magicians[" + str(v1) + "]: " + i) # i == magicians[v1]
        v1 += 1
    print (v1)

    print ("遍历元组：")
    #range: [1, 5)
    for value in range(1,5):
        print(value)

    print('创建列表：')
    ret = range(2,11,2)#[2,11)步长为2的元组
    even_numbers = list(ret)
    print(even_numbers)
```

#### 5) 元组（只读）

```python
# 元组：只读
def tuple_usage():
    dimensions = (200, 50, 10)
    print("输出元组：")
    print(dimensions)
    
    print("find[0]: " + str(dimensions[0]))

    for i in dimensions:
        print ("遍历元组: " + str(i))

    #无此操作
    # dimensions.append(300)
    # print(dimensions)
```

#### 6).if条件

```python
#if的用法
def if_usage():
    # bool var = 1 #布尔类型：True/False
    # if (a == b)
    # if (i in xxxs)
    # if (i not in xxxs)
    # if (a != b)
    # if (a > b)
    # if (a > b and a < c)

    v1 = "xx"
    v = (v1 == "xx")
    print(v)#True/False

    tuples = (100, 101, 102, 99)
    print(tuples)
    for i in tuples:
        if ((i != 6) and (i > 101)):
            print("(i != 6) and (i > 101)：" + str(i))
        elif ((i != 6) or (i < 100)):
            print("(i != 6) or (i < 100)：" + str(i))
        else:
            print("this is " + str(i))

    print("i在for外面也是生效的:" + str(i))

    #三目运算：
    print("三目运算：简单讲就是将if/else写成一行，还可将结果赋值给指定变量")
    a = 1
    b = 2
    var = a if(a > b) else b
    print(var)

    if (a > b):
        print("x")
    else:
        print("y")
```

#### 7) 函数

```python
def describe_pet(animal_type, pet_name="dog"):
    """显示宠物的信息"""
    print("\nI have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")

#函数的用法
def func_usage():
    describe_pet(animal_type='hamster', pet_name='harry')
    describe_pet(pet_name='harry', animal_type='hamster')
    describe_pet('harry', 'hamster')
    describe_pet("willie")
    describe_pet(animal_type='willie')
```

#### 8) 字典

```python
#字典的用法: 增、删、改、查
def dict_usage():
    #字典变量
    vars_0 = {}
    vars = {"name":"alice", "age":23, "phone":"123456789"}
    print(vars)

    name = vars["name"]
    age = vars["age"]
    print("查：name=" + name + ", age=" + str(age))

    key = "addr"
    value = "tianhe"
    vars[key] = value
    print("增：" + str(vars))

    vars["age"] = 25
    print("改：" + str(vars))

    del vars["addr"]
    print("删：" + str(vars))

    for k, v in vars.items():
        print("依次遍历：key: " + k + ", value: " + str(v))

    for i in vars:
        print("缺省：" +  str(i))

    for i in vars.values():
        print("value： " +  str(i))
        
    for i in vars.keys():
        print("key: " +  str(i))
    
    alien_0 = {'color': 'green', 'points': 5}
    alien_1 = {'color': 'yellow', 'points': 10}
    alien_2 = {'color': 'red', 'points': 15}
    aliens = [alien_0, alien_1, alien_2]
    for i in aliens:
        print("字典中的字典：" + str(i))

    pizza = {'crust': 'thick', 'toppings': ['mushrooms', 'extra cheese'], "alien": alien_0}
    print(pizza)
    print("You ordered a " + pizza['crust'] + "-crust pizza " + "with the following toppings:")
    for i in pizza['toppings']: 
        print("\t" + i)

    for k, v in pizza['alien'].items(): 
        print("依次遍历字典中的字典：key: " + k + ", value: " + str(v))
```

#### 9) input

```python
#input的用法
def input_usage():
    #age: 通过input传进来的值，无论是什么，一律作为字符串类型，比如输入21，它其实就是"21"
    age = input("how old are you: ")
    print(age)
    # if (int(age) > 18):
    #     print("age[" + age + "]是大于18岁的！")
    # else:
    #     print("age[" + age + "]是小于或等于18岁的！")
```

#### 10) while循环

```python
#while循环的用法
def while_usage():
    t = 10
    i = 0
    while True:
        i += 1
        print("1.爱你第" + str(i * 1000) + "年")
        if (i >= t): #当i大于等于10000时，退出循环
            print("爱你一万年到期了")
            break

    i = 0
    while (i <= t):
        i = i + 1
        print("2.我爱你第" + str(i) + "次")

        var = input("还爱吗？爱的话输入Y或y, 否则退出循环：")
        if (var == "Y"):
            print("还爱")
        elif (var == "y"):
            print("继续爱")
            continue
            print("此句被跳过，不会执行")
        else:
            print("不爱了")
            break
```

#### 11) class类

```python
#用于组合
class SuperPower():
    def __init__(self):
        self.ability = "fly, teleport, telekinesis ..." 
        print("[" + getattr(self.__class__,'__name__') + ".__init__]: I am super power!")

    def fly(self):
        print("[" + self.__class__.__name__ + ".fly]: I have the ability to fly!")

    def teleport(self):
        print("[" + self.__class__.__name__ + ".teleport]: 我会瞬间移动")

    def telekinesis(self):
        print("[" + self.__class__.__name__ + ".telekinesis]: 我能隔空取物!")

    def abilities(self):
        # help(self)
        print("[" + self.__class__.__name__ + ".abilities]: I have abilities: " + str(vars(self)))

#基类
class Person():
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.head = "head"
        self.body = "body"
        self.ability = SuperPower()
        print("[Person.__init__]: I am a person!")
        self.members()
        
    def speak(self):
        print("[Person.speak]: I can speak!")

    def move(self):
        print("[Person.move]: I can move!")

    def set_name(self, name):
        self.name = name

    def members(self):
        print("[Person.members]: I have members: " + str(vars(self)))
        # for name, value in vars(self).items():
        #     print('%s=%s'%(name,value))

#子类1
class BoyFriend(Person):
    def __init__(self, name, age, high, rich, handsome):
        super().__init__(name, age)
        self.high = high
        self.rich = rich
        self.handsome = handsome
        print("[BoyFriend.__init__]: I am the boy friend!")
        super().members()

    def love(self):
        print("[BoyFriend.love]: I love you!")

    def cook(self):
        print("[BoyFriend.cook]: I am cooking!")

    def sing(self):
        print("[BoyFriend.sing]: I am singing!")

#子类2
class GirlFriend(Person):
    def __init__(self, name, age, white, rich, beauty):
        print("[BoyFriend.__init__]: I am the girl friend!")
        super().__init__(name, age)
        self.white = white
        self.rich = rich
        self.beauty = beauty
        super().members()

    def love(self):
        print("[GirlFriend.love]: I love you!")

    def wash(self):
        print("[GirlFriend.wash]: I can wash!")

    def dance(self):
        print("[GirlFriend.dance]: I am dancing!")


#类的用法
def class_usage():
    #实例化： 对象/实例 = 类 --> 具体 = 抽象

    print("--- 1.类的实例化: 造一个人，且用之，且改名字")
    person = Person("Lily", 120)
    person.speak()
    person.move()
    print("My name will be changed to Lucy:")
    person.name = "Lucy"        #不建议直接修改类的属性
    person.set_name("Lucy")     #建议通过类的函数对类的属性进行修改
    person.members()

    print("\r\n--- 2.类的组合: 使用人的超能力")
    person.ability.abilities()
    person.ability.fly()
    person.ability.teleport()
    person.ability.telekinesis()

    print("\r\n--- 3.类的继承: 造一个男朋友(高富帅)或女朋友(白富美)，且用之")
    boyfriend = BoyFriend("Bob", 20, 180, 150000000000, "handsome")
    boyfriend.love()
    boyfriend.cook()
    boyfriend.sing()

    print("\r\n")
    girlfriend = GirlFriend("Alice", 18, "white", 150000000000, "beautiful")
    girlfriend.love()
    girlfriend.wash()
    girlfriend.dance()
```

#### 12) 不同文件的调用

```shell
#见头部：
# from car import Car
from audi import Audi

#不同python文件的调用
def diff_files_usage():
    audi = Audi()
    audi.run()
```

#### 13) 文件读写

```python
def file_write(file_name):
    print("向文件" + file_name + "中覆盖写入三句： I love python!")
    with open(file_name, "w") as file_obj:
        file_obj.write("I love python!\n")
        file_obj.write("I love python!\n")
        file_obj.write("I love python!\n")

    print("向文件" + file_name + "中追加一句： I love python very much!")
    with open(file_name, 'a') as file_obj:
        file_obj.write("I love python very much!\n")

def file_read(file_name):
    print("从文件" + file_name + "中读出内容：")
    with open(file_name, "r") as file_obj:
        content = file_obj.read()   #注：此句读完后将指向文件尾，再读则为空
        file_obj.seek(0)            #移动到文件头
        lines = file_obj.readlines()

    print("1.读出所有内容：\n" + str(content))
    print("2.读出所有行：" + str(lines))
    print("3.遍历所有行且去掉换行：")
    for i in lines:
        print(i.rstrip())

#文件的读写
def fileop_usage():
    file_name = "file1.txt"
    print("--- 1).写文件: ")
    file_write(file_name)

    print("\r\n--- 2).读文件: ")
    file_read(file_name)

    print("\r\n--- 3).删除文件(import os): ")
    var = input("whether to delete file automatically？Not if you enter 'n': ")
    if (var != 'n'):
        if os.path.exists(file_name):
            os.remove(file_name)
            print("文件" + file_name + "已删除")
```

#### 14) 异常处理

```python
#异常的处理
def exception_usage():
    file_name = 'a.txt'
    with open(file_name, 'w') as file_obj:
        file_obj.write("I love python")

    print("--- 1).文件异常：")
    while True:
        name = input("Please input a file name(" + file_name + "): Enter 'q' or '' to quit\r\n")
        if (name == 'q' or name == ''):
            break

        try:
            with open(name) as file_obj:
                content = file_obj.read()
        except FileNotFoundError:
            # print("FileNotFoundError: the file is not existed!")
            pass #一声不吭
        else:
            print("file content: " + content)
            break
    os.remove(file_name)

    print("\r\n--- 2).除以0异常：")
    while True:
        num1 = input("Please input the fist number: Enter 'q' or '' to quit\r\n")
        if (num1 == 'q' or num1 == ''):
            break

        num2 = input("Please input the second number(exception if 0): Enter 'q' or '' to quit\r\n")
        if (num2 == 'q' or num2 == ''):
            break
        
        try:
            var = int(num1) / int(num2)
        except ZeroDivisionError:
            print("ZeroDivisionError: division by zero!")
        else:
            print(str(num1) + " / " + str(num2) + " = " + str(var))
            break
```

#### 15) json格式

```python
#json的处理
def json_usage():
    file_name = 'numbers.json'

    print("--- 1).写入json数据到文件: ")
    nums1 = [2, 3, 5, 7, 11, 13]
    print("numbers to json file:" + str(nums1))
    with open(file_name, 'w') as f_obj: 
        json.dump(nums1, f_obj)

    print("\r\n--- 2).读出json数据: ")
    with open(file_name) as f_obj: 
        nums2 = json.load(f_obj)
    print("numbers from json file:" + str(nums2))

    print("\r\n--- 3).删除文件(import os): ")
    var = input("whether to delete file automatically？Not if you enter 'n': ")
    if (var != 'n'):
        if os.path.exists(file_name):
            os.remove(file_name)
            print("文件" + file_name + "已删除")

```

#### 16) from_book

```python
def from_book():
    name = "ada\tlovelace"
    print(name.title())
    print(name)

    squares = [value**2 for value in range(1,11)] 
    print(squares)

    players=['charles','martina','michael','florence','eli']
    print (players)
    print (players[0:3])
    print("Here are the first three player sonmy team:")
    for player in players[0:3]:
        print (player.title())

    # squares1 = squares
    # print(squares1)
    players1 = players[:]#赋值，复制/拷贝
    players1 = players   
    print(players1)

    # unconfirmed_users = ['alice', 'brian', 'candace']
    # confirmed_users = []
    # print("-------------------前：")
    # print(unconfirmed_users)
    # print(confirmed_users)
    # while unconfirmed_users:
    #     current_user = unconfirmed_users.pop()
    #     print("Verifying user: " + current_user.title())
    #     confirmed_users.append(current_user) 
    # print("\nThe following users have been confirmed:") 
    # for i in confirmed_users: 
    #     print(i.title())

    # print("-------------------后：")
    # print(unconfirmed_users)
    # print(confirmed_users)

    pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat'] 
    print(pets) 
    while 'cat' in pets: 
        pets.remove('cat') 
        print("while:" + str(pets))

    print(pets) 
```

#### 17) main

```python
def main():
    print("========= hello world =========")

    #1.变量的用法
    log_title1('1.变量的用法')
    ret = var_usage("aaa", "111") 
    print("var_usage函数的返回值：" + str(ret)) 

    #2.数组或列表的用法
    log_title1('2.数组或列表的用法')
    ret = arr_usage() 

    #3.for循环的用法
    log_title1('3.for循环的用法')
    for_usage()

    #4.元组的用法
    log_title1('4.元组的用法')
    tuple_usage()

    #5.if的用法
    log_title1('5.if的用法')
    if_usage()

    #6.函数的用法
    log_title1('6.函数的用法')
    func_usage()

    #7.字典的用法
    log_title1('7.字典的用法')
    dict_usage()

    #8.input的用法
    log_title1('8.input的用法')
    input_usage()

    #9.while循环的用法
    log_title1('9.while循环的用法')
    while_usage()

    #10.类的用法
    log_title1('10.class的用法')
    class_usage()

    #11.不同python文件的调用
    log_title1('11.不同python文件的调用')
    diff_files_usage()

    #12.文件的读写
    log_title1('12.文件的读写')
    fileop_usage()

    #13.异常的处理
    log_title1('13.异常的处理')
    exception_usage()

    #14.json的处理
    log_title1('14.json的读写(import json)')
    json_usage()

    #15.来自book的示例验证
    log_title1('15.来自book的示例验证')
    from_book()

    print("\r\n========= enjoy it =========")

if __name__ == "__main__":
    main()
```

### 2.2. car.py

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
#car.py

class Car():
    def __init__(self):
        print("I am a car")

    def run(self):
        print("[Car.run]: I can run")
```

### 2.3. audi.py

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
#audi.py

from car import Car

class Audi(Car):
    def __init__(self):
        super().__init__()
        print("[Audi.__init__]: I am audi")
```



## 3.运行

​	命令行执行：

```shell
$ python grammar.py
```

