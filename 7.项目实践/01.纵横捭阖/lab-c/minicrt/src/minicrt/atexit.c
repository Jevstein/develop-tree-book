/*
 *  atexit.c 
 *
 *  Created by Jevstein on 2020/01/05 14:20.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - 退出
 * [简介]：
 *      所有全局对象的析构函数（甭管是Linux还是windows），都是通过atexit或其它类似函数来注册的，以达到
 * 在程序退出时执行的目的。
 *      实现的方法则是使用一个链表把所有注册的函数存储起来，到exit()时将链表遍历一遍，执行其中所有的回调
 * 函数。windows即可完全按此思路实现，但linux稍显复杂，因为GCC实现全局对象但析构不是调用atexit，而是调
 * 用__cax_atexit。__cax_atexit不是c语言标准库函数，而是GCC实现但一部分，为了兼容GCC，Mini CRT不得
 * 不将其定义实现。
 *      __cax_atexit所接受的函数指针必须有一个void*型指针作为参数，且调用__cxa_atexit时记录下这个参
 * 数(void* arg)，等到要执行的时候再传递过去。_cax_atexit最后一个参数可生了，在设计链表时，要考虑到这，
 * 点，链表的节点必须能够区分是否为atexit()函数__cxa_atexit()注册的函数，若是则把回调函数的参数保存下来
 *      在注册函数register_atexit()中，被注册的函数插入到列表头；最后遍历释放函数mini_crt_call_exit_routine
 * 中从头部开始遍历，恰好符合构造/析构函数的栈规则，即：先注册后调用的顺序（FILO）- 先构造后析构
 * 
 */
 #include "minicrt.h"

typedef struct _func_node
{
    atexit_func_t func;
    void *arg;
    int is_cxa;
    struct _func_node* next;
} func_node_t;

static func_node_t* atexit_list__ = NULL;

int register_atexit(atexit_func_t func, void *arg, int is_cxa)
{
    func_node_t *node;
    if (!func)
        return -1;
    
    node = (func_node_t*)malloc(sizeof(func_node_t));
    if (node == NULL)
        return -1;

    node->func = func;
    node->arg = arg;
    node->is_cxa = is_cxa;
    node->next = atexit_list__;
    atexit_list__ = node;
    return 0;
}

#ifndef WIN32
typedef void (*cxa_func_t)(void *);

int __cxa_atexit(cxa_func_t func, void *arg, void *unused)
{
    return register_atexit((atexit_func_t)func, arg, 1);
}
#endif

int atexit(atexit_func_t func)
{
    return register_atexit(func, 0, 0);
}

void mini_crt_call_exit_routine()
{
    func_node_t *p = atexit_list__;
    for (; p != 0; p = p->next)
    {
#ifdef WIN32
        p->func();
#else
        if (p->is_cxa) ((cxa_func_t)p->func)(p->arg);
        else            p->func();
#endif
        free(p);
    }
    atexit_list__ = NULL;
}