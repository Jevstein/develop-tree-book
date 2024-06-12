/*
 *  jvt_bubble.h 
 *  jvt_bubble
 *
 *  Created by Jevstein on 2018/7/25 10:04.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  冒泡排序思想:
 *      1.比较相邻的元素。如果第一个比第二个大，就交换他们两个。
 *      2.对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
 *      3.针对所有的元素重复以上的步骤，除了最后一个。
 *      4.持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
 *
 *      *.复杂度：t=O(n^2)，[O(n)，O(n^2)]; s=O(1)
 *      *.稳定
 * 		*.in-place
 */

#ifndef _JVT_BUBBLE_H_
#define _JVT_BUBBLE_H_
#include "../../jvt_algorithm.h"

// 冒泡排序
void jvt_bubble_sort_easy(jvt_datas_t *datas);		//简单
void jvt_bubble_sort_enhanced(jvt_datas_t *datas);	//改进
void jvt_bubble_sort_optimized(jvt_datas_t *datas);	//最优


void jvt_bubble_sort_easy(jvt_datas_t *datas)
{
	/** 简单冒泡: 最重的往下沉*/

	int i, j;
	for (i = 1; i < datas->size; ++i)
	{//1.每个元素都参与比较，比较个数: n-1
		for (j = 0; j < datas->size - i; ++j)
		{//2.剩余的每个元素，都跟相邻元素比较[最重的往下沉]
			if (datas->data[j] > datas->data[j + 1])
			{//3.重的往下沉
				jvt_swap(&datas->data[j], &datas->data[j + 1]);
			}
		}
	}
}

void jvt_bubble_sort_enhanced(jvt_datas_t *datas)
{
	/** 改进冒泡: 最重的往下沉，无交换退出循环 */

	int i, j;
	int is_swap;
	for (i = 1; i < datas->size; ++i)
	{//1.每个元素都参与比较，比较个数: n-1

		is_swap = 0;//交换标记

		for (j = 0; j < datas->size - i; ++j)
		{//2.剩余的每个元素，都跟相邻元素比较[最重的往下沉]
			if (datas->data[j] > datas->data[j + 1])
			{//3.重的往下沉
				jvt_swap(&datas->data[j], &datas->data[j + 1]);
				is_swap = 1;
			}
		}

		if (!is_swap)
			break;//无交换,跳出循环
	}
}

void jvt_bubble_sort_optimized(jvt_datas_t *datas)
{
	/** 最优冒泡: 最重的往下沉，无交换退出循环, 到达无序边界为止*/

	//记录最后一次交换的位置
	int last_swap_idx = 0;

	//无序数列的边界，每次比较只需要比到这里为止
	int unsort_border = datas->size - 1;

	int i, j;
	int is_swap;
	for (i = 1; i < datas->size; ++i)
	{//1.每个元素都参与比较，比较个数: n-1

		is_swap = 0;//交换标记

		for (j = 0; j < unsort_border; ++j)
		{//2.剩余的每个元素，都跟相邻元素比较[最重的往下沉]
			if (datas->data[j] > datas->data[j + 1])
			{//3.重的往下沉
				jvt_swap(&datas->data[j], &datas->data[j + 1]);
				is_swap = 1;
				last_swap_idx = j;
			}
		}

		unsort_border = last_swap_idx;

		if (!is_swap)
			break;//无交换,跳出循环
	}
}

#endif //_JVT_BUBBLE_H_
