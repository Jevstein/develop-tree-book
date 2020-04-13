[TOC]

# python之列表操作

## 1.基于列表的扩展

```python
list1 = [2,2,2,2]
print([2*x for x in list1])

#列表展开
list2 = [[1,2,3], [4,5,6], [4,3], [1]]
print([i for k in list2 for i in k]) #嵌套展开
```



## 2.将列表展开

```python
from interation_utilities import deepflatten

# 方法1
list1 = [[12,5,3], [2,4,[5],[6,9,7]],[5,8,[9,[10,12]]]]
print(list(deepflatten(list1)))

# 方法2: 递归
def flatten(lst):
  res = []
  for i in lst:
    if isinstance(i, list):
      res.extend(flatten(i))
    else:
      res.append(i)
  return res

#[12,5,3,2,4,5,6,9,7,5,8,9,10,12]
```



## 3.统计列表中元素的频率

```python
from collections import Counter
list1 = ['p', 'p', 'Y', 'y', 't', 't', 'h', 'o', 'o', 'o', 'n']
count = Counter(list1)
print(count) 
#Counter({'o': 3, 'p': 2, 't': 2, 'Y': 1, 'y': 1, 'h': 1, 'n': 1})
print(count['p']) #2
print(count.most_common(1))#[('o', 3)]

#手动实现
dict1 = {}
for i in list1:
  if i in dict1:
    dict1[i] += 1
  else:
    dict1[i] = 1
print(max(dict1, key=lambda x:dict1[x]))
```





> [你必须掌握的20个python代码，短小精悍，用处无穷](https://mp.weixin.qq.com/s/OjcLq1VUB4R6aYqNYhz9EA)