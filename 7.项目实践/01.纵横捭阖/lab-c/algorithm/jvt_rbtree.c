/*
 *  jvt_rbtree.c 
 *  jvt_rbtree
 *
 *  Created by Jevstein on 2019/01/27 18:49.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  [红黑树]：增、删、改、查
 *  [性质]
 *      1.每个结点是红的或者黑的
 *      2.根结点是黑的
 *      3.每个叶子结点(nil)是黑的
 *      4.若一个节点是红色的，则它的子节点必须是黑色的
 *       【注：一个节点是黑色，但它的子节点不一定是红色】
 *      5. 对每个结点，从该结点到其子孙结点的所有路径上的包含相同数目的黑结点
 *  [特点]
 *      1.根节点的左子树和右子树的高度差不超过2倍
 *        [其实就是采用黑节点来保证的]
 *      2.插入时最坏的情况下要旋转3次
 *      3.红黑树的一条边最多被访问两次
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define JVT_RED     1
#define JVT_BLACK   2

typedef int DATA_TYPE;
typedef int KEY_TYPE;
typedef void* VALUE_TYPE;

#define JVT_RBTREE_ENTRY(NAME, TYPE)    \
    struct NAME {                       \
        unsigned char color;            \
        struct TYPE *parent;            \
        struct TYPE *left;              \
        struct TYPE *right;             \
    }                                   \

#define JVT_RBTREE_DATA(NAME, KEY, VAULE)   \
    struct NAME {                           \
        KEY key;                            \
        VAULE value;                        \
    }

typedef struct _jvt_rbtree_node {
    JVT_RBTREE_DATA(, KEY_TYPE, VALUE_TYPE);
    JVT_RBTREE_ENTRY(, _jvt_rbtree_node);
    // JVT_RBTREE_ENTRY(ready, _jvt_rbtree_node) rbt_ready;
    // JVT_RBTREE_ENTRY(defer, _jvt_rbtree_node) rbt_defer;
    // JVT_RBTREE_ENTRY(sleep, _jvt_rbtree_node) rbt_sleep;
    // JVT_RBTREE_ENTRY(wait, _jvt_rbtree_node) rbt_wait;
} jvt_rbtree_node_t;

typedef struct _jvt_rbtree {
    jvt_rbtree_node_t *root;
    jvt_rbtree_node_t *nil;
} jvt_rbtree_t;


int jvt_rbtree_init(jvt_rbtree_t* T);
int jvt_rbtree_destroy(jvt_rbtree_t* T);
jvt_rbtree_node_t* jvt_rbtree_create_node(const KEY_TYPE key, VALUE_TYPE value, int size);
jvt_rbtree_node_t* jvt_rbtree_create_node_data(const KEY_TYPE key, DATA_TYPE data);
void jvt_rbtree_destroy_node(jvt_rbtree_node_t *node);
int jvt_rbtree_rotate_l(jvt_rbtree_t *T, jvt_rbtree_node_t *node);                   //private
int jvt_rbtree_rotate_r(jvt_rbtree_t *T, jvt_rbtree_node_t *node);                   //private
int jvt_rbtree_fixup_node(jvt_rbtree_t *T, jvt_rbtree_node_t *node);                //private
int jvt_rbtree_insert(jvt_rbtree_t *T, const KEY_TYPE key, const DATA_TYPE data);    //增
int jvt_rbtree_delete(jvt_rbtree_t *T, const KEY_TYPE key);                          //删
int jvt_rbtree_update(jvt_rbtree_t *T, const KEY_TYPE key, const DATA_TYPE data);    //改
jvt_rbtree_node_t* jvt_rbtree_search(jvt_rbtree_t *T, const KEY_TYPE key);           //查
int jvt_rbtree_traversal(jvt_rbtree_node_t *node);


int jvt_rbtree_init(jvt_rbtree_t* T) {
    assert(T);

    T->root = NULL;
    T->nil = NULL;

    return 0;
}

int jvt_rbtree_destroy(jvt_rbtree_t* T) {
    assert(T);

    return 0;
}

jvt_rbtree_node_t* jvt_rbtree_create_node(const KEY_TYPE key, VALUE_TYPE value, int size) {
    jvt_rbtree_node_t *node = (jvt_rbtree_node_t *)calloc(1, sizeof(jvt_rbtree_node_t));
    assert(node);

    node->value = (VALUE_TYPE)(calloc(1, size));
    assert(node->value);

    node->key = key;
    memcpy(node->value, value, size);
    node->color = JVT_RED;
    node->parent = node->left = node->right = NULL;

    return node;
}

jvt_rbtree_node_t* jvt_rbtree_create_node_data(const KEY_TYPE key, DATA_TYPE data) {
    jvt_rbtree_node_t *node = (jvt_rbtree_node_t *)calloc(1, sizeof(jvt_rbtree_node_t));
    assert(node);

    node->value = (VALUE_TYPE)(calloc(1, sizeof(DATA_TYPE)));
    assert(node->value);

    node->key = key;
    *(DATA_TYPE *)node->value = data;
    node->color = JVT_RED;
    node->parent = node->left = node->right = NULL;

    return node;
}

void jvt_rbtree_destroy_node(jvt_rbtree_node_t *node) {
    if (!node)
        return;

    if (node->value) free(node->value);

    node->key = 0;
    node->value = NULL;
    node->color = JVT_RED;
    node->parent = node->left = node->right = NULL;

    free(node);
}

int jvt_rbtree_rotate_l(jvt_rbtree_t *T, jvt_rbtree_node_t *x) {
    assert(T);
    assert(x);

    //无论左旋还是右旋，修改3个节点的方向，共6个指针变量
    //以x为支点左旋:

    jvt_rbtree_node_t *y = x->right;

    // I.y->left
    x->right = y->left;//1.
    if (y->left != T->nil) y->left->parent = x; //2.

    // II.y
    y->parent = x->parent;//3.
    if (x->parent == T->nil)        T->root = y;        //4.
    else if (x == x->parent->left)  x->parent->left = y;
    else                            x->parent->right = y;

    // III.x
    y->left = x;//5.
    x->parent = y;//6.

    return 0;
}

int jvt_rbtree_rotate_r(jvt_rbtree_t *T, jvt_rbtree_node_t *y){
    assert(T);
    assert(y);

    //无论左旋还是右旋，修改3个节点的方向，共6个指针变量
    //以y为支点右旋，与jvt_rbtree_rotate_l对应，调整如下:
    // left --> right
    // right --> left
    // x --> y
    // y --> x

    jvt_rbtree_node_t *x = y->left;

    // I.x->right
    y->left = x->right;//1.
    if (x->right != T->nil) x->right->parent = y;//2.

    // II.x
    x->parent = y->parent;//3.
    if (y->parent == T->nil)        T->root = x;//4. 
    else if (y == y->parent->left)  y->parent->left = x;
    else                            y->parent->right = x;

    // III.y
    x->right = y;//5.
    y->parent = x;//6.

    return 0;
}

int jvt_rbtree_fixup_node(jvt_rbtree_t *T, jvt_rbtree_node_t *node) {
    if (!node)
        return -1;

    jvt_rbtree_node_t *parent = node->parent; //当前节点的"父节点"

    // I.当前节点的“父节点”是黑色: 无需调整
    if (parent == T->nil || parent->color == JVT_BLACK) {//“父节点”是黑色
        if (parent == T->nil) {//重置根节点
             node->color = JVT_BLACK;
             T->root = node;
        }
        return 0;
    }

    // II.当前节点的“父节点”是红色: 调整红黑树
    jvt_rbtree_node_t *uncle = T->nil; //当前节点的"叔节点"
    if (parent->parent)
        uncle = (parent->parent->left == parent) ? parent->parent->right : parent->parent->left;

    if (uncle == T->nil || uncle->color == JVT_BLACK)
    {//“叔节点”是黑色
        if (node == parent->right) 
        {//1.当前节点的"父节点"是红色，"叔节点"是黑色，且当前节点是其"父节点"的"右孩子"
            // (01) 将“父节点”设为“黑色”
            // (02) 将“祖父节点”设为“红色”
            // (03) 以“祖父节点”为支点进行左旋
            parent->color = JVT_BLACK;
            parent->parent->color = JVT_RED;
            jvt_rbtree_rotate_l(T, parent->parent);
        } else {//2.当前节点的"父节点"是红色，"叔节点"是黑色，且当前节点是其"父节点"的"左孩子"
            //(01) 将“父节点”作为“新的当前节点”
            //(02) 以“新的当前节点”为支点进行右旋
            node = parent;
            jvt_rbtree_rotate_r(T, node);

            return jvt_rbtree_fixup_node(T, node);
        }
    } else {//3.当前节点的"父节点"是红色, 且“叔节点”是红色
        // (01) 将“父节点”设为黑色
        // (02) 将“叔节点”设为黑色
        // (03) 将“祖父节点”设为红色
        // (04) 将“祖父节点”设为“当前节点”(红色节点)；即，之后继续对“当前节点”进行操作
        parent->color = JVT_BLACK;
        uncle->color = JVT_BLACK;
        parent->parent->color = JVT_RED;

        return jvt_rbtree_fixup_node(T, parent->parent);
    }

    return 0;
}

int jvt_rbtree_insert(jvt_rbtree_t *T, const KEY_TYPE key, const DATA_TYPE data) {
    assert(T);

    // I.创建新节点
    jvt_rbtree_node_t *node = jvt_rbtree_create_node_data(key, data);
    assert(node);

    jvt_rbtree_node_t *p = T->root;
    jvt_rbtree_node_t *parent = T->nil;//当前节点的"父节点"

    // II.将新节点挂载到树上的合适位置
    while (p != T->nil) {
        if (key == p->key) {
            jvt_rbtree_destroy_node(node);
            return -1;
        }

        parent = p;
        p = (key < p->key) ? p->left : p->right;
    }

    node->parent = parent;

    if (parent == T->nil) {//根节点为空
        T->root = node;
        node->color = JVT_BLACK;
        return 0;
    }

    if (key < parent->key) parent->left = node;
    else                   parent->right = node;

    // III.调整红黑树
    jvt_rbtree_fixup_node(T, node);

    return 0;
}

jvt_rbtree_node_t* jvt_rbtree_search(jvt_rbtree_t *T, const KEY_TYPE key) {
    assert(T);

    jvt_rbtree_node_t* node = T->root;

    while (node) {
        if (key == node->key)
            return node;

        node = (key < node->key) ? node->left : node->right;
    }

    return NULL;
}

int jvt_rbtree_delete(jvt_rbtree_t *T, const KEY_TYPE key) {
    return 0;
}

int jvt_rbtree_traversal(jvt_rbtree_node_t *node) {
    if (!node)
        return -1;

    jvt_rbtree_traversal(node->left);

    // printf("node: [%d][%p][%p][%p][%p][%d][%d]\n", node->color, node, node->parent, node->left, node->right, node->key, *(DATA_TYPE*)node->value);
    // printf("{[%d][%p][%p][%p][%p][%d][%d]} ", node->color, node, node->parent, node->left, node->right, node->key, *(DATA_TYPE*)node->value);
    // printf("[%d][%d] ", node->key, *(DATA_TYPE*)node->value);
    // printf("[%d]%d ", node->key, node->color);
    printf("%d|%d|%d|%d|%d, ", node->key, node->color
    , node->parent ? node->parent->key : 0
    , node->left ? node->left->key : 0
    , node->right ? node->right->key : 0);

    jvt_rbtree_traversal(node->right);

    return 0;
}


#define ARRAY_LENGTH 10

int main () {
    KEY_TYPE data_array[] = {23, 45, 56, 32, 41, 90, 21, 43, 87, 76};

    jvt_rbtree_t T = {0};
    int i = 0;
    // DATA_TYPE data = 0;
    KEY_TYPE key = 0;
    DATA_TYPE value = 0;
    jvt_rbtree_node_t *node = NULL;

    // 初始化
    printf("========= 1.init =========\n");
    jvt_rbtree_init(&T);

    // 增
    printf("\n========= 2.insert =========\n");
    for (i = 0; i < ARRAY_LENGTH; ++i) {
        key = data_array[i];
        value = key * 10;
        printf("insert_%d[%d-%d]: ", i, key, value);
        jvt_rbtree_insert(&T, key, value);
        jvt_rbtree_traversal(T.root);
        printf("[%d]\n", T.root->key);
    }
    // jvt_rbtree_traversal(T.root);
    // printf("\n");

    // 改
    printf("\n========= 3.update =========\n");
    printf("sorry, please wait a moment for me ...\n");
    // for (i = 0; i < ARRAY_LENGTH; ++i) {
    //     data = (i % 2 == 0) ? data_array[i] + 10 : data_array[i] - 10;
    //     printf("update[%d][%d->%d]: ", i, data_array[i], data);
    //     jvt_bstree_update(&T, data_array[i], data);
    //     jvt_bstree_traversal(T.root);
    //     printf("\n");
    //     data_array[i] = data;
    // }

    // 查
    printf("\n========= 4.search =========\n");
    key = 20;
    for (i = -1; i < ARRAY_LENGTH; ++i) {
        if ( i != -1)
            key = data_array[i];

        node = jvt_rbtree_search(&T, key);
        if (node) {
            printf("search key[%d]: [%d-%d] %d|%d|%d|%d\n", key
            , node->key, *(DATA_TYPE*)node->value
            , node->color
            , node->parent ? node->parent->key : 0
            , node->left ? node->left->key : 0
            , node->right ? node->right->key : 0);
        } else {
            printf("failed to search key[%d] from bstree!\n", key);
        }
    }

    // 删
    printf("\n========= 5.delete =========\n");
    printf("sorry, please wait a moment for me ...\n");
    // for (i = 0; i < ARRAY_LENGTH; ++i) {
    //     printf("delete[%d][%d]: ", i, data_array[i]);
    //     jvt_bstree_delete(&T, data_array[i]);
    //     jvt_bstree_traversal(T.root);
    //     printf("\n");
    // }

    printf("\n========= 6.the end =========\n");
    printf("T.root: %p\n", T.root);

    return 0;
}