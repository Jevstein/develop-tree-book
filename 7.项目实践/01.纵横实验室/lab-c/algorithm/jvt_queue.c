/*
 *  jvt_queue.c 
 *  jvt_queue
 *
 *  Created by Jevstein on 2019/01/27 12:50.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  队列：push、pop、empty
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

typedef int KEY_TYPE;

typedef struct _jvt_queue_node {
    KEY_TYPE data;
    struct _jvt_queue_node *next;
} jvt_queue_node_t;

typedef struct _jvt_queue {
    jvt_queue_node_t *front;
    jvt_queue_node_t *tail;
    int size;
} jvt_queue_t;

int jvt_queue_init(jvt_queue_t *q);
int jvt_queue_destroy(jvt_queue_t *q);
int jvt_queue_push(jvt_queue_t *q, const KEY_TYPE data);
int jvt_queue_pop(jvt_queue_t *q, KEY_TYPE *data);
int jvt_queue_empty(jvt_queue_t *q);
int jvt_queue_size(jvt_queue_t *q);

int jvt_queue_init(jvt_queue_t *q) {
    assert(q);

    q->front = q->tail = NULL;
    q->size = 0;

    return 0;
}

int jvt_queue_destroy(jvt_queue_t *q) {
    assert(q);

    jvt_queue_node_t *iter = q->front;
    jvt_queue_node_t *next = NULL;

    while (iter) {
        next = iter->next;
        free(iter);
        iter = next;
    }

    q->front = q->tail = NULL;
    q->size = 0;

    return 0;
}

int jvt_queue_push(jvt_queue_t *q, const KEY_TYPE data) {
    assert(q);

    jvt_queue_node_t *node = (jvt_queue_node_t *)calloc(1, sizeof(KEY_TYPE));
    assert(node);

    node->data = data;
    node->next = NULL;

    if (q->tail) {
        q->tail->next = node;
        q->tail = node;
    } else {
        q->tail = q->front = node;
    }

    q->size++;

    return 0;
}

int jvt_queue_pop(jvt_queue_t *q, KEY_TYPE *data) {
    assert(q);

    if (!q->front)
        return -1;

    if (q->front == q->tail)
        q->tail = NULL;

	jvt_queue_node_t *next = q->front->next;
    *data = q->front->data;
    free(q->front);
    q->front = next;
    q->size--;

    return 0;
}

int jvt_queue_empty(jvt_queue_t *q) {
    assert(q);

    return q->front ? 0 : 1;
}

int jvt_queue_size(jvt_queue_t *q) {
    assert(q);

    return q->size;
}

int main()
{
    jvt_queue_t q;
    int count = 10;
    int i = 0;
    KEY_TYPE data = 0;

    printf("========= init =========\n");
    jvt_queue_init(&q);
    printf("queue[%p][%p][%d]::init\n", q.front, q.tail, q.size);

    printf("========= push =========\n");
    for (i = 0; i < count; ++i) {
        data = (i + 1) * 10;
        jvt_queue_push(&q, data);
        printf("queue[%p][%p][%d]::push[%d]: %d\n", q.front, q.tail, q.size, i, data);
    }

    printf("========= pop =========\n");
    for (i = 0; !jvt_queue_empty(&q); ++i) {
        jvt_queue_pop(&q, &data);
        printf("queue[%p][%p][%d]::pop[%d]: %d\n", q.front, q.tail, q.size, i, data);
    }

    printf("========= empty =========\n");
    printf("queue[%p][%p][%d]::empty: %s\n", q.front, q.tail, q.size, jvt_queue_empty(&q) ? "YES" : "NO");

    printf("========= destroy =========\n");
    jvt_queue_destroy(&q);

    printf("========= the end =========\n");
    printf("queue[%p][%p][%d]::the end!\n", q.front, q.tail, q.size);

    return 0;
}