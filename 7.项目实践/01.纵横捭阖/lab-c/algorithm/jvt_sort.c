/*
 *  jvt_sort.c 
 *  jvt_sort
 *
 *  Created by Jevstein on 2019/01/27 11:36.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  排序
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <sys/time.h>

#include "jvt_algorithm.h"
#include "sort/jvt_sort.h"

#define NONE                 "\e[0m"
#define BLACK                "\e[0;30m"
#define L_BLACK              "\e[1;30m"
#define RED                  "\e[0;31m"
#define L_RED                "\e[1;31m"
#define GREEN                "\e[0;32m"
#define L_GREEN              "\e[1;32m"
#define BROWN                "\e[0;33m"
#define YELLOW               "\e[1;33m"
#define BLUE                 "\e[0;34m"
#define L_BLUE               "\e[1;34m"
#define PURPLE               "\e[0;35m"
#define L_PURPLE             "\e[1;35m"
#define CYAN                 "\e[0;36m"
#define L_CYAN               "\e[1;36m"
#define GRAY                 "\e[0;37m"
#define WHITE                "\e[1;37m"

#define BOLD                 "\e[1m"
#define UNDERLINE            "\e[4m"
#define BLINK                "\e[5m"
#define REVERSE              "\e[7m"
#define HIDE                 "\e[8m"
#define CLEAR                "\e[2J"
#define CLRLINE              "\r\e[K" //or "\e[1K\r"


enum ELEVEL {
    L1 = 0,
    L2,
    L3,
    L4,
    L5,
    L6,

    LMAX = 8,
};

char space__[LMAX][32] = {
      ""
    , "  "
    , "    "
    , "      "
    , "        "
    , "          "
    , "            "
    , "              "};

    
int data__[] = { 99, 62, 85, 62, 40, 36, 89, 72, 23, 19, 64, 80, 26, 84, 47, 83, 79, 94, 86, 99,
                 43, 54, 20, 10, 34, 20, 65, 91, 55, 38, 42,  5, 51, 27, 18, 90, 14, 58, 15, 89,
                 77, 77, 68, 54, 12, 66, 88, 91, 59, 83,  9, 21, 98, 45, 06,  3, 88, 39, 95, 96,
               };

typedef struct _jvt_sort {
    jvt_datas_t datas;
    // int levels[MAX_LEVEL];
} jvt_sort_t;

void jvt_sort_init(jvt_sort_t *obj);
void jvt_sort_reset(jvt_sort_t *obj);
void jvt_sort_print(jvt_sort_t *obj, int l);
void jvt_sort_title(jvt_sort_t *obj, const char *title, int l);
void _print_origin_datas();//private

void jvt_sort_init(jvt_sort_t *obj) {
    assert(obj);
    obj->datas.size = sizeof(data__) / sizeof(data__[0]);
    obj->datas.data = (int *)calloc(obj->datas.size, sizeof(data__[0]));
}

void jvt_sort_reset(jvt_sort_t *obj) {
    assert(obj);
    memcpy(obj->datas.data, data__, sizeof(data__));
}

void jvt_sort_print(jvt_sort_t *obj, int level) {
    assert(obj);
    printf("\n%s", space__[level]);

    int i;
    for (i = 0; i < obj->datas.size; i++) {
        printf("%2.2d %s%s", obj->datas.data[i]
        , ((i+1) % 30 == 0 && i != obj->datas.size - 1) ? "\n" : ""
        , ((i+1) % 30 == 0 && i != obj->datas.size - 1) ? space__[level] : "");
    }

    printf("\n");
}

void jvt_sort_title(jvt_sort_t *obj, const char *title, int level) {
    switch (level % 3)
    {
    case 0:     printf(BLUE "%s☆%s\n" NONE, space__[level], title);     break;
    case 1:     printf(GREEN "%s☆%s\n" NONE, space__[level], title);    break;
    case 2:     printf(RED "%s☆%s\n" NONE, space__[level], title);      break;
    default:    printf("%s☆%s\n", space__[level], title);               break;
    }
}

void _print_origin_datas()
{
    int level = L5;
    
    printf(BLUE "---原始数据: \n" NONE);
    printf("    {\n%s", space__[level]);

    int i, len = sizeof(data__) / sizeof(data__[0]);
    for (i = 0; i < len; i++) {
        printf("%2.2d %s%s", data__[i]
        , ((i+1) % 30 == 0 && i != len - 1) ? "\n" : ""
        , ((i+1) % 30 == 0 && i != len - 1) ? space__[level] : "");
    }

    printf("\n    }\n\n");
}
  
#define _JVT_TITLE_(s, o, l) {                          \
    jvt_sort_title(o, s, l);                            \
}

#define _JVT_CALL_(s, func, o, l) {                     \
    printf("%s*%s:\n%s{", space__[l], s, space__[l]);   \
    jvt_sort_reset(o);                                  \
    /*jvt_sort_print(o, l);*/                           \
	struct timeval tv1;                                 \
	struct timeval tv2;                                 \
	gettimeofday(&tv1, NULL);                           \
    func(&(o)->datas);                                  \
	gettimeofday(&tv2, NULL);                           \
	int cost = (tv2.tv_sec - tv1.tv_sec) * 1000000 + (tv2.tv_usec - tv1.tv_usec);\
    jvt_sort_print(o, l + 2);                           \
    printf("%s} cost: %d(us)\n\n", space__[l], cost);   \
}

#define _JVT_CALL_DATA(s, func, o, l) {                 \
    printf("%s*%s:\n%s{", space__[l], s, space__[l]);   \
	struct timeval tv1;                                 \
	struct timeval tv2;                                 \
	gettimeofday(&tv1, NULL);                           \
    func(&(o)->datas);                                  \
	gettimeofday(&tv2, NULL);                           \
	int cost = (tv2.tv_sec - tv1.tv_sec) * 1000000 + (tv2.tv_usec - tv1.tv_usec);\
    jvt_sort_print(o, l + 2);                           \
    printf("%s} cost: %d(us)\n\n", space__[l], cost);   \
}

void _jvt_call_bitmap(const char *title)
{
    int i;

    // 1.initailize
    jvt_sort_t obj;
    obj.datas.size = 60;
    obj.datas.data = (JVT_KEY_TYPE*)malloc(sizeof(JVT_KEY_TYPE) * obj.datas.size);
    for(i = 0; i < obj.datas.size; i++) { obj.datas.data[i] = obj.datas.size - i - 1; }

    // 2.sort
    _JVT_CALL_DATA(title, jvt_bitmap_sort, &obj, L3);
}

int main()
{
    jvt_sort_t obj;
    jvt_sort_init(&obj);

    printf("========= sort =========\n");
    
    _print_origin_datas();

    _JVT_TITLE_("1.快速排序", &obj, L1);
    {
        _JVT_TITLE_("1.快速排序: t=O(n^2), [t1=O(n), t2=O(n^2)]; s=O(1); 不稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.快速排序", jvt_quick_sort, &obj, L3);
        }
    }

    _JVT_TITLE_("2.归并排序", &obj, L1);
    {
        _JVT_TITLE_("1.归并排序: t=O(nlogn)，[t1=O(nlogn), O(nlogn)]; s=O(n); 稳定; out-place", &obj, L2);
        {
            _JVT_CALL_("1.自顶向下", jvt_merge_sort_top_down, &obj, L3);
            _JVT_CALL_("2.自底向上", jvt_merge_sort_bottom_up, &obj, L3);
        }
    }

    _JVT_TITLE_("3.堆排序", &obj, L1);
    {
        _JVT_TITLE_("1.堆排序: t=O(nlogn), [O(nlogn), O(nlogn)]; s=O(n); 不稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.堆排序", jvt_head_sort, &obj, L3);
        }
    }

    _JVT_TITLE_("4.桶排序", &obj, L1);
    {
        _JVT_TITLE_("1.桶排序: t=O(n+k)，[t1=O(n+k), t2=O(n^2)]; s=O(n+k); 稳定; out-place", &obj, L2);
        {
            _JVT_CALL_("1.桶排序", jvt_bucket_sort, &obj, L3);
        }

        _JVT_TITLE_("2.基数排序: t=O(n*k)，[t1=O(n*k), t2=O(n*k)]; s=O(n+k); 稳定; out-place", &obj, L2);
        {
            _JVT_CALL_("1.LSD", jvt_radix_sort_lsd, &obj, L3);
            // _JVT_CALL_("2.MSD", jvt_radix_sort_msd, &obj, L3);
        }

        _JVT_TITLE_("3.计数排序: t=O(n+k), [t1=O(n+k), t2=O(n+k)]; s=O(k); 稳定; out-place", &obj, L2);
        {
            _JVT_CALL_("1.计数排序", jvt_counting_sort, &obj, L3);
        }
    }

    _JVT_TITLE_("5.插入排序", &obj, L1);
    {
        _JVT_TITLE_("1.直接插入: t=O(n^2), [t1=O(n), t2=O(n^2)]; s=O(1); 稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.简单", jvt_insertion_sort_direct_easy, &obj, L3);
            _JVT_CALL_("2.改进", jvt_insertion_sort_direct_enhanced, &obj, L3);
        }

        _JVT_TITLE_("2.折半插入(二分插入)：t=O(n^2), [t1=O(n), t2=O(n^2)]; s=O(1); 稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.折半", jvt_insertion_sort_half, &obj, L3);
        }

        _JVT_TITLE_("3.希尔(shell)排序：t=O(nlgn), [O(n^1.25), O(nlg^2n)]; s=O(1); t根据步长而不同; 稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.希尔(shell)", jvt_insertion_sort_shell, &obj, L3);
        }
    }

    _JVT_TITLE_("6.选择排序", &obj, L1);
    {
        _JVT_TITLE_("1.直接选择排序: t=O(n^2), [t1=O(n^2), t2=O(n^2)]; s=O(1); 不稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.直接选择排序", jvt_selection_sort_direct, &obj, L3);
        }
    }

    _JVT_TITLE_("7.冒泡排序", &obj, L1);
    {
        _JVT_TITLE_("1.冒泡排序: t=O(n^2), [t1=O(n), t2=O(n^2)]; s=O(1); 稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.简单", jvt_bubble_sort_easy, &obj, L3);
            _JVT_CALL_("2.改进", jvt_bubble_sort_enhanced, &obj, L3);
            _JVT_CALL_("3.最优", jvt_bubble_sort_optimized, &obj, L3);
        }

        _JVT_TITLE_("2.鸡尾酒(双冒泡)排序: t=O(n^2), [t1=O(n), t2=O(n^2)]; s=O(1); 稳定; in-place", &obj, L2);
        {
            _JVT_CALL_("1.鸡尾酒", jvt_bubble_sort_cocktail, &obj, L3);
        }
    }

    _JVT_TITLE_("8.位图排序", &obj, L1);
    {
        _JVT_TITLE_("1.位图排序: t=O(n+n); s=O(2); 稳定; out-place", &obj, L2);
        {
            _jvt_call_bitmap("1.位图排序(不允许重复)");
        }
    }

    printf("========= the end =========\n");

    return 0;
}