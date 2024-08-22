/*
 *  usermem_max.cpp 
 *  usermem_max
 *
 *  Created by Jevstein on 2018/10/31 15:04.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  0.问题:
 *    一个进程最大能开多少内存？
 *
 *  1.分析:
 *    32位意味着4G的寻址空间，linux把它分为两部分：
 *      ①“系统空间”(1G)：最高的1G(虚拟地址从0xC0000000到0xffffffff)用做内核本身.[由所有的进程共享]
 *      ②“用户空间”(3G)：较低的3G(从0x00000000到0xbffffff)用于各进程.[各个进程拥有其自己的3G用户空间]
 *    [注]:用户进程只能访问用户空间的虚拟地址，不能访问内核空间的虚拟地址, 只有用户进程进行系统调用（代表用
 *    户进程在内核态执行）等时刻可以访问到内核空间。内核空间地址有自己对应的页表，用户进程各自有不同的页表。
 *    每个进程的用户空间都是完全独立、互不相干的。
 *
 *  2.测试:
 *    以下摘自网络，实际栈空间不可超过8M:
 *       ①堆区最多开2G - 1大小空间
 *       ②栈区能开1G多，当接近2G就会报错
 *    亲测：
 *       栈空间默认是8M，申请8M-1时通过
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const long long LEN_1M = 1048576;			//1M: 1024*1024
const long long LEN_1G = 1073741824;		//1G: 2^30
const long long LEN_2G = (LEN_1G * 2 - 1);	//2G - 1:

//char s[LEN_2G];	//全局区域:

int main()
{
	//char t[LEN_1G + 1000];			//栈[网络.崩溃]：可开1G+空间，2G会编译不通过
	//char t[LEN_1M + 1000];				//栈：开1M+空间
	char t[LEN_1M * 8 - 1];				//栈：开1M+空间
	//char *p = (char *)malloc(LEN_2G);	//堆[网络]：可开2G内存,多1个都会编译错误（提示：整数溢出之类的错误）
	char *p = (char *)malloc(LEN_1G * 1);	//堆：

	//memset(s, 0, sizeof(s));
	memset(t, 0, sizeof(t));
	memset(p, 0, LEN_1G * 1);

	return 0;
}

//compile:
// $ g++ -o ../../../bin/usermem_max usermem_max.cpp