/*
 *  ctors.cpp 
 *
 *  Created by Jevstein on 2020/01/05 13:24.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - c++的全局构造和析构
 * [简介]：
 *    C++的全局构造和析构很特殊，依赖于编译器、链接器和运行库三者共同支持和协作。它的实现在Glibc和
 * MSVC CRT中的原理也十分相似。构造函数主要实现的是依靠特殊的段合并后形成构造函数数组，而析构则依赖
 * 于atexit()函数。
 *    对于MSVC来说，全局构造主要实现两个段“.CRT$XCA”和“.CRT$XCZ”，然后定义两个函数指针分别指向
 * 它们；而对于GCC来说，须要定义“.ctor”段的起始部分和结束部分，再定义两个函数指针分别指向它们。所以
 * 真正的构造部分只需一个循环将这两个函数指针指向的所有函数都调用一遍即可。
 *    MSVC实现只需一个目标文件即可实现全局构造，编译器会按照段名将所有的输入段排序；Glibc需要两个文
 * 件：ctrbegin.o和ctrend.o,这两文件在编译时必须位于输入文件的开始和结尾部分，所有在这两文件之外的
 * 输入文件中的“.ctor”段就不会被正确的合并。
 * 
 * [编译]：
 * 1.linux编译：
 *   $gcc -c -fno-builtin -nostdlib -fno-stack-protector ../mimicrt/*.c
 *   $g++ -c nostdinc++ -fno-rtti -fno-exceptions -fno-builtin -nostdlib -fno-stack-protector *.cpp
 *   $ar -rs minicrt++.a *.o
 * 
 * 2.Windows编译：
 *   $cl /c /DWIN32 /GS- ../minicrt/*.c
 *   $cl /c /DWIN32 /GS- /GR- *.cpp
 *   $lib *.obj /OUT:minicrt++.lib
 * 
 * 3.编译解释：
 *   1）/GR-：关闭RTTI功能，否则编译器会为有虚函数的类产生RTTI相关代码，在链接时报错：
 * “const type_info::'vftable”符号未定义
 *   2）而为了保证MinCRT++在linux下正常运行，需要建立新的源文件sysdep.cpp
 *   3) -fno-rtti: 与cl的/GR-作用一样，为了关闭RTTI
 *   4）-fno-exceptions: 用于关闭异常支持，否则GCC会产生异常支持代码，导致链接错误
 * 
 */
#include "minicrt++.h"

typedef void (* init_func)(void);

#ifdef WIN32
#pragma section(".CTR$XCA", long, read);
#pragma section(".CTR$XCZ", long, read);

__declspec(allocate(".CRT$XCA")) init_func ctors_begin[] = {0};
__declspec(allocate(".CRT$XCZ")) init_func ctors_end[] = {0};

extern "C" void do_global_ctors()
{
    init_func *p = ctors_begin;
    while (p < ctors_end)
    {
        if (*p != NULL)
            (**p)();
        ++p;
    } 
}
#else
void run_hooks();
extern "C" void do_global_ctors()
{
    run_hooks();
}
#endif