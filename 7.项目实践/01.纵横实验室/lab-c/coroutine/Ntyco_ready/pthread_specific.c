/**
 * 来自：https://blog.csdn.net/lwfcgz/article/details/37570667
 * 
 * pthread_getpecific和pthread_setspecific实现同一个线程中不同函数间共享数据的一种很好的方式
 * 
 */
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <pthread.h>
#include <string.h>
#include <sys/syscall.h>

pthread_key_t p_key;
 
void func1()
{
    int *tmp = (int*)pthread_getspecific(p_key);//同一线程内的各个函数间共享数据。
    printf("[%d][%lu][%ld]: %d is runing in %s\n", getpid(), pthread_self(), syscall(SYS_gettid), *tmp, __func__);
}

void *thread_func(void *args)
{
    pthread_setspecific(p_key, args);

    int *tmp = (int*)pthread_getspecific(p_key);//获得线程的私有空间
    printf("[%d][%lu][%ld]: %d is runing in %s\n", getpid(), pthread_self(), syscall(SYS_gettid), *tmp, __func__);

    *tmp = (*tmp) * 100;//修改私有变量的值

    func1();

    return (void*)0;
}

int main()
{
    pthread_t pa, pb;
    int a = 100;
    int b = 200;
    pthread_key_create(&p_key,NULL);
    pthread_create(&pa, NULL, thread_func, &a);
    pthread_create(&pb, NULL, thread_func, &b);
    pthread_join(pa, NULL);
    pthread_join(pb, NULL);
    return 0;
}
