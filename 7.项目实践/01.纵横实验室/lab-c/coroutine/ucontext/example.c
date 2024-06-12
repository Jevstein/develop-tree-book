/*
 *  example.c 
 *  example
 *
 *  Created by Jevstein on 2018/11/11 14:44.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  参考: https://blog.csdn.net/qq910894904/article/details/41911175
 *
 *  核心函数:
 *    //初始化ucp结构体，将当前的上下文保存到ucp中
 *    int getcontext(ucontext_t *ucp);
 *
 *    //设置当前的上下文为ucp，setcontext的上下文ucp应该通过getcontext或者makecontext
 *      取得，如果调用成功则不返回
 *    int setcontext(const ucontext_t *ucp);
 *
 *    //修改通过getcontext取得的上下文ucp(这意味着调用makecontext前必须先调用getcontext),
 *      然后给该上下文指定一个栈空间ucp->stack，设置后继的上下文ucp->uc_link
 *    void makecontext(ucontext_t *ucp, void (*func)(), int argc, ...);
 *
 *    //保存当前上下文到oucp结构体中，然后激活upc上下文。
 *    int swapcontext(ucontext_t *oucp, ucontext_t *ucp);
 */
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>

void context_func1()
{
	ucontext_t context;

	puts("flag1");//执行1次

	getcontext(&context);
	puts("flag2");//循环执行
	sleep(1);
	setcontext(&context);

	puts("flag3");//永不执行
}

void child_func(void * arg)
{
	puts("1");
	puts("11");
	puts("111");
	puts("1111");
}

void context_func2()
{
	char stack[1024 * 128];
	ucontext_t child, main;

	puts("flag1");
	getcontext(&child); //获取当前上下文
	child.uc_stack.ss_sp = stack;//指定栈空间
	child.uc_stack.ss_size = sizeof(stack);//指定栈空间大小
	child.uc_stack.ss_flags = 0;
	child.uc_link = &main;//设置后继上下文
	//child.uc_link = NULL;//无后继上下文，将输出"flag_main"

	puts("flag2");
	makecontext(&child, (void(*)(void))child_func, 0);//修改上下文指向child_func函数

	puts("flag3");
	swapcontext(&main, &child);//切换到child上下文，保存当前上下文到main

	puts("flag_main");//如果设置了后继上下文，func1函数指向完后会返回此处
}

int main(int argc, const char *argv[]){
	printf("========= ucontext test =========\n");

#if 0
	context_func1();
#else
	context_func2();
#endif

	printf("========= the end =========\n");

	return 0;
}

//complie:
// $ g++ -o ../../../bin/ucontext_example example.c