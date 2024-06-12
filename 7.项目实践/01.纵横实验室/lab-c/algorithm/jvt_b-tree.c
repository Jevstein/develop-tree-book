/*
 *  jvt_b-tree.c 
 *  jvt_b-tree
 *
 *  Created by Jevstein on 2019/01/30 6:59.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  [B 树]: B树的原英文名称为B-tree，事实上B-tree就是指的B树,不存在B-树。
 *  [操作]：增、删、改、查
 *  [性质]一颗M阶B树T，满足以下条件:
 *      1.每个结点至多拥有M棵子树
 *      2.根结点至少拥有两棵子树(M>=2)
 *      3.除了根结点以外，其余每个分支结点至少拥有M/2棵子树
 *      4.所有的叶结点都在同一层上
 *      5.有k棵子树的分支结点则存在k-1个关键字，关键字按照递增顺序进行排序
 *      6.关键字数量满足ceil(M/2)-1 <= n <= M-1
 *  [特点]
 *      1. t = B树的最小度数(t>=2)
 *      2. keys = [t - 1, 2 * t - 1]; 
 *         当恰好有 2*t-1个关键字时，称该结点是满的
 *      3. children = [t, 2 * t]
 *      ∴ t越大，B树的高度越小
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define JVT_DEGREE 3        //度
#define JVT_M (2 * DEGREE)  //阶
typedef int KEY_VALUE;

typedef struct _jvt_btree_node {
    KEY_VALUE *keys;
    struct _jvt_btree_node** children;
    int num; //当前key的个数(∴child的个数=num+1)
    int leaf;//是否为叶子节点: 0=否 1=是
} jvt_btree_node_t;

typedef struct _jvt_btree {
    jvt_btree_node_t *root;
    int t;//每个节点所包含的关键字个数有上界和下届, 用t表示B树的最小度数（即内节点中节点最小孩子数目）,t>=2
} jvt_btree_t;


int jvt_btree_init(jvt_btree_t *T, int t);
void jvt_btree_destroy(jvt_btree_t *T);
jvt_btree_node_t* jvt_btree_create_node(int t, int leaf);                           //private
void jvt_btree_destroy_node(jvt_btree_node_t *node);                                //private
void jvt_btree_split(jvt_btree_t *T, jvt_btree_node_t *x, int i);                   //private
void jvt_btree_merge(jvt_btree_t *T, jvt_btree_node_t *x, int i);                   //private
void jvt_btree_insert_nonfull(jvt_btree_t *T, jvt_btree_node_t *x, KEY_VALUE k);    //private
int jvt_btree_binary_search(jvt_btree_node_t *node, int l, int h, KEY_VALUE k);     //private
void jvt_btree_delete_key(jvt_btree_t *T, jvt_btree_node_t *node, KEY_VALUE key);   //private
int jvt_btree_insert(jvt_btree_t *T, KEY_VALUE key);                                //增
int jvt_btree_delete(jvt_btree_t *T, KEY_VALUE key);                                //删
int jvt_btree_update(jvt_btree_t *T, KEY_VALUE src, KEY_VALUE dest);                //改
jvt_btree_node_t* jvt_btree_search(jvt_btree_t *T, KEY_VALUE key, int *idx, int *h);//查
void jvt_btree_print(jvt_btree_t *T, jvt_btree_node_t *node, int layer);

int jvt_btree_init(jvt_btree_t *T, int t) {
    assert(T);

    T->t = t;
	T->root = jvt_btree_create_node(t, 1);
    assert(T->root);

    return 0;
}

void jvt_btree_destroy(jvt_btree_t *T) {

}

jvt_btree_node_t* jvt_btree_create_node(int t, int leaf) {
    jvt_btree_node_t *node = (jvt_btree_node_t *)calloc(1, sizeof(jvt_btree_node_t));
    assert(node);

	node->leaf = leaf;
	node->keys = (KEY_VALUE *)calloc(1, (2 * t - 1) * sizeof(KEY_VALUE));
	node->children = (jvt_btree_node_t **)calloc(1, (2 * t) * sizeof(jvt_btree_node_t));
	node->num = 0;

    return node;
}

void jvt_btree_destroy_node(jvt_btree_node_t *node){
    if (!node)
        return;

    if (node->keys) free(node->keys);
    if (node->children) free(node->children);

    node->leaf = 0;
    node->keys = NULL;
    node->children = NULL;
    node->num = 0;

    free(node);
}

void jvt_btree_split(jvt_btree_t *T, jvt_btree_node_t *x, int i) {
    //画图理解:
    //x = create出来的新子根节点
    //y = 待分裂的节点作为新左子节点
    //z = create出来的新右子节点

    int j = 0;
    int t = T->t;

    jvt_btree_node_t *y = x->children[i];
    jvt_btree_node_t *z = jvt_btree_create_node(t, y->leaf);

    // z:
	z->num = t - 1;
    for (j = 0; j < t - 1; j++) {
        z->keys[j] = y->keys[j+t];
    }
    if (y->leaf == 0) {
        for (j = 0; j < t; j++) {
            z->children[j] = y->children[j+t];
        }
    }

    // y:
    y->num = t - 1;

    // x:
    for (j = x->num; j >= i + 1; j--) {
        x->children[j+1] = x->children[j];
    }
    x->children[i + 1] = z;
    for (j = x->num - 1; j >= i; j--) {
        x->keys[j+1] = x->keys[j];
    }
    x->keys[i] = y->keys[t-1];
    x->num += 1;
}

void jvt_btree_merge(jvt_btree_t *T, jvt_btree_node_t *node, int i) {
    //{child[i], key[i], child[i+1]} 

	jvt_btree_node_t *left = node->children[i];
	jvt_btree_node_t *right = node->children[i+1];

	int j = 0;

	// merge
	left->keys[T->t-1] = node->keys[i];
	for (j = 0; j < T->t-1; j ++) {
		left->keys[T->t+j] = right->keys[j];
	}
	if (!left->leaf) {
		for (j = 0;j < T->t;j ++) {
			left->children[T->t+j] = right->children[j];
		}
	}
	left->num += T->t;

	// destroy right
	jvt_btree_destroy_node(right);

	// node 
	for (j = i+1;j < node->num; j ++) {
		node->keys[j-1] = node->keys[j];
		node->children[j] = node->children[j+1];
	}
	node->children[j+1] = NULL;
	node->num -= 1;

	if (node->num == 0) {
		T->root = left;
		jvt_btree_destroy_node(node);
	}
}

void jvt_btree_insert_nonfull(jvt_btree_t *T, jvt_btree_node_t *x, KEY_VALUE k) {
    int i = x->num - 1;

    if (x->leaf == 1) {
        while ((i >= 0) && (x->keys[i] > k)) {
            x->keys[i+1] = x->keys[i];
            i--;
        }

        x->keys[i+1] = k;
        x->num += 1;
    } else {
        while ((i >= 0) && (x->keys[i] > k))
            i--;

        if (x->children[i+1]->num == (2 * (T->t) - 1)) {
            jvt_btree_split(T, x, i+1);
            if (k > x->keys[i+1])
                i++;
        }

        jvt_btree_insert_nonfull(T, x->children[i+1], k);
    }
}

int jvt_btree_binary_search(jvt_btree_node_t *node, int l, int h, KEY_VALUE k) {
    //二分查找：若找到，返回正确位置；否则返回比k小的位置
    if ((l > h) || (l < 0) || (h < 0))
        return -1;

    int m;
    while(l <= h) {
        m = (l + h) / 2;
        if (k == node->keys[m])      return m;
        else if (k > node->keys[m])  l = m + 1;
        else                         h = m - 1;
    }
    
    return (m > l) ? m : l;
}

void jvt_btree_delete_key(jvt_btree_t *T, jvt_btree_node_t *node, KEY_VALUE key) {
    if (!node)
        return ;

	int idx = 0, i;

    // 找出key的位置
	while ((idx < node->num) && (key > node->keys[idx])) {
		idx++;
	}

	if ((idx < node->num) && (key == node->keys[idx])) {//找准了key
		if (node->leaf) {
			for (i = idx; i < node->num-1; i ++) {
				node->keys[i] = node->keys[i+1];
			}

			node->keys[node->num - 1] = 0;
			node->num--;
			
			if (node->num == 0) { //root
				free(node);
				T->root = NULL;
			}

			return ;
		} else if (node->children[idx]->num >= T->t) {
			jvt_btree_node_t *left = node->children[idx];
			node->keys[idx] = left->keys[left->num - 1];

			jvt_btree_delete_key(T, left, left->keys[left->num - 1]);			
		} else if (node->children[idx+1]->num >= T->t) {
			jvt_btree_node_t *right = node->children[idx+1];
			node->keys[idx] = right->keys[0];

			jvt_btree_delete_key(T, right, right->keys[0]);
		} else {
			jvt_btree_merge(T, node, idx);
			jvt_btree_delete_key(T, node->children[idx], key);
		}
	} else {//未找准key
		jvt_btree_node_t *child = node->children[idx];
		if (child == NULL) {
			printf("error: cannot delete key[%d]\n", key);
			return ;
		}

		if (child->num == T->t - 1) {
			jvt_btree_node_t *left = NULL;
			jvt_btree_node_t *right = NULL;
			if (idx - 1 >= 0)
				left = node->children[idx-1];
			if (idx + 1 <= node->num) 
				right = node->children[idx+1];

			if ((left && left->num >= T->t) || (right && right->num >= T->t)) {
				int richR = 0;
				if (right) richR = 1;
				if (left && right) richR = (right->num > left->num) ? 1 : 0;

				if (right && right->num >= T->t && richR) { //borrow from next
					child->keys[child->num] = node->keys[idx];
					child->children[child->num+1] = right->children[0];
					child->num ++;

					node->keys[idx] = right->keys[0];
					for (i = 0;i < right->num - 1;i ++) {
						right->keys[i] = right->keys[i+1];
						right->children[i] = right->children[i+1];
					}

					right->keys[right->num-1] = 0;
					right->children[right->num-1] = right->children[right->num];
					right->children[right->num] = NULL;
					right->num --;
					
				} else { //borrow from prev
					for (i = child->num;i > 0;i --) {
						child->keys[i] = child->keys[i-1];
						child->children[i+1] = child->children[i];
					}

					child->children[1] = child->children[0];
					child->children[0] = left->children[left->num];
					child->keys[0] = node->keys[idx-1];
					child->num ++;

					left->keys[left->num-1] = 0;
					left->children[left->num] = NULL;
					left->num --;
				}

			} else if ((!left || (left->num == T->t - 1))
				&& (!right || (right->num == T->t - 1))) {

				if (left && left->num == T->t - 1) {
					jvt_btree_merge(T, node, idx-1);					
					child = left;
				} else if (right && right->num == T->t - 1) {
					jvt_btree_merge(T, node, idx);
				}
			}
		}

		jvt_btree_delete_key(T, child, key);
	}
}

int jvt_btree_insert(jvt_btree_t *T, KEY_VALUE key) {
    assert(T);
    
    jvt_btree_node_t *p = T->root;
    if (p->num == (2 * T->t - 1)) {
        jvt_btree_node_t *node = jvt_btree_create_node(T->t, 0);
        T->root = node;

        node->children[0] = p;
        
		jvt_btree_split(T, node, 0);

		int i = 0;
		if (node->keys[0] < key)
            i++;
		jvt_btree_insert_nonfull(T, node->children[i], key);
    } else {
        jvt_btree_insert_nonfull(T, p, key);
    }

    return 0;
}

jvt_btree_node_t* jvt_btree_search(jvt_btree_t *T, KEY_VALUE key, int *idx, int *h) {
    assert(T);

    if (h) *h = -1;

    int i;
    jvt_btree_node_t *p = T->root;
    while(p) {
        if (h) (*h)++;

        // 1.首尾刚好命中
        if (key == p->keys[0])          { *idx = 0; break; }
        if (key == p->keys[p->num - 1]) { *idx = p->num - 1; break; }

        // 2.左边查找
        if (key < p->keys[0]) {
            if (p->leaf == 1)
                return NULL;
            p = p->children[0];
            continue;
        }

        // 3.右边查找
        if (key > p->keys[p->num - 1]) {
            if (p->leaf == 1)
                return NULL;
            p = p->children[p->num];
            continue;
        }

        // 4.中间：二分查找
        i = jvt_btree_binary_search(p, 0, p->num - 1, key);
        if (i == -1) {
            printf("error: exception for jvt_btree_binary_search!");
            return NULL;
        }
        if (key == p->keys[i]) {
            *idx = i;
            break;
        }
        p = p->children[i];
    }
    
    return p;
}

int jvt_btree_delete(jvt_btree_t *T, KEY_VALUE key) {
	if (!T->root) return -1;

	jvt_btree_delete_key(T, T->root, key);
	return 0;
}

void jvt_btree_print(jvt_btree_t *T, jvt_btree_node_t *node, int layer) {
    assert(T);

    jvt_btree_node_t *p = node;
    if (!p) {
        // printf("the tree is empty\n");
        return;
    }

    printf("node[%p][%d]: num=%d, leaf=%d, keys={ ", node, layer, p->num, p->leaf);

    int i = 0;
    for (i = 0; i < p->num; i++) {
        printf("%c ", p->keys[i]);
    }
    printf("}\n");

    layer++;

    for (i = 0; i < p->num + 1; i++) {
        if(p->children[i]) {
            jvt_btree_print(T, p->children[i], layer);
        }
    }
}


#define KEY_SIZE 26

int main () {
    int i;
    int idx;
    int layer;
    jvt_btree_t T;
    char keys[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ,g";
    const int key_size = KEY_SIZE;
    const int count = sizeof(keys) / sizeof(char) - 1;

	// srand(48);

    // 初始化
    printf("========= 1.init =========\n");
    jvt_btree_init(&T, 3);
    printf("keys: %s\n", keys);

    printf("\n========= 2.insert =========\n");
    printf("insert[%d]: ", key_size);
    for (i = 0; i < key_size; i++) {
        printf("%c-%d", keys[i], keys[i]);
        jvt_btree_insert(&T, keys[i]);
    }
    printf("\n");
    jvt_btree_print(&T, T.root, 0);

    printf("\n========= 3.update =========\n");
    printf("sorry, please wait a moment for me ...\n");

    printf("\n========= 4.search =========\n");
    for (i = 0; i < count; i++) {
        jvt_btree_node_t *node = jvt_btree_search(&T, keys[i], &idx, &layer);
        if (node) {
            printf("find [%d]['%c']: node[%p][%d] num=%d, leaf=%d, idx=%d, value='%c'\n"
                , i, keys[i], node, layer, node->num, node->leaf, idx, node->keys[idx]);
        } else {
            printf("failed to find ['%c']\n", keys[i]);
        }
    }
    
    printf("\n========= 5.delete =========\n");
    for (i = 0; i < KEY_SIZE; i++) {
        printf("delete [%i]['%c']--> \n", i, keys[i]);
        jvt_btree_delete(&T, keys[i]);
        jvt_btree_print(&T, T.root, 0);
    }

    printf("\n========= 6.the end =========\n");
    // jvt_btree_destroy(&T);
    printf("T.root: %p, t=%d\n", T.root, T.t);

    return 0;
}