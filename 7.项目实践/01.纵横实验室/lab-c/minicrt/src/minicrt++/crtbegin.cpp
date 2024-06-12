/*
 *  crcbegin.cpp 
 *
 *  Created by Jevstein on 2020/01/05 14:05.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - c++的全局构造和析构
 * [简介]：
 *      见ctors.cpp
 */
#include "minicrt++.h"

#ifndef WIN32
typedef void (*ctor_func)(void);

ctor_func ctors_begin[1] __attribute__((section(".ctors"))) =
{
    (ctor_func) - 1
};

void run_hooks()
{
    const ctor_func* list = ctors_begin;
    while ((int)*++list != -1)
    {
        (**list)();
    }
}
#endif