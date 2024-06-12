/*
 *  jvt_timewheel.c 
 *  jvt_timewheel
 *
 *  Created by Jevstein on 2019/05/05 15:48.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  时间轮：见《Linux高性能服务器编程》 游双著
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <assert.h>
#include <time.h>
#include <netinet/in.h>

typedef struct _tw_timer {
    int rotation;   //定时器在循环多少圈后生效
    int time_slot;  //定时器属于时间轮上哪个槽
    struct _tw_timer *next;
    struct _tw_timer *prev;

//public:
    void (*cb_func)(void *);
    void *user_data;
} tw_timer_t;

typedef struct _time_wheel{
    int slot_interval; //一个滴答(tick)的时间, 即: SI
    int slot_count;    //槽的数量, 即: N
    int cur_slot;      //当前槽，即: CS
    tw_timer_t **slots;//槽数组，每个槽为一个定时器链表
} time_wheel_t;

int tw_init(time_wheel_t *T, int SI, int N);
void tw_destroy(time_wheel_t *T);
tw_timer_t* tw_add_timer(time_wheel_t *T, int timeout);
void tw_del_timer(time_wheel_t *T, tw_timer_t *timer);
int tw_tick(time_wheel_t *T);//每一个滴答，时间轮转动一格(槽)

int tw_init(time_wheel_t *T, int SI, int N) {
    assert(T && (SI > 0) && (N > 0));

    T->slot_interval = SI;
    T->slot_count = N;
    T->cur_slot = 0;
    T->slots = (tw_timer_t **)calloc(1, N * sizeof(tw_timer_t));
    assert(T->slots);

    // int i;
    // for (i = 0; i < N; i++) {//calloc已经将头节点赋为NULL了
    //     T->slots[i] = NULL;
    // }

    return 0;
}

void tw_destroy(time_wheel_t *T) {
    if (T->slots) {
        int i;
        for (i = 0; i < T->slot_count; i++) {
            tw_timer_t *tmp = T->slots[i];
            while (tmp) {
                T->slots[i] = tmp->next;
                free(tmp);
                tmp = T->slots[i];
            }
        }
        free(T->slots);
    }
    T->slot_interval = 0;
    T->slot_count = 0;
    T->cur_slot = 0;
}

tw_timer_t* tw_add_timer(time_wheel_t *T, int timeout) {
    assert(T && (T->slot_interval > 0) && (T->slot_count > 0));
    if (timeout < 0)
        return NULL;

    //计算超时时间有多少个滴答数，不满一个滴答则换算成一个滴答
    int ticks = (timeout < T->slot_interval) ? T->slot_interval : timeout / T->slot_interval;
    //计算待插入的定时器在时间轮转动多少圈后被触发
    int rot = ticks / T->slot_count;
    //计算待插入的定时器应该被插入到哪个槽中
    int ts = (T->cur_slot + (ticks % T->slot_count)) / T->slot_count;

    tw_timer_t* timer = (tw_timer_t *)calloc(1, sizeof(tw_timer_t));
    assert(timer);
    timer->rotation = rot;
    timer->time_slot = ts;

    if (T->slots[ts]){
        timer->next = T->slots[ts];
        T->slots[ts]->prev = timer;
        T->slots[ts] = timer;
    } else {
        T->slots[ts] = timer;
    }

    return timer;
}

void tw_del_timer(time_wheel_t *T, tw_timer_t *timer) {
    if(!T || !timer) 
        return;

    int ts = timer->time_slot;
    if (T->slots[ts] == timer) {
        T->slots[ts] = timer->next;
        if (T->slots[ts]) 
            T->slots[ts]->prev = NULL;
    } else {
        timer->prev->next = timer->next;
        if (timer->next)
            timer->next->prev = timer->prev;
    }
    free(timer);
}

int tw_tick(time_wheel_t *T) {
    assert(T);
    int cur_slot = T->cur_slot;

    tw_timer_t *timer = T->slots[cur_slot];
    while(timer) {
        if (timer->rotation > 0 ) {//不在本轮循环中
            // printf("rotation: %d\n", timer->rotation);
            timer->rotation--;
            timer = timer->next;
        } else {
            // call-back function
            if (timer->cb_func)
                timer->cb_func(timer->user_data);

            // delete
            if (timer == T->slots[cur_slot]){
                T->slots[cur_slot] = timer->next;
                if (timer->next)
                    timer->next->prev = NULL;

                free(timer);
                timer = T->slots[cur_slot];
            } else {
                timer->prev->next = timer->next;
                if (timer->next)
                    timer->next->prev = timer->prev;

                tw_timer_t *tmp = timer->next;
                free(timer);
                timer = tmp;
            }
        }
    }
    
    T->cur_slot = (cur_slot + 1) % T->slot_count;

    return cur_slot;
}



////////////////////////////////////////////////////////////////////////////////////////

#define BUFFER_SIZE 64
#define TOTAL_TIMER_COUNT 1000 //模拟定时器总数
#define TOTAL_TICK_COUNT 300   //模拟滴答总数

typedef struct _client_data {
    struct sockaddr_in address;
    int sockfd;
    char buf[BUFFER_SIZE];
    tw_timer_t *timer;
} client_data_t;

void on_timer(void *user_data) {
    client_data_t *clt = (client_data_t *)user_data;
    printf("on timer: sockfd=%d, time_slot=%d\n", clt->sockfd, clt->timer->time_slot);
}

int main() {
    int i;
    time_wheel_t T;

    srand(time(0));

    //1.
    tw_init(&T, 1, 10);

    //2.
    client_data_t datas[TOTAL_TIMER_COUNT];
    for (i = 0; i < sizeof(datas) / sizeof(datas[0]); i++) {
        int timeout = random() % TOTAL_TICK_COUNT;
        tw_timer_t *timer = tw_add_timer(&T, timeout);
        if (timer) {
            datas[i].sockfd = i + 1;
            datas[i].timer = timer;
            timer->user_data = &datas[i];
            timer->cb_func = on_timer;

            printf("[%d] init: sockfd=%d, time_slot=%d, rotation=%d, timeout=%d\n"
                , i, datas[i].sockfd, timer->time_slot, timer->rotation, timeout);

            if (i%10 == 0) {
                tw_del_timer(&T, timer);
            }
        }
    }

    //3.
    for( i = 0; i < TOTAL_TICK_COUNT; i++) {
        usleep(1000 * 10);
        printf("[%d] tick {\n", i);
        int slot = tw_tick(&T);
        printf("} slot=%d\n", slot);
    }
    
    //4.
    tw_destroy(&T);

    return 0;
}