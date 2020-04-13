[TOC]

# python之其它操作

## 1.交换

```python
a, b = 1, 2
#方法1
a, b = b, a
print(a, b)

#方法2
c = a + b
a = c - a
b = c - a
print(a, b)
```



## 2.代码执行消耗时间

```python
import time
start = time.time()

num = 0
for i in range(1000000):
  num = i

print('time: ', time.time() - start, 's')
```



## 3.检查对象的内存占用大小

```python
import sys
str1 = 'a'
str2 = 'aaddf'
num = 32
print(sys.getsizeof(str1)) #50
print(sys.getsizeof(str2)) #54
print(sys.getsizeof(num))	 #28
```



## 4.字典的合并

```python
dict1 = {'a':1, 'b':2}
dict2 = {'c':2, 'b':4}

#方法1
dict3 = {**dict1, **dict2}
print(dict3) #{'d':4, 'a':1, 'b':2, 'c':3}

#方法2
dict1.update(dict2)
print(dict1) #{'d':4, 'a':1, 'b':2, 'c':3}
```



## 5.随机采样

```python
import random
str1 = 'wewewe'
list1 = [1,2,3,4,5]

n = 3
print(random.sample(list1, n))#[6,4,5]
print(random.sample(str1, n))#['e','e','w']
```



## 6.检查唯一性

```python
str1 = [1,2,3,4,5,6]
str2 = [1,2,2,2,5,6]

def ifUnque(seq):
  if (len(seq) == len(set(seq))):
    print("唯一")
  else:
    print("不唯一")
```



> [你必须掌握的20个python代码，短小精悍，用处无穷](https://mp.weixin.qq.com/s/OjcLq1VUB4R6aYqNYhz9EA)