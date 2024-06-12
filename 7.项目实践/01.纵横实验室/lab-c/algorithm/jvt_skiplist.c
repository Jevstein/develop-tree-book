/*
 *  jvt_skiplist.c 
 *  jvt_skiplist
 *
 *  Created by Jevstein on 2019/02/14 10:58.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  跳跃表：
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <time.h>

// #define JVT_MAX_SKLEVLE 6

typedef int KEY_TYPE;

/*
#define JVT_SKNODE_ENTRY(name, type)\
struct name {                       \
    struct type* next;              \
    struct type* down;              \
}                                   \

typedef struct _jvt_sknode
{
    KEY_TYPE key;
    JVT_SKNODE_ENTRY(, _jvt_sknode);
}jvt_sknode_t;

typedef struct _jvt_skiplist
{
    jvt_sknode_t **heads;
    int max_level;
    int level;
}jvt_skiplist_t;
*/

#define JVT_SKNODE_ENTRY(name, type)\
struct name {                       \
    struct type** forwards;         \
    /*int size;*/                   \
}                                   \

typedef struct _jvt_sknode
{
    KEY_TYPE key;
    JVT_SKNODE_ENTRY(, _jvt_sknode);
}jvt_sknode_t;

typedef struct _jvt_skiplist
{
    jvt_sknode_t *nil;  //此处表示+∞
    jvt_sknode_t *head; //头指针不保存key
    // jvt_sknode_t *tail;
    // int count;          //节点个数
    int level;          //当前最大维度, 从1开始
    // int max_level;      //最大维度: log(n)/log(2)
}jvt_skiplist_t;


int jvt_skiplist_init(jvt_skiplist_t *L);
void jvt_skiplist_destroy(jvt_skiplist_t *L);
int jvt_skiplist_insert(jvt_skiplist_t *L, KEY_TYPE key);                   //增
int jvt_skiplist_delete(jvt_skiplist_t *L, KEY_TYPE key);                   //删
int jvt_skiplist_update(jvt_skiplist_t *L, KEY_TYPE src, KEY_TYPE dest);    //改
jvt_sknode_t* jvt_skiplist_search(jvt_skiplist_t *L, KEY_TYPE key);         //查
int jvt_skiplist_random_level();                                            //private
void jvt_skiplist_print(jvt_skiplist_t *L);
int jvt_skiplist_traversal(jvt_skiplist_t *L);


int jvt_skiplist_init(jvt_skiplist_t *L)
{
    assert(L);

    L->head = (jvt_sknode_t *)calloc(1, sizeof(jvt_sknode_t));
    assert(L->head);
    L->head->forwards = (jvt_sknode_t**)calloc(1, sizeof(jvt_sknode_t));
    assert(L->head->forwards);
    L->head->forwards[0] = L->nil;
    L->head->key = -1;

    // L->tail = NULL;
    L->nil = NULL;
    L->level = 0;

    return 0;
}

void jvt_skiplist_destroy(jvt_skiplist_t *L)
{
    if (!L)
        return;

    jvt_sknode_t *p = L->head;
    jvt_sknode_t *q = p;
    while (q) {
        q = q->forwards[0];
        if (q) {
            printf("delete key[%d]!\n", p->key);
            free(p);
            p = q;
        }
    }

    if (p) {
        printf("delete key[%d]!\n", p->key);
        free(p);
    }

    L->nil = NULL;
    L->head = NULL;
    L->level = 0;
}

int jvt_skiplist_insert(jvt_skiplist_t *L, KEY_TYPE key)
{
    assert(L && L->head);

    int i = 0;

    // 1."投硬币": 获得新节点的维度 && 调整头指针的维度
    int level = jvt_skiplist_random_level(L->level);
    if (level > L->level) {
        // if (L->head->forwards[L->level - 1]) {
            L->level = level;
            L->head->forwards = (jvt_sknode_t **)realloc(L->head->forwards, L->level * sizeof(jvt_sknode_t));
            assert(L->head->forwards);
            L->head->forwards[level-1] = L->nil;
        // } else {
        //     level = L->level;
        // }
    }

    // 2.新建一个节点node && 新建一个需要调整位置的节点数组update_nodes[]
    jvt_sknode_t *node = (jvt_sknode_t *)calloc(1, sizeof(jvt_sknode_t));
    assert(node);
    node->forwards = (jvt_sknode_t**)calloc(1, level * sizeof(jvt_sknode_t));
    assert(node->forwards);
    for (i=0; i<level; i++) { node->forwards[i] = L->nil; }
    node->key = key;
    
    jvt_sknode_t **update_nodes;//记录搜索过程中在各层走过的最大的结点位置
    update_nodes = (jvt_sknode_t**)calloc(1, L->level * sizeof(jvt_sknode_t));
    assert(update_nodes);

    // 3.查找待插入的合适位置
    jvt_sknode_t *p = L->head;
    for (i=L->level-1; i>=0; i--) {//从高到低，遍历每个维度
        while (p->forwards[i] && (p->forwards[i]->key < key)) {//同维度往后，找到第一个大于key的节点的前一个节点p
            p = p->forwards[i];
        }

        update_nodes[i] = p;//update_nodes[i]记录了搜索过程中在各层中走过的最大的结点位置
    }

    // 4.在合适位置插入节点node
    for (i=0; i<level; i++) {
        node->forwards[i] = update_nodes[i]->forwards[i];
        update_nodes[i]->forwards[i] = node;
    }

    free(update_nodes);

    return 0;
}

jvt_sknode_t* jvt_skiplist_search(jvt_skiplist_t *L, KEY_TYPE key)
{
    assert(L && L->head);

    jvt_sknode_t *p = L->head;
        
    int i;
    for (i=L->level-1; i>=0; i--) {//从高到低，遍历每个维度
        while (p->forwards[i] && (p->forwards[i]->key < key)) {//同维度往后，找到第一个大于key的节点的前一个节点p
            p = p->forwards[i];
        }
    }

    p = p->forwards[0];//回到0级链，当前p或者空或者指向比搜索关键字小

    return (p && (p->key == key)) ? p : NULL;
}

int jvt_skiplist_delete(jvt_skiplist_t *L, KEY_TYPE key)
{
    // TODO： 其实删除时，应释放前驱多余的空指针节点，调整维度或不定长数组空间，从而提高查找效率；
    assert(L && L->head);

    int i;
    jvt_sknode_t* p = L->head;  //前驱指针
    jvt_sknode_t* q = p;        //待比较指针(当前节点)
    jvt_sknode_t* r = NULL;
    for (i=L->level-1; i>=0; i--) {
        q = p->forwards[i];
        while (q) {
            if (q->key == key) {
                r = q;
                p->forwards[i] = q->forwards[i];
                if ((i == L->level-1) && (p == L->head) && (q->forwards[i] == L->nil))
                    L->level--;//调整维度
                break;
            }

            if (q->key > key)
                break;
            
            p = q;
            q = q->forwards[i];
        }
    }

    if (r) {
        free(r);
        return 0;
    }

    return -1;
}

int jvt_skiplist_update(jvt_skiplist_t *L, KEY_TYPE src, KEY_TYPE dest) {
    //最笨的实现: 先删除，后增加
    if (jvt_skiplist_delete(L, src) == 0) {
        jvt_skiplist_insert(L, dest);
        return 0;
    }

    return -1;
}

int jvt_skiplist_random_level(int level)
{
    // "投硬币"：每次投到正面，都向上跃一个维度
    int k = 1;
    while (k <= level && (rand() % 2 == 0)) {
        k++;
    }

    return k;
}

void jvt_skiplist_print(jvt_skiplist_t *L)
{
    assert(L);

    int i = 0;
    int idx = 0;
    jvt_sknode_t *p = L->head; 

    printf("jvt_skiplist_t: lever=%d ->\n", L->level);

    while (p) {
        printf("idx[%d]: %d, { ", idx++, p->key);
        for (i = 0; i < L->level; i++) {
            if (p->forwards[i] == L->nil)
                break;

            printf("%d ", p->forwards[i]->key);
        }
        
        p = p->forwards[0];
        printf("}\n");
    }
}

#define KEY_SIZE 10

int main () {
    KEY_TYPE keys[] = {23, 45, 56, 32, 41, 90, 21, 43, 87, 76, 100};
    const int key_size = KEY_SIZE;                      //10
    const int count = sizeof(keys) / sizeof(KEY_TYPE);  //11

    int i, j;
    jvt_skiplist_t L;

	srand(time(NULL));//随机种子

    // 初始化
    printf("========= 1.init =========\n");
    printf("data{%d}: ", count);
    for(i = 0; i < count; i++)
    {
        printf("%d ", keys[i]);
    }
    printf("\n");
    jvt_skiplist_init(&L);

    // 增
    printf("\n========= 2.insert =========\n");
    for(i = 0; i < key_size; i++)
    {
        jvt_skiplist_insert(&L, keys[i]);
        // jvt_skiplist_print(&L); printf("\n");
    }
    jvt_skiplist_print(&L);

    // 改
    printf("\n========= 3.update =========\n");
    // for (i = 0; i < count; i++) {
    for (i = 0; i < 2; i++) {
        KEY_TYPE src = keys[i];
        KEY_TYPE dest = (i%2 == 0) ? (src + 10) : (src - 10);

        if (jvt_skiplist_update(&L, src, dest) == 0) {
            printf("update [%d][%d] to [%d] successfully!\n", i, src, dest);
            jvt_skiplist_print(&L);
        } else {
            printf("failed to update [%d][%d] to [%d]\n", i, src, dest);
        }
    }
    
    // 查
    printf("\n========= 4.search =========\n");
    for (i = 0; i < count; i++) {
        jvt_sknode_t *node = jvt_skiplist_search(&L, keys[i]);
        if (node) {
            printf("find [%d][%d]: node[%p] key=%d { ", i, keys[i], node, node->key);
            for (j = 0; j < L.level; j++) {
                if (node->forwards[j] == L.nil)
                    break;
                printf("%d ", node->forwards[j]->key);
            }
            printf("}\n");
        } else {
            printf("failed to find [%d][%d]\n", i, keys[i]);
        }
    }

    // 删
    printf("\n========= 5.delete =========\n");
    for (i = 0; i < count; i++) {
    // for (i = 1; i < 2; i++) {
        if (jvt_skiplist_delete(&L, keys[i]) == 0) {
            printf("deleted [%d][%d] successfully!\n", i, keys[i]);
            jvt_skiplist_print(&L);
        } else {
            printf("failed to delete [%d][%d]!\n", i, keys[i]);
        }
    }

    printf("\n========= 6.the end =========\n");
    jvt_skiplist_destroy(&L);
    jvt_skiplist_print(&L);
    printf("perfect!\n");

    return 0;
}