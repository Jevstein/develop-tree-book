/*
 *  jvt_insertion_direct.h 
 *  jvt_insertion_direct
 *
 *  Created by Jevstein on 2018/7/27 13:57.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  直接插入排序思想：
 *          1.从第一个元素开始，该元素可以认为已经被排序
 *          2.取出下一个元素，在已经排序的元素序列中从后向前扫描
 *          3.如果新元素小于该元素（已排序），将该元素移到下一位置
 *          4.重复步骤3，直到找到已排序的元素小于或者等于新元素的位置
 *          5.将新元素插入到该位置后
 *          6.重复步骤2~5
 *
 *          *.复杂度：t=O(n^2)，[t1=O(n), t2=O(n^2)]; s=O(1)
 *          *.稳定
 * 			*.in-place
 *
 *     [应用场景]: 很少的元素或几乎有序的元素
 */
#ifndef _JVT_INSERTION_DIRECT_H_
#define _JVT_INSERTION_DIRECT_H_
#include "../../jvt_algorithm.h"

void jvt_insertion_sort_direct_easy(jvt_datas_t *datas);     //简单直接插入排序
void jvt_insertion_sort_direct_enhanced(jvt_datas_t *datas); //高级直接插入排序

void jvt_insertion_sort_direct_easy(jvt_datas_t *datas)
{
    int i;
	for (i = 1; i < datas->size; i++)
	{//1.每个元素都参与比较，比较个数: n-1
		// ‘0 .. [j - 1]’是已排序序列（第一个元素i=0亦认为是已排序元素）
		for (int j = i; j > 0 && (datas->data[j] < datas->data[j - 1]); j--)
		{//2.在已排序的序列中从后向前扫描，若'新元素[j]'小于'该元素（已排序）[j - 1]，则交换
			jvt_swap(&datas->data[j], &datas->data[j - 1]);
		}
	}
}

void jvt_insertion_sort_direct_enhanced(jvt_datas_t *datas)
{
	/** 改进直接插入: 先将大的元素都向右移动，最后交换'新元素'与'最小的大元素'，旨在减少交换次数*/
	int t;
	int j;
    int i;
	for (i = 1; i < datas->size; i++)
	{//1.每个元素都参与比较，比较个数: n-1
		t = datas->data[i];//记录'新元素t'：待插入元素

		// ‘0 .. [j - 1]’是已排序序列（第一个元素i=0亦认为是已排序元素）
		for (j = i; j > 0 && (t < datas->data[j - 1]); j--)
		{//2.在已排序的序列中从后向前扫描，若'新元素t'小于'该元素（已排序）[j - 1]'，则将'该元素[j - 1]'移到下一位置
			datas->data[j] = datas->data[j - 1];
		}

		datas->data[j] = t;//将'新元素t'放在‘最小的大元素’位置上
	}
}

#endif//_JVT_INSERTION_DIRECT_H_
