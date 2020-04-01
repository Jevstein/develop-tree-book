[TOC]

# python的可变参数

​	如何像c语言中的printf(...)函数，用python也实现一个可变参数的日志打印功能？

## 1.语法定义

​	python中可用单星号(*)或双星号(**)实现函数中多参数的传递和拆解。其中：

* 1.单星号(*):  代表这个位置接收任意多个非关键字参数并将其转化成元组

  ```shell
  e.g: *args的功能------接收N个位置参数，转换成元组tuple形式
  ```

* 2.双星号(**): 代表这个位置接收任意多个关键字参数并将其转化成字典

  ```shell
  e.g: **kwargs的功能------接收N个关键字参数，转换成字典dict形式
  ```

  举例：

  ```python
  #1.单星号(*)
  >>> def test(a,*args):
  ...    """a是一个普通传入的参数
  ...    :args是一个非关键字星号参数
  ...    """
  ...    print('*args:{0}'.format(args))
  >>> a=[1,2,3]
  >>> test(4,*a)
  *args:(1, 2, 3)
  
  #2.双星号(**)
  >>> def test(a,**kwargs):
  ...    """a是一个普通传入的参数
  ...    :args是一个关键字星号参数
  ...    """
  ...    print('*kwargs:{0}'.format(kwargs))
  >>> b={'name':'ganin','age':18}
  >>> test(1,**b)
  >>> *kwargs:{'name': 'ganin', 'age': 18}
  ```

## 2.变量拆分

* 1.单星号(*)的拆分：元组

  ```python
  >>> def test(*args):
  ...    """
  ...    :args是一个非关键字星号参数
  ...    """
  ...    print(args[1])
  >>> a=[1,2,3]
  >>> #test(a)#IndexError: tuple index out of range报错，没有使用*的直接把所有的转为元组
  >>> test(*a)#能够将这个变量拆分成单个元素
  >>> 2
  #注意：*是无法拆分字典的
  >>> b={'name':'ganin','age':18}
  >>> test(*b)
  >>> age
  ```

* 2.双星号(**)的拆分：字典

  ```python
  >>> def test(**kwargs):
  ...    """
  ...    :kwargs
  ...    """
  ...    print(kwargs)
  >>> b={'name':'ganin','age':18}
  >>> test(**b)
  >>> {'name': 'ganin', 'age': 18}
  ```

## 3.可变参数打印

```python
def log_err(*args):
    print('[error]:', *args)
```




> 参考：[python可变参数总结](https://www.cnblogs.com/ganiner/p/10066765.html)

