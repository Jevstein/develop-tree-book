/*
 *  new_delete.cpp 
 *
 *  Created by Jevstein on 2020/01/05 08:15.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - 重载new/delete运算符
 * [简介]：
 *    new操作是C++的操作符函数，类似+、-、*、%等重载操作符。请看如下定义：
 *       void* operator new(unsigned int size); 
 * 通常new/delete的内部都是通过malloc/free实现的。值得注意的是，new/delete内部其实只负责堆空间的
 * 申请和释放，而对象的构造和析构是在new/delete之前/之后由编译器负责产生相应的代码进行调用的。
 *    在使用真实的c++运行库时，若使用上述代码，会将运行库中的new/delete覆盖。在开发中经常用到，自己
 * 实现new/delete重载以便实现一些特殊功能，如：检测内存泄漏（在new/delete内部打上对象的标记）。这
 * 也叫全局new/delete操作符重载（Global new/delete operator overloading）。除此还有指定对象申
 * 请地址（Raplcement new），即重载某个类的new/delete，可使用自己实现的堆算法堆某个对象的申请/释放
 * 进行优化，从头提高程序的性能。
 * 
 * [小技巧]：
 *    1.利用gcc反汇编查看glibc的new实现
 *      $g++ -c hello.c
 *      $objdump -dr hello.o
 *      $c++filt _Znwj
 */
#include "minicrt++.h"

extern "C" void* malloc(size_t);
extern "C" void free(void*);

void* operator new (size_t size)
{
    return malloc(size);
}

void* operator new[] (size_t size)
{
    return malloc(size);
}

void operator delete (void* p)
{
    return free(p);
}

void operator delete[] (void* p)
{
    return free(p);
}