/*
 *  jvt_timeheap.c 
 *  jvt_timeheap
 *
 *  Created by Jevstein on 2019/05/05 19:59.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  时间堆：见《Linux高性能服务器编程》 游双著
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <assert.h>
#include <time.h>
#include <netinet/in.h>

typedef struct _th_timer {
    time_t expire;//定时器生效的绝对时间
    void (*cb_func)(void *);
    void *user_data;
} th_timer_t;

typedef struct _time_heap {
    th_timer_t **array;//堆数组
    int capacity;//堆数组容量
    int size;//堆数组当前包含元素的个数
} timer_heap_t;

int th_init(timer_heap_t *T, int capacity);
int th_init_array(timer_heap_t *T, th_timer_t **array, int size, int capacity);
void th_destroy(timer_heap_t *T);
int th_add_timer(timer_heap_t *T, th_timer_t *timer);
void th_del_timer(timer_heap_t *T, th_timer_t *timer);
th_timer_t* th_top_timer(timer_heap_t *T);
void th_pop_timer(timer_heap_t *T);
void th_tick(timer_heap_t *T);
int th_empty(timer_heap_t *T);
//private
void _th_percolate_down(timer_heap_t *T, int hole);//下虑
void _th_resize(timer_heap_t *T);//扩容

int th_init(timer_heap_t *T, int capacity){
    assert(T);
    T->array = (th_timer_t **)calloc(capacity, sizeof(th_timer_t));
    assert(T->array);
    T->size = 0;
    T->capacity = capacity;
    return 0;
}

int th_init_array(timer_heap_t *T, th_timer_t **array, int size, int capacity){
    assert(T && (size <= capacity));
    T->array = (th_timer_t **)calloc(capacity, sizeof(th_timer_t));
    assert(T->array);
    T->size = size;
    T->capacity = capacity;

    if (size > 0) {
        int i = 0;
        for (i = 0; i < size; ++i) {
            T->array[i] = array[i];
        }
        for (i = (size - 1) / 2; i >= 0; --i) {
            _th_percolate_down(T, i);
        }
    }
    return 0;
}

void th_destroy(timer_heap_t *T) {
    int i = 0;
    for (i = 0; i < T->size; ++i) {
        free(T->array[i]);
    }
    free(T->array);
}

int th_add_timer(timer_heap_t *T, th_timer_t *timer) {
    assert(T);
    if (!timer)
        return -1;

    if (T->size >= T->capacity)
        _th_resize(T);

    int hole = T->size++;
    int parent = 0;
    for (; hole > 0; hole = parent) {
        parent = (hole - 1) / 2;
        if (T->array[parent]->expire <= timer->expire)
            break;

        T->array[hole] = T->array[parent];
    }
    T->array[hole] = timer;

    return 0;
}

void th_del_timer(timer_heap_t *T, th_timer_t *timer) {
    assert(T);
    if (!timer)
        return;

    /**仅仅将目标定时器的回调函数置空，即所谓的延迟销毁。
       优点：将节省真正删除该定时器造成的开销
       缺点：容易造成堆数组膨胀
    */
   timer->cb_func = NULL;
}

th_timer_t* th_top_timer(timer_heap_t *T){
    assert(T);
    if (th_empty(T))
        return NULL;

    return T->array[0];
}

void th_pop_timer(timer_heap_t *T){
    assert(T);
    if (th_empty(T))
        return ;

    if (T->array[0]) {
        free(T->array[0]);
        T->array[0] = T->array[--T->size];
        _th_percolate_down(T, 0);
    }
}

void th_tick(timer_heap_t *T){
    assert(T);
    th_timer_t *tmp = T->array[0];
    time_t curtime = time(0);

    //循环处理堆中到期的定时器
    while (!th_empty(T)) {
        if (!tmp)
            break;

        if (tmp->expire > curtime)
            break;//堆顶定时器未到期

        if (T->array[0]->cb_func)
           T->array[0]->cb_func(T->array[0]->user_data);

        th_pop_timer(T);
        tmp = T->array[0];
    }
}

int th_empty(timer_heap_t *T){
    assert(T);
    return (T->size == 0) ? 1 : 0;
}

void _th_percolate_down(timer_heap_t *T, int hole){
    th_timer_t *tmp = T->array[hole];
    int child = 0;

    for (; ((hole * 2 + 1) <= (T->size - 1)); hole = child)
    {
        child = hole * 2 + 1;
        if ((child < (T->size - 1)) && 
            (T->array[child]->expire >= T->array[child + 1]->expire)){
            ++child;
        }

        if (T->array[child]->expire >= tmp->expire)
            break;

        T->array[hole] = T->array[child];
    }
    
    T->array[hole] = tmp;
}

void _th_resize(timer_heap_t *T) {
    T->array = (th_timer_t **)realloc(T->array, T->capacity * 2 * sizeof(th_timer_t));
    assert(T->array);
    T->capacity *= 2;
}

///////////////////////////////////////////////////////////////////////////////////

#define BUFFER_SIZE 64
#define TOTAL_TIMER_COUNT 1000 //模拟定时器总数
#define TOTAL_TICK_COUNT 20   //模拟滴答总数

typedef struct _client_data {
    struct sockaddr_in address;
    int sockfd;
    char buf[BUFFER_SIZE];
    th_timer_t *timer;
} client_data_t;

void on_timer(void *user_data) {
    client_data_t *clt = (client_data_t *)user_data;
    printf("on timer: sockfd=%d, expire=%d, now[%d]\n", clt->sockfd, (int)clt->timer->expire, (int)time(0));
}

int main() {
    int i;
    timer_heap_t T;

    srand(time(0));

    //1.
    th_init(&T, 10);

    //2.
    client_data_t datas[TOTAL_TIMER_COUNT];
    for (i = 0; i < sizeof(datas) / sizeof(datas[0]); i++) {
        int timeout = random() % TOTAL_TICK_COUNT;
        th_timer_t *timer = (th_timer_t *)calloc(1, sizeof(th_timer_t));
        if (timer) {
            datas[i].sockfd = i + 1;
            datas[i].timer = timer;
            timer->expire = time(0) + timeout;
            timer->user_data = &datas[i];
            timer->cb_func = on_timer;
            th_add_timer(&T, timer);

            printf("[%d] init: sockfd=%d, expire=%d, timeout=%d\n"
                , i, datas[i].sockfd, (int)timer->expire, timeout);

            // if (i%10 == 0) {
            //     th_del_timer(&T, timer);
            // }
        }
    }

    //3.
    for( i = 0; i < TOTAL_TICK_COUNT * 10; i++) {
        usleep(1000 * 500);
        printf("[%d] tick {\n", i);
        th_tick(&T);
        printf("} size=%d\n", T.size);
    }
    
    //4.
    th_destroy(&T);
    return 0;
}