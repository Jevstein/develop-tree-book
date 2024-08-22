/*
 *  examples.cpp 
 *
 *  Created by Jevstein on 2020/01/12 14:06.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  mini_crt++测试
 * [简介]：
 *      APP的程序运行入口为main函数，而main函数却是由运行库（Glibc、MSVC RCT）最初调用的。所以首先要
 * 确定Min CRT的入口函数，它得至少负责三部分工作：1.准备好程序运行环境及完成CRT的初始化；2.调用main函数
 * 执行程序主题；3.清理程序运行后的各种资源。其次，运行库为所有程序提供的入口函数应该相同，在链接程序时要
 * 指定该入口函数名。Mini CRT的入口函数约定为：void mini_crt_entry(void)
 * 
 * [编译]：
 * 1.linux编译：
 *     $g++ -c -nostdinc++ -fno-rtti -fno-exceptions -fno-builtin -nostdlib -fno-stack-protector *.cpp
 *     $ld -static -e mini_crt_entry minicrt/entry.o minicrt/crtbegin.o examples.o minicrt++/minicrt++.a -o examples
 * 
 * 2.windows编译：
 *     $cl /c /DWIN32 /GR- *.cpp
 *     $link examples.obj minicrt++/minicrt++.lib kernel32.lib /NODEFAULTLIB /entry:mini_crt_entry
 * 
 */
#include "minicrt++/minicrt++.h"

int main(int argc, char *argv[])
{
    std::string *msg = new std::string("hello world");
    std::cout << (*msg).c_str() << std::endl;

    std::ofstream os("test++.txt");

    delete msg;
}