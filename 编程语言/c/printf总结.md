[TOC]


# printf用法总结

##  1. “%S格式符”用法举例
使用printf()函数打印字符串的任意部分，请看下例：
```
#include <stdio.h>  
#include <stdlib.h>  
#include <string.h>  
  
int main()  
{  
    char * source_str = "THIS IS THE SOURCE STRING" ;  
  
    /* Use printf() to print the first 11 characters of source_str. */  
    printf("First 11 characters: ' %11.11s'\n" , source_str);  
  
    /* Use printf() to print only the last 13 characters of source _str. */  
    printf("Last 13 characters:'%13.13s'\n", source_str+(strlen(source_str)-13));  
}
```
输出结果为：    
First 11 characters: 'THIS IS THE'    
Last 13 characters：'SOURCE STRING'  

在上例中，第一次调用printf()函数时，通过指定参数"%11.11s"，迫使printf()函数只打印11个字符的长度，因为源字符串的长度大于11个字符，所以在打印时源字符串将被截掉一部分，只有头11个字符被打印出来。第二次调用printf()函数时，它将源字符串的最后13个字符打印出来，其实现过程为：  
(1). 用strlen()函数计算出source_str字符串的长度，即strlen(source_str)。  
(2). 将source_str的长度减去13(13是将要打印的字符数)，得出source_str中剩余字符数。  
(3). 将strlen(source_str)-13和source_str的地址相加，得出指向source_str中倒数第13个字符的地址的指针；即source_str+(strlen(source_str)-13)。这个指针就是printf()函数的第二个参数。  
(4). 通过指定参数“％13．13s”，迫使printf()函数只打印13个字符的长度，其结果实际上就是打印源字符串的最后13个字符。


##  2. “%S格式符”用法说明

(1). ％ms：输出的字符串占m列，如果字符串本身长度大于m，则突破m的限制，将字符串全部输出；若串长度小于m，则在左边补空格。  
(2). ％－ms：如果字符串长度小于m，则在m列范围内，字符串向左靠，右补空格。  
(3). ％m.ns：输出占m列，但只取字符串中左端n个字符。这n个字符输出在m列范围的右侧，左补空格。  
(4). ％－m.ns：其中的m、n的含义同上，n个字符输出在m列范围的左侧，右补空格。如果n>m，则m自动取n值，即保证n个字符正常输出。