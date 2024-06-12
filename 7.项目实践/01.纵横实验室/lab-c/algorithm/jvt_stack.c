/*
 *  jvt_stack.c 
 *  jvt_stack
 *
 *  Created by Jevstein on 2019/01/27 11:36.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  栈：push、pop、empty
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define ALLOC_SIZE 512
typedef int KEY_TYPE;

typedef struct _jvt_stack{
    KEY_TYPE *base;
    int top;
    int capacity;
} jvt_stack_t;

int jvt_stack_init(jvt_stack_t * s);
int jvt_stack_destroy(jvt_stack_t *s);
int jvt_stack_push(jvt_stack_t *s, const KEY_TYPE data);
int jvt_stack_pop(jvt_stack_t *s, KEY_TYPE *data);
int jvt_stack_empty(jvt_stack_t *s);

int jvt_stack_init(jvt_stack_t *s) {
    assert(s);

    s->base = (KEY_TYPE *)calloc(ALLOC_SIZE, sizeof(KEY_TYPE));
    assert(s->base);

    s->top = 0;
    s->capacity = ALLOC_SIZE;

    return 0;
}

int jvt_stack_destroy(jvt_stack_t *s) {
    assert(s);

    if (s->base)
        free(s->base);

    s->base = NULL;
    s->top = 0;
    s->capacity = 0;

    return 0;
}

int jvt_stack_push(jvt_stack_t *s, const KEY_TYPE data) {
    assert(s);

    if (s->top >= s->capacity) {
        s->base = (KEY_TYPE *)realloc(s->base, (s->capacity + ALLOC_SIZE) * sizeof(KEY_TYPE));
        assert(s->base);

        s->capacity += ALLOC_SIZE;
    }

    s->base[s->top++] = data;

    return 0;
}

int jvt_stack_pop(jvt_stack_t *s, KEY_TYPE *data) {
    assert(s);

    if (s->top <= 0)
        return -1;
        
    *data = s->base[--s->top];

    return 0;
}

int jvt_stack_empty(jvt_stack_t *s) {
    assert(s);
    
    return (s->top == 0) ? 1 : 0;
}

int main()
{
    jvt_stack_t s;
    int count = 10;
    int i = 0;
    KEY_TYPE data = 0;

    printf("========= init =========\n");
    jvt_stack_init(&s);
    printf("stack[%p][%d][%d]::init\n", s.base, s.top, s.capacity);

    printf("========= push =========\n");
    for (i = 0; i < count; ++i) {
        data = (i + 1) * 10;
        jvt_stack_push(&s, data);
        printf("stack[%p][%d][%d]::push[%d]: %d\n", s.base, s.top, s.capacity, i, data);
    }

    printf("========= pop =========\n");
    for (i = 0; !jvt_stack_empty(&s); ++i) {
        jvt_stack_pop(&s, &data);
        printf("stack[%p][%d][%d]::pop[%d]: %d\n", s.base, s.top, s.capacity, i, data);
    }

    printf("========= empty =========\n");
    printf("stack[%p][%d][%d]::empty: %s\n", s.base, s.top, s.capacity, jvt_stack_empty(&s) ? "YES" : "NO");

    printf("========= destroy =========\n");
    jvt_stack_destroy(&s);

    printf("========= the end =========\n");
    printf("stack[%p][%d][%d]::the end!\n", s.base, s.top, s.capacity);

    return 0;
}