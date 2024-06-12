#ifndef __MINI_CRT_H__
#define __MINI_CRT_H__

#ifdef __cplusplus
extern "C" {
#endif

#ifndef NULL
#define NULL (0)
#endif

#ifndef size_t
typedef unsigned int size_t;
#endif

// malloc
void free(void *ptr);
void* malloc(unsigned size);
static int brk(void *end_data_segment);
int mini_crt_heap_init();

// string
char* itoa(int n, char *str, int radix);
void *memcpy(void *dst, const void *src, size_t n);
int strcmp(const char *src, const char *dest);
char* strcpy(char *dest, const char *src);
char* strcpy_s(char *dest, const char *src, const unsigned max_size);
unsigned strlen(const char *str);

// file & I/O
typedef int FILE;

#define EOF (-1)

#ifdef WIN32
#define stdin  ((FILE *)(GetStdHandle(STD_INPUT_HANDLE)))
#define stdout ((FILE *)(GetStdHandle(STD_OUTPUT_HANDLE)))
#define stderr ((FILE *)(GetStdHandle(STD_ERROR_HANDLE)))
#else//linux: 一切皆文件，标准I/0的文件描述符0、1、2
#define stdin  ((FILE *)0)
#define stdout ((FILE *)1)
#define stderr ((FILE *)2)
#endif

int mini_crt_io_init();
FILE* fopen(const char *filename, const char *mode);
int fread(void *buffer, int size, int count, FILE *stream);
int fwrite(const void *buffer, int size, int count, FILE *stream);
int fclose(FILE *fp);
int fseek(FILE *fp, int offset, int set);

// printf
int fputc(int c, FILE *stream);
int fputs(const char *str, FILE *stream);
int printf(const char *format, ...);
int fprintf(FILE *stream, const char *format, ...);

// internal
void do_global_ctors();
void mini_crt_call_exit_routine();

// atexit
typedef void (*cxa_funt_t)(void *);//兼容gcc
typedef void (*atexit_func_t)(void);
int __cax_atexit(cxa_funt_t func, void* arg, void*);//兼容gcc
int atexit(atexit_func_t func);

#ifdef __cplusplus
}
#endif

#endif//__MINI_CRT_H__