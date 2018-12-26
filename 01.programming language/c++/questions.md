<!-- vscode-markdown-toc -->
* 1. [如何创建一个不能继承的类？只能在堆上生成的对象？只能在栈上生成的对象？](#)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# C++ questions

##  1. <a name=''></a>如何创建一个不能继承的类？只能在堆上生成的对象？只能在栈上生成的对象？
```
1.答案分别为：私有化构造函数、私有化析构函数、私有化重载new和delete。

2."只能在栈上生成的对象"使用“私有化重载new和delete”不严谨：因为new/delete操作的是‘自由存储空间’，相对于操作系统的‘堆’，malloc才是真正的操作者。显然在不禁用用户直接操作malloc的情况下，单单“私有化重载new和delete”是做不到的。
```
