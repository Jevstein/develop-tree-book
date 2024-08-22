
/*
 *  jvt_bstree.c 
 *  jvt_bstree
 *
 *  Created by Jevstein on 2019/01/27 19:36.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  二叉排序树：增、删、改、查
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

typedef int KEY_TYPE;

// key与左右子树分离
#define JVT_BSTREE_ENTRY(name, type)\
struct name {                   \
    struct type* left;          \
    struct type* right;         \
}

// 节点
typedef struct _jvt_bstree_node {
    KEY_TYPE data;

    JVT_BSTREE_ENTRY(, _jvt_bstree_node);
    // JVT_BSTREE_ENTRY(Next, bstree_node) next;
} jvt_bstree_node_t;

// 树
typedef struct jvt_bstree {
    jvt_bstree_node_t *root;
} jvt_bstree_t;

jvt_bstree_node_t* jvt_bstree_create_node(KEY_TYPE data);
void jvt_bstree_destroy_node(jvt_bstree_node_t* node);
int jvt_bstree_traversal(jvt_bstree_node_t *node);
int jvt_bstree_insert(jvt_bstree_t *T, KEY_TYPE data);                              //增
int jvt_bstree_delete(jvt_bstree_t *T, KEY_TYPE data);                              //删
int jvt_bstree_update(jvt_bstree_t *T, const KEY_TYPE src, const KEY_TYPE dest);    //改
jvt_bstree_node_t* jvt_bstree_search(jvt_bstree_t *T, KEY_TYPE data);               //查

jvt_bstree_node_t* jvt_bstree_create_node(KEY_TYPE data) {
    jvt_bstree_node_t* node = (jvt_bstree_node_t*)calloc(1, sizeof(jvt_bstree_node_t));
    assert(node);//若连分配内存不成功，其它一定也可能出现异常，此时最适合用断言

    node->data = data;
    node->left = node->right = NULL;
    return node;
}

void jvt_bstree_destroy_node(jvt_bstree_node_t* node){
    if (!node)
        return;

    node->left = node->right = NULL;
    free(node);
}

int jvt_bstree_traversal(jvt_bstree_node_t *node) {
    if (!node)
        return -1;

	// printf("%4d", node->data);//置此：前序遍历
    jvt_bstree_traversal(node->left);
	printf("%4d", node->data);//置此：中序遍历
	jvt_bstree_traversal(node->right);
	// printf("%4d", node->data);//置此：后序遍历

    return 0;
}

int jvt_bstree_insert(jvt_bstree_t *T, KEY_TYPE data){
    assert(T);

    if (!T->root) {
        T->root = jvt_bstree_create_node(data);
        return 0;
    }

    jvt_bstree_node_t* parrent = T->root;
    jvt_bstree_node_t* p = T->root;

    while (p) {
        parrent = p;
        p = (data < p->data) ? p->left : p->right;
    }

    if (data < parrent->data)
        parrent->left = jvt_bstree_create_node(data);
    else 
        parrent->right = jvt_bstree_create_node(data);

    return 0;
}

int jvt_bstree_delete(jvt_bstree_t *T, KEY_TYPE data) {
    assert(T);

    jvt_bstree_node_t* p = T->root;
    jvt_bstree_node_t* temp = NULL;
    jvt_bstree_node_t* parent = NULL;
    jvt_bstree_node_t* node = NULL;

    // 找出待删节点, 和它的父节点
    while(p) {
        if (data == p->data) {
            node = p;
            break;
        }

        parent = p;
        p = (data < p->data) ? p->left : p->right;
    }

    if (!node)
        return -1;

    if (!node->left && !node->right) {//叶子节点
        if (!parent)
            T->root = NULL;
        else {
            if (parent->left == node)
                parent->left = NULL;
            else
                parent->right = NULL;
        }
    } else if (!node->left) {//左子树为空，重接右子树
        if (!parent)
            T->root = node->right;
        else {
            if (parent->left == node)
                parent->left = node->right;
            else
                parent->right = node->right;
        }
    } else if (!node->right) {//右子树为空，重接左子树
        if (!parent)
            T->root = node->left;
        else {
            if (parent->left == node)
                parent->left = node->left;
            else
                parent->right = node->left;
        }
    } else {//左右子树都不为空
        // 此时分为3步：
        // 1.找出右子树中最小节点p（即：右子树最左的子节点）
        // 2.将找出的节点“覆盖”到待删节点位置
        // 3.删除待删节点
        p = node->right;
        while (p) {
            if (!p->left) 
                break;

            temp = p;
            p = p->left;
        }

        p->left = node->left;
        if (temp) {//p的父节点
            temp->left = p->right;
            p->right = node->right;
        }

        if (!parent) {
            T->root = p;
        } else {
            if (parent->left == node)
                parent->left = p;
            else
                parent->right = p;
        }
    }
    
    jvt_bstree_destroy_node(node);

    return 0;
}

int jvt_bstree_update(jvt_bstree_t *T, const KEY_TYPE src, const KEY_TYPE dest) {
    //分为以下步骤:
    // 1.找出值为src的源节点node*，并将值替换为dest
    // 2.赋予新值后检查是否有序，若有序则返回；若无序则移除node*节点，并重新保证二叉排序依然有序
    // 3.将移除并赋了新值的node*节点,重新挂载到树中合适位置

    assert(T);

    if (src == dest)
        return 0;

    jvt_bstree_node_t* parent = NULL;
    jvt_bstree_node_t* node = T->root;
    jvt_bstree_node_t* p = NULL;
    jvt_bstree_node_t* s = NULL;//p的父节点

    //1.查找&赋值
    while (node) {
        if (src == node->data)
            break;

        parent = node;
        node = (src < node->data) ? node->left : node->right;
    }

    if (!node)
        return -1;

    node->data = dest;

    // 2.移除&有序
    if (!node->left && !node->right) {//叶子节点
        if (!parent || (parent && parent->data <= node->data))
            return 0;//有序
        
        if (parent->left == node) parent->left = NULL;
        else                      parent->right = NULL;

    } else if (!node->left) {//无左子树
        if ((!parent || (parent && parent->data <= node->data)) 
            && (node->data <= node->right->data))
            return 0;//有序

        if (!parent) {
            T->root = node->right;
        } else {
            if (parent->left == node) parent->left = node->right;
            else                      parent->right = node->right;
        }

    } else if (!node->right) {//无右子树
        //  if (node->data >= node->left->data)
        //     return 0;//有序

        if (!parent) {
            T->root = node->left;
        } else {
            if (parent->left == node) parent->left = node->left;
            else                      parent->right = node->left;
        }       
    } else {//有左右子树
        // if ((!parent || (parent && parent->data <= node->data)) 
        //     && (node->data >= node->left->data)
        //     && (node->data <= node->right->data))
        //     return 0;//有序

        //2.1 找右子树的最左子节点
        p = node->right;
        while (p) {
            if (!p->left)
                break;

            s = p;
            p = p->left;
        }

        //2.2 将最左子节点调整到node节点位置
        p->left = node->left;
        if (s) {
            s->left = p->right;
            p->right = node->right;
        }

        if (!parent)
            T->root = p;
        else {
            if (parent->left == node) parent->left = p;
            else                      parent->right = p;
        }
    }

    // 3.重新挂载
    node->left = node->right = NULL;
    parent = T->root;
    p = T->root;
    while (p) {
        parent = p;
        p = (node->data < p->data) ? p->left : p->right;
    }

    assert(parent);
    if (node->data < parent->data) parent->left = node;
    else                           parent->right = node;

    return 0;
}

jvt_bstree_node_t* jvt_bstree_search(jvt_bstree_t *T, KEY_TYPE data){
    assert(T);

    jvt_bstree_node_t* node = T->root;
    
    while (node) {
        if (node->data == data)
            return node;

        node = (data < node->data) ? node->left : node->right;   
    }

    return NULL;
}


#define ARRAY_LENGTH 10

int main () {
    KEY_TYPE data_array[ARRAY_LENGTH] = {89, 45, 56, 32, 41, 90, 21, 43, 87, 76};

    jvt_bstree_t T = {0};
    int i = 0;
    int data = 0;
    jvt_bstree_node_t *node = NULL;

    // 增
    printf("========= insert =========\n");
    for (i = 0; i < ARRAY_LENGTH; ++i) {
        printf("insert[%d][%d]: ", i, data_array[i]);
        jvt_bstree_insert(&T, data_array[i]);
        jvt_bstree_traversal(T.root);
        printf("\n");
    }

    // 改
    printf("========= update =========\n");
    for (i = 0; i < ARRAY_LENGTH; ++i) {
        data = (i % 2 == 0) ? data_array[i] + 10 : data_array[i] - 10;
        printf("update[%d][%d->%d]: ", i, data_array[i], data);
        jvt_bstree_update(&T, data_array[i], data);
        jvt_bstree_traversal(T.root);
        printf("\n");
        data_array[i] = data;
    }

    // 查
    printf("========= find =========\n");
    data = 23;
    for (i = -1; i < ARRAY_LENGTH; ++i) {
        if ( i != -1)
            data = data_array[i];

        node = jvt_bstree_search(&T, data);
        if (node)
            printf("find[%d][%d][%p]: data=%d, left=%p, right=%p\n", i, data, node, node->data, node->left, node->right);
        else
            printf("failed to find [%d] from bstree!\n", data);
    }

    // 删
    printf("========= delete =========\n");
    for (i = 0; i < ARRAY_LENGTH; ++i) {
        printf("delete[%d][%d]: ", i, data_array[i]);
        jvt_bstree_delete(&T, data_array[i]);
        jvt_bstree_traversal(T.root);
        printf("\n");
    }

    printf("========= the end =========\n");
    printf("T.root: %p\n", T.root);

    return 0;
}