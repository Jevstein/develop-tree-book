/*
 *  molloc.c 
 *
 *  Created by Jevstein on 2020/01/01 17:22.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - 堆的实现
 * [说明]：
 *      简单实现一个堆的操作，这里采用“空闲双链表”的内存分配堆空间算法，且堆空间大小规定为32MB，初始化后
 * 空间不再扩展和缩小。windows下采用VirtualAlloc代替HeapAlloc分配堆空间；Linux下采用brk通过系统调用
 * 分配堆空间。
 * 
 * [缺陷]：
 *      1.搜索算法的时间复杂度为：O(n)(n为堆中分配的块的数量)
 *      2.堆空间固定为32MB，无法扩张
 *      3.未实现realloc、calloc函数
 *      4.无良好堆堆溢出防范机制
 *      5.非线程安全
 * 
 * [改进]：
 *      采用“多级位图算法”分配堆空间
 */
#include "minicrt.h"

typedef struct _heap_header
{
    enum {
        HEAP_BLOCK_FREE = 0xABABABAB, //the magic number of free block
        HEAP_BLOCK_USED = 0xCDCDCDCD, //the magic number of used block
    } type;

    unsigned size; //the block size including header
    struct _heap_header* next;
    struct _heap_header* prev;
} heap_header_t;

#define ADDR_ADD(a, o) ((char *)a + o)
#define HEADER_SIZE (sizeof(heap_header_t))

static heap_header_t* list_head__ = NULL;

void free(void *ptr)
{
    heap_header_t *header = (heap_header_t *)ADDR_ADD(ptr, -HEADER_SIZE);
    if (header->type != HEAP_BLOCK_USED)
        return;

    header->type = HEAP_BLOCK_FREE;

    //merge prev
    if ((header->prev != NULL) && (header->prev->type == HEAP_BLOCK_FREE)) {
        header->prev->next = header->next;
        if (header->next != NULL)
            header->next->prev = header->prev;

        header->prev->size += header->size;
        header = header->prev;
    }

    //merge next
    if ((header->next != NULL) && (header->next->type == HEAP_BLOCK_FREE)) {
        header->size += header->next->size;
        header->next = header->next->next;
    }
}

void* malloc(unsigned size)
{
    heap_header_t *header;

    if (size == 0)
        return NULL;

    for (header = list_head__; header != NULL; header = header->next) {
        if (header->type == HEAP_BLOCK_USED)
            continue;

        // 找到的空闲块大小刚刚好
        if ((size + HEADER_SIZE) < header->size
            && header->size <= (size + HEADER_SIZE * 2)) {
            header->type = HEAP_BLOCK_USED;
            return (heap_header_t *)ADDR_ADD(header, HEADER_SIZE);
        }

        // 找到的空闲块大小很大，需要拆分
        if (header->size > (size + HEADER_SIZE * 2)) {
            // split
            heap_header_t *next = (heap_header_t *)ADDR_ADD(header, HEADER_SIZE + size);
            next->prev = header;
            next->next = header->next;
            next->type = HEAP_BLOCK_FREE;
            next->size = header->size - (HEADER_SIZE + size);

            header->next = next;
            header->size = HEADER_SIZE + size;
            header->type = HEAP_BLOCK_USED;
            return (heap_header_t *)ADDR_ADD(header, HEADER_SIZE);
        }
    }

    return NULL;
}

#ifdef WIN32
#include <windows.h>
#else //linux brk system call
static int brk(void *end_data_segment)
{
    int ret = 0;
    // brk system call number: 45
    // in /usr/include/asm-i386/unistd.h:
    // #define __NR_brk 45
    asm("movl $45, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "int $0x80 \n\t"
        "movl %%eax, %0 \n\t"
        : "=r"(ret): "m"(end_data_segment));

    return ret;
}
#endif

int mini_crt_heap_init()
{
    void *base = NULL;
    heap_header_t *header = NULL;
    unsigned heap_size = 1024 * 1024 * 32; //32MB heap size

#ifdef WIN32
    base = VirtualAlloc(0, heap_size, MEM_COMMIT|MEM_RESERVE, PAGE_READWRITE);
    if (base == NULL)
        return -1;//no space
#else
    base = (void *)brk(0);
    void *end = ADDR_ADD(base, heap_size);
    end = (void *)brk(end);
    if (end == NULL)
        return -1;//cross the border
#endif

    header = (heap_header_t *)base;
    header->prev = NULL;
    header->next = NULL;
    header->size = heap_size;
    header->type = HEAP_BLOCK_FREE;

    list_head__ = header;

    return 0;
}