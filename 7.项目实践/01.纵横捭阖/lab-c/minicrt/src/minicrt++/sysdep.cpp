/*
 *  sysdep.cpp 
 *
 *  Created by Jevstein on 2020/01/05 15:50.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - linux专用
 * [简介]：
 *    C++的全局构造和析构很特殊，依赖于编译器、链接器和运行库三者共同支持和协作。它的实现在Glibc和
 * MSVC CRT中的原理也十分相似。构造函数主要实现的是依靠特殊的段合并后形成构造函数数组，而析构则依赖
 * 于atexit()函数。
 *    为了保证MinCRT++在linux下正常运行，需要建立新的源文件sysdep.cpp，用于定义linux平台相关的
 * 一个函数__dso_hanlde。这个函数用于处理共享库的全局对象构造和析构。因为共享库也可以拥有全局对象，
 * 这些全局对象在共享库被装载和卸载时必须被正确地构造和析构，而共享库可能在进程退出之前被卸载，如使用
 * dlopen/dlcose。那么就会产生一个问题：如何使得属于某个共享库的全局对接析构函数在共享库被卸载时运
 * 行呢？GCC的做法则向__cxa_atexit()传递一个参数，这个参数用于标示这个析构函数属于哪一个共享对象。
 * 于是__cxa_atexit()第三个参数，即用于标示共享对象，它就是__dso_handle这个符号。由于在MiniCRT++
 * 中不考虑对共享库的支持，仅仅定义了此符号为0，以防链接时出现符号未定义的错误。
 * 
 */

#ifndef WIN32
    extern "C" {
        void* __dso_hanlde = 0;
    }
#endif