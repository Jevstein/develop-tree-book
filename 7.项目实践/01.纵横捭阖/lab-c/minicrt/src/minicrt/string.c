/*
 *  string.c 
 *
 *  Created by Jevstein on 2020/01/01 21:01.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - 字符串
 * [说明]：
 *      提供字符串长度计算、字符串比较、整数与字符串转换。该部分不涉及任何与内核交互的操作，即为纯粹的用户态
 * 计算
 */
#include "minicrt.h"

char* itoa(int n, char *str, int radix)
{
    char digit[]="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    char *p = str;
    char *head = str;

    if (!p || (radix < 2) || radix > 36)
        return p;//不支持的进制数

    if ((radix != 10) && (n < 0))
        return p;//非十进制不支持负数

    if (n == 0) {
        *p++ = '0';
        *p = 0;
        return p;//数字0
    }

    if ((radix == 10) && (n < 0)) {//负数
        *p++ = '-';
        n = -n;
    }

    while (n) {
        *p++ = digit[n % radix];
        n /= radix;
    }

    *p = 0;

    //倒转
    for (--p; head < p; ++head, --p) {
        char t = *head;
        *head = *p;
        *p = t;
    }

    return str;
}

void *memcpy(void *dst, const void *src, size_t n)
{
    char *p1 = (char *)dst;
    char *p2 = (char *)src;

    if (p1 == NULL || p2 == NULL || n == 0)
        return NULL;

    if (p1 < p2 + n && dst > src) {//同一块内存：向前拷贝
		p1 += n;
		p2 += n;
 
		while (n-- > 0) {
			*p1-- = *p2--;
		}
	}
	else {//同一块内存：向后拷贝
		while (n-- > 0) {
			*p1++ = *p2++;
		}
	}
    
    return dst;
}

int strcmp(const char *src, const char *dest)
{
    int ret = 0;
    unsigned char *p1 = (unsigned char *)src;
    unsigned char *p2 = (unsigned char *)dest;

    while (((ret = *p1 - *p2) == 0) && *p2)
        ++p1, ++p2;

    if (ret < 0)      ret = -1;
    else if (ret > 0) ret = 1;

    return (ret);
}

char* strcpy(char *dest, const char *src)
{
    char *ret = dest;
    while (*src)
        *dest++ = *src++;
    *dest = '\0';
    return ret;
}

char* strcpy_s(char *dest, const char *src, const unsigned max_size)
{
    char *ret = dest;
    unsigned i;
    for (i = 0; (i < max_size - 1) && *src; ++i)
        *dest++ = *src++;
    *dest = '\0';
    return ret;
}

unsigned strlen(const char *str)
{
    int cnt = 0;

    if (!str)
        return 0;

    for (; *str != '\0'; ++str)
        ++cnt;
    
    return cnt;
}