/**
 * 来自： https://blog.csdn.net/sjin_1314/article/details/10934239
 * 
 * 在多线程环境中，有些事仅需要执行一次。通常当初始化应用程序时，可以比较容易地将其放在main函数中。
 * 但当你写一个库时，就不能在main里面初始化了，你可以用静态初始化，但使用一次初始化（pthread_once）会比较容易些。
 *
 * int pthread_once(pthread_once_t *once_control, void (*init_routine) (void))；
 * 功能：本函数使用初值为PTHREAD_ONCE_INIT的once_control变量保证init_routine()函数在本进程执行序列中仅执行一次。
 *
 * 在多线程编程环境下，尽管pthread_once()调用会出现在多个线程中，init_routine()函数仅执行一次，
 * 究竟在哪个线程中执行是不定的，是由内核调度来决定。Linux Threads使用互斥锁和条件变量保证由
 * pthread_once()指定的函数执行且仅执行一次，而once_control表示是否执行过。
 * 如果once_control的初值不是PTHREAD_ONCE_INIT（Linux Threads定义为0），pthread_once() 的行为就会不正常。
 * 在LinuxThreads中，实际"一次性函数"的执行状态有三种：NEVER（0）、IN_PROGRESS（1）、DONE （2），如果once初值设为1，
 * 则由于所有pthread_once()都必须等待其中一个激发"已执行一次"信号，因此所有pthread_once ()都会陷入永久的等待中；
 * 如果设为2，则表示该函数已执行过一次，从而所有pthread_once()都会立即返回0
 * 
*/
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/syscall.h>
#include <pthread.h>
 
pthread_once_t once = PTHREAD_ONCE_INIT;
 
void once_run(void)
{
    printf("[%d][%lu][%ld][%s]: once_run in thread\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
}
 
void* func_child1(void * arg)
{
    printf("[%d][%lu][%ld][%s]: thread enter\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    pthread_once(&once, once_run);
    printf("[%d][%lu][%ld][%s]: thread return\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    return NULL;
}
 
void* func_child2(void * arg)
{
    printf("[%d][%lu][%ld][%s]: thread enter\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    pthread_once(&once, once_run);
    printf("[%d][%lu][%ld][%s]: thread return\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    return NULL;
}
 
int main(void)
{
    pthread_t tid1, tid2;
    printf("=========[%d][%lu][%ld][%s]: begin=========\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    pthread_create(&tid1, NULL, func_child1,NULL);
    pthread_create(&tid2, NULL, func_child2, NULL);
    sleep(10);
    printf("=========[%d][%lu][%ld][%s]: the end=========\n", getpid(), pthread_self(), syscall(SYS_gettid), __func__);
    return 0;
}
