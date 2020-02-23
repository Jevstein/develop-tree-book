[TOC]

# python的基本语法

## 1.总览	

​	三个源码文件，描述python的基本用法，如下：

 ```shell
grammar.py  #基本语法：入口函数
car.py			#基类
audi.py			#子类
 ```



## 2.详解

### 2.1. grammar.py

​	此处从`if __name__ == '__main__'`作为入口，请看代码：

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
#sgrammr.py
"""
note: the usage for json
      @right by Jevstein 2020.02.22
"""

# from car import Car
from audi import Audi

# print("=================================hello world")

# #方法、函数:  函数名+形参+函数体+返回值
# def func0():
#     return 0

def log_title1(title):
    print("\n--------- " + title + " ---------")

#描述变量的用法
def var_usage(a, b):
    print("我来自形参1：" + a + ", 我来自形参2：" + b)

    msg = "aaa" #str：字符串
    print("I am msg：" + msg)

    v1 = 1      #int: 整型
    v2 = 2.1    #float: 浮点型    

    s1 = v1 + v2 #数学加法
    s2 = v1 - v2 #数学减法
    s3 = v1 * v2 #数学乘法
    s4 = v1 / v2 #数学除法
    print("+-*\: " + str(s1) + ", " + str(s2) + ", " + str(s3) + ", " + str(s4))

    return 1

#列表/数组: 增、删、改、查
def arr_usage():
    bicycles = ['trek', 'cannondale', 'redline', 'specialized']
    print(bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3])

    bicycles.append('specialized01')
    print(bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3] + ", " + bicycles[4])

    bicycles[2] = "redline001"
    print(bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3] + ", " + bicycles[4])

    del bicycles[0]
    print(bicycles[0] + ", " + bicycles[1] + ", " + bicycles[2] + ", " + bicycles[3])

    var = bicycles[2]
    print(var)

    cars = ['bmw', 'audi', 'toyota', 'subaru'] 
    print(cars)

    cars.sort()
    print(cars)

    cars.reverse()
    print(cars)

#for循环: 遍历、创建
def for_usage():
    magicians = ['alice', 'david', 'carolina']
    v1 = 0
    for i in magicians:
        print ("magicians[" + str(v1) + "]: " + i) # i == magicians[v1]
        v1 = v1 + 1
    print (v1)

    #range: [1, 5)
    for value in range(1,5):
        print(value)

    print('创建列表：')
    ret = range(2,11,2)
    even_numbers = list(ret)
    print(even_numbers)

# 元组：只读
def tuple_usage():
    dimensions = (200, 50, 10)
    print(dimensions)
    
    print("find[0]: " + str(dimensions[0]))

    # dimensions.append(300)
    # print(dimensions)

    for i in dimensions:
        print (i)

    dimensions = (100, 25, 5)
    print(dimensions)

#if的用法
def if_usage():
    # bool var = 1 #布尔类型：true/false； yes/no

    # v1 = "xx"
    # #True/False
    # v = (v1 == "xx")
    # print(v)

    # vars = ("png", "jpg", "pdf", "exe")
    # #yes
    # for k in vars:
    #     if (k == "png"):
    #         print("这是png文件")
    #     elif (k == "jpg"):
    #         print("这是jpg文件")
    #     else:
    #         print("这是其他文件")

    # tuples1 = (100, 101, 102, 99)
    # for i in tuples1:
    #     if (i % 2 == 0):
    #         print("偶数：" + str(i))
    #     elif(i % 3 == 0):
    #         print("被3整除：" + str(i))
    #     else:
    #         print("奇数：" + str(i))

    tuples2 = (100, 101, 102, 99)
    print(tuples2)
    for i in tuples2:
        if ((i != 6) and (i > 101)):
            print("(i != 6) and (i > 101)：" + str(i))
        elif ((i != 6) or (i < 100)):
            print("(i != 6) or (i < 100)：" + str(i))
        else:
            print("这就是：" + str(i))

    print("this is :" + str(i))

    # if (i in tuples2)
    # v = i in tuples2 #True/False

    # if (a == b)
    # if (i in xxxs)
    # if (i not in xxxs)
    # if (a != b)
    # if (a > b)
    # if (a > b and a < c)

    a = 1
    b = 2
    var = a if(a > b) else b
    print(var)

    if (a > b):
        print("x")
    else:
        print("y")

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

#iput的用法
def input_usage():
    # vars_0 = {}
    # key = input("请输入name作为key：")
    # value = input("请输入name作为value：")
    # vars_0[key] = value
    # print(vars_0)

    #age 通过input传进来的值，无论是什么，一律作为字符串类型，比如输入21，它其实就是"21"
    age = input("how old are you: ")
    print(age)
    # if (int(age) > 18):
    #     print("age[" + age + "]是大于18岁的！")
    # else:
    #     print("age[" + age + "]是小于或等于18岁的！")

#while循环的用法
def while_usage():
    t = 100
    i = 0
    while True:
        i = i + 1
        print("1.我爱你！ i=" + str(i))
        #当i等于10001时，退出循环
        if (i > t):
            print("时间到期")
            break

    i = 0
    while (i <= t):
        i = i + 1
        print("2.我爱你！i=" + str(i))

        var = input("还爱吗？爱的话输入Y或yy, 否则退出循环：")
        if (var == "Y"):
            print("还爱")
        elif (var == "yy"):
            print("继续爱")
            continue
            print("此句被跳过，不会执行")
        else:
            print("不爱了")
            break

class Bird():
    def __init__(self, name, age):
        self.name = name
        self.age = age
        print("[__init__] I am a bird[" + name + ", " + str(age) + "]")

    def desc(self):
        print("[Bird.desc] name: " + self.name + ", age: " + str(self.age))

    def fly(self):
        print("[Bird.fly] name[" + self.name +  "] is fling")

    def eat(self):
        print("[Bird.eat] name[" + self.name +  "] is eating")

    def set_name(self, name):
        self.name = name

class Wing():
    def __init__(self):
        print("[Wing.fly1]: I am wing")

    def move(self):
        print("[Wing.move]: I can fly")

class Sparrow(Bird):
    def __init__(self, name, age):
        super().__init__(name, age)
        print("[__init__] I am a sparrow[" + self.name + ", " + str(self.age) + "]")
        self.legs = 2
        self.wing = Wing()

    def has_leg(self):
        print("Sparrow has " + str(self.legs) + " legs")

    def fly(self):
        print("[Sparrow.fly] name[" + self.name +  "] is fling slowly")

#类的用法
def class_usage():
    #实例化： 对象/实例 = 类 -> 马云与领袖的关系
    brid1 = Bird("bird", 9)
    brid1.desc()
    brid1.fly()
    brid1.eat()

    print("修改鸟的属性：")
    # brid1.name = "brid_100" #不建议直接修改类的属性
    brid1.set_name("brid_200")  #建议通过类的函数对类的属性进行修改
    brid1.desc()
    # print(brid1.legs)
    # brid1.has_leg()

    #麻雀
    sparrow = Sparrow("sparrow", 1)
    sparrow.desc()
    sparrow.fly()
    sparrow.eat()
    print(sparrow.legs)
    sparrow.has_leg()
    sparrow.wing.move()

#不同python文件的调用
def diff_files_usage():
    audi = Audi()
    audi.run()

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

    #8.iput的用法
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

    # from_book()

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
$ python python_grammar.py
```

