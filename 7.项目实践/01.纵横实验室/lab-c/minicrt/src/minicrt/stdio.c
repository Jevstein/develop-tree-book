/*
 *  stdio.c 
 *
 *  Created by Jevstein on 2020/01/01 19:09.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - I/O与文件操作
 * [说明]：
 *      1.简单实现基本堆文件操作，如：fopen、fread、fwrite、fclose及fseek
 *      2.不实现缓冲(buffer)机制
 *      3.不对Windows下的换行机制进行转换，即：“\r\n”与“\n”之间不作转换
 *      4.Windows下采用API：CreateFile、ReadFile、WriteFile、CloseHandle和SetFilePointer; Linux
 * 通过系统调用，内嵌汇编实现：_open、_read、_write、_close和_seek
 *      5.仅实现“r”、“w”和“+”几个模式和它们的组合，不区分文本模式和二进制模式，不支持“a”的追加模式
 */
#include "minicrt.h"

int mini_crt_io_init()
{
    //很基础，暂时没什么要实现的
    return 0;
}

#ifdef WIN32
#include <Windows.h>

FILE* fopen(const char *filename, const char *mode)
{
    HANDLE hFile = 0;
    int access = 0;
    int creation = 0;

    if (strcmp(mode, "w") == 0) {
        access |= GENERIC_WRITE;
        creation |= CREATE_ALWAYS;
    }

    if (strcmp(mode, "w+") == 0) {
        access |= GENERIC_WRITE | GENERIC_READ;
        creation |= CREATE_ALWAYS;
    }

    if (strcmp(mode, "r") == 0) {
        access |= GENERIC_READ;
        creation |= OPEN_EXISTING;
    }

    if (strcmp(mode, "r+") == 0) {
        access |= GENERIC_WRITE | GENERIC_READ;
        creation |= OPEN_EXISTING;
    }

    hFile = CreateFileA(filename, access, 0, 0, creation, 0, 0);
    if (hFile == INVALID_HANDLE_VALUE)
        return NULL;
    
    return (FILE *)hFile;
}

int fread(void *buffer, int size, int count, FILE *stream)
{
    int read = 0;
    if (!ReadFile((HANDLE)stream, buffer, size * count, &read, 0))
        retrun 0;

    return read;
}

int fwrite(const void *buffer, int size, int count, FILE *stream)
{
    int written = 0;
    if (!WriteFile((HANDLE)stream, buffer, size * count, &written, 0))
        return 0;

    return written;
}

int fclose(FILE *fp)
{
    return CloseHandle((HANDLE)fp);
}

int fseek(FILE *fp, int offset, int set)
{
    return SetFilePointer((HANDLE)fp, offset, 0, set);
}

#else//linux

static int _read(int fd, void *buffer, unsigned size)
{
    int ret = 0;
    asm("movl $3, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "movl %2, %%ecx \n\t"
        "movl %3, %%edx \n\t"
        "int $0x80 \n\t"
        "movl %%eax, %0 \n\t"
        :"=m"(ret):"m"(fd),"m"(buffer), "m"(size));
    return ret;
}

static int _write(int fd, const void *buffer, unsigned size)
{
    int ret = 0;
    asm("movl $4, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "movl %2, %%ecx \n\t"
        "movl %3, %%edx \n\t"
        "int $0x80 \n\t"
        "movl %%eax, %0 \n\t"
        :"=m"(ret):"m"(fd),"m"(buffer), "m"(size));
    return ret;
}

static int _open(const char* filename, int flags, int mode)
{
    int fd = 0;
    asm("movl $5, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "movl %2, %%ecx \n\t"
        "movl %3, %%edx \n\t"
        "int $0x80 \n\t"
        :"=m"(fd):"m"(filename), "m"(flags), "m"(mode));
    return fd;
}

static int _close(int fd)
{
    int ret = 0;
    asm("movl $6, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "int $0x80 \n\t"
        "movl %%eax, %0 \n\t"
        :"=m"(ret):"m"(fd));
    return ret;
}

static int _seek(int fd, int offset, int mode)
{
    int ret = 0;
    asm("movl $19, %%eax \n\t"
        "movl %1, %%ebx \n\t"
        "movl %2, %%ecx \n\t"
        "movl %3, %%edx \n\t"
        "int $0x80 \n\t"
        "movl %%eax, %0 \n\t"
        :"=m"(ret):"m"(fd),"m"(offset),"m"(mode));
    return ret;
}

FILE* fopen(const char *filename, const char *mode)
{
    int fd = -1;
    int flags = 0;
    int access = 00700;

//come from: /usr/include/bits/fcntl.h [octal]
#define O_RDONLY    00
#define O_WRONLY    01
#define O_RDWR      02
#define O_CREAT     0100
#define O_TRUNC     01000
#define O_APPEND    02000

    if (strcmp(mode, "w")  == 0) flags |= O_WRONLY | O_CREAT | O_TRUNC;
    if (strcmp(mode, "w+") == 0) flags |= O_RDWR | O_CREAT | O_TRUNC;
    if (strcmp(mode, "r")  == 0) flags |= O_RDONLY;
    if (strcmp(mode, "r+") == 0) flags |= O_RDONLY | O_CREAT;

    fd = _open(filename, flags, access);
    return (FILE *)fd;
}

int fread(void *buffer, int size, int count, FILE *stream)
{
    return _read((int)stream, buffer, size * count);
}

int fwrite(const void *buffer, int size, int count, FILE *stream)
{
    return _write((int)stream, buffer, size * count);
}

int fclose(FILE *fp)
{
    return _close((int)fp);
}

int fseek(FILE *fp, int offset, int set)
{
    return _seek((int)fp, offset, set);
}

#endif