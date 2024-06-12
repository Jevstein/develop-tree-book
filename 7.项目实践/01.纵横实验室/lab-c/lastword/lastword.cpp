/*
*  lastword.cpp
*  lastword
*
*  Created by Jevstein on 2018/10/24 14:02.
*  Copyright @ 2018year Jevstein. All rights reserved.
*
*  来自华为"程序临终遗言": linux程序崩溃时，捕捉到相关信号，从而打印出调用堆栈，方便
*  定位问题.类似有coredump.
*  [usage]:
*      如日志信息:
*         backtrace() returned 6 addresses.
*         Launcher received SIG: 8 Stack trace ...
*         0 ./lastword(_Z20handle_lastword_segvi+0x46) [0x4016af]
*         1 /lib/x86_64-linux-gnu/libc.so.6(+0x354b0) [0x7f6310e284b0]
*         2 ./lastword(_Z10func_crashv+0x29) [0x401834]
*         3 ./lastword(main+0x28) [0x401879]
*         4 /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xf0) [0x7f6310e13830]
*         5 ./lastword(_start+0x29) [0x401289]
*      定位到2 ./lastword(_Z10func_crashv+0x29) [0x401834],通过addr2line准确到行号:
*      $ addr2line -e lastword -f 0x401834
*      /home/jevstein/workspace/Dongnao/homework/lastword/lastword.cpp:128
*/

#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>
#include <execinfo.h>
#include <stdarg.h>
#include <string>

#define LOG_INFO(fmt, ...) log(fmt, ##__VA_ARGS__)
#define LOG_ERROR(fmt, ...) log(fmt, ##__VA_ARGS__)
//#define LOG_INFO log
//#define LOG_ERROR log

#define vscprintf(fmt, args) ({\
	int ret = 0;\
	va_list arg_copy;\
	va_copy(arg_copy, args); \
	ret = vsnprintf(NULL, 0, fmt, arg_copy); \
	va_end(arg_copy);\
	(ret);\
})

int log(const char* fmt, ...)
{
	static std::string str;
	int result = 0;
	va_list args;
	va_start(args, fmt);
	{
		size_t num_of_chars = vscprintf(fmt, args);
		if (num_of_chars >= str.capacity())
			str.resize(num_of_chars + sizeof(char));

		result = vsnprintf((char *)str.data(), str.capacity(), fmt, args);
	}
	va_end(args);

	if (result >= 0)
	{
		printf("%s\n", str.c_str());

		FILE* f = fopen("log.txt", "a");
		if (f)
		{
			time_t now_time = time(0);
			tm* now_tm = localtime(&now_time);
			char str_now[32] = { 0 };
			strftime(str_now, 32, "%b%d %H:%M:%S", now_tm);
			fprintf(f, "[%s] %s\n", str_now, str.c_str());
			fflush(f);
			fclose(f);
		}
	}

	return result;
}

void handle_lastword_segv(int signum)
{
#define BUF_SIZE 100
	void *buffer[BUF_SIZE];
    size_t size;
    char **strings;
    size_t i;

    signal(signum, SIG_DFL); //还原默认的信号处理handler

	size = backtrace(buffer, BUF_SIZE);
	log("========= backtrace() returned %d addresses =========", (int)size);

	strings = (char **)backtrace_symbols(buffer, size);
	if (strings == NULL)
	{
		//perror("backtrace_symbols");
		//exit(EXIT_FAILURE);
		log("backtrace_symbols");
	}
	else
	{
		log("Launcher received SIG: %d Stack trace ... ", signum);
		for (i = 0; i < size; i++)
		{
			log("%d %s", (int)i, strings[i]);
		}
		free(strings);
	}
}

void register_lastword()
{
	signal(SIGSEGV, handle_lastword_segv); // SIGSEGV    11  Core Invalid memory reference
    signal(SIGABRT, handle_lastword_segv); // SIGABRT    6   Core Abort signal from
    signal(SIGINT, handle_lastword_segv);
    signal(SIGTSTP, handle_lastword_segv);
    signal(SIGTERM, handle_lastword_segv);
	signal(SIGFPE, handle_lastword_segv);
}

void func_crash()
{
	char p[5];
	p[10] = 'a';
	int i = 0;
	i = (i + 100) / i;
}

int main(int argc, char *argv[])
{
	log("------ demo: last words ------");

	register_lastword();
	func_crash();

	log("------ the end ------");

	return 0;
}

//compile:
// $ g++ -g -o lastword *.cpp -rdynamic
