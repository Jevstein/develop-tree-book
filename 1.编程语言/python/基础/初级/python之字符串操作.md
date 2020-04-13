[TOC]

# python之字符串操作

## 1.字符串的翻转

```python
#方法1:
str1 = 'hello world'
print(str1[::-1])

#方法2:
#reduce函数需要从functools中进行导入
from functools import reduce
print(reduce(lambda x, y:y+x, str1))
```



## 2.判断字符串是否是回文

```python
str1 = "abcba"#回文
str2 = "abcde"

def func(string):
  if string == string[::-1]:
    print("Yes")
  else:
    print("No")
```



## 3.单词大小写

```python
str1 = 'i love python'
print(str1.title()) #单词首字母大写
print(str1.upper()) #所有字母大写
print(str1.captitalize()) #字符串首字母大写
```



## 4.字符串的拆分

```python
str1 = "I love python"
str2 = "I/love/python"
str3 = " I love python  "
print(str1.split())#默认安空格拆分，返回列表
print(str2.split('/'))
print(str3.strip())
```



## 5.将列表中的字符串合并

```python
list1 = ['I', 'love', 'python']
print(' '.join(list1))

#去除字符串中不需要的字符
import re
str1 = 'I/ love. python'
print(' '.join(re.split('\W+', str1)))
```



## 6.寻找字符串中唯一的元素

```python
str1 = 'wwweeerftttg'
print(''.join(set(str1))) #ftgwer

#对于列表的筛查
list1 = [2,4,5,6,7,1,2]
print(list(set(list1))) #[1,2,4,5,6,7]
```



## 7.将元素进行重复

```python
#1.乘法表述
str1 = 'Python'
list1 = [1,2,3]
print(str1 * 2)
print(list1 * 2)

#2.加法表述
str2 = 'Python'
list2 = [1,2,3]
str2_1 = ''
list2_1 = []
for i in range(2):
  str2_1 += str1
  list2_1.extend(list2)
print(str2_1)
print(list2_1)
```



## 8.判断字符串所含元素是否相同

```python
str1, str2, str3 = 'qwert', 'qertw', 'reqtw'
cnstr1, cnstr2, cnstr3 = Counter(str1)
                       , Counter(str2)
                       , Counter(str3)
if (cn_str1 == cn_str2 and cn_str2 == cnstr3):
  print('三个字符串所含元素相同')
  
#【注】Counter函数用来判断字符串中包含的元素是否相同，无论字符串中元素顺序如何，只要包含相同的元素和数量，就认为其是相同的。
```



## 9.将数字字符串转化为数字列表

```python
str1 = '2345343'

#方法1
list1 = list(map(int, str1))
print(list1) #[2,3,4,5,3,4,3]

#方法2
list2 = [int(i) for i in str1]
print(list1) #[2,3,4,5,3,4,3]
```



## 10.使用enumerate() 函数来获取索引-数值对

```python
str1 = 'python'
for i, j in enumerate(str1):
  print(i, j)
"""
	0 p
	1 y
	2 t
	3 h
	4 o
	5 n
"""
```





> [你必须掌握的20个python代码，短小精悍，用处无穷](https://mp.weixin.qq.com/s/OjcLq1VUB4R6aYqNYhz9EA)

