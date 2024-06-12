/*
 *  jvt_selection_direct.h 
 *  jvt_selection_direct
 *
 *  Created by Jevstein on 2018/7/31 10:22.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  直接选择排序思想：
 *         首先在未排序序列中找到最小元素，存放到排序序列的起始位置，然后从剩余
 *     未排序元素中继续寻找最小元素，然后放到已排序序列的末尾。
 *
 *	   复杂度: t=O(n^2),[O(n^2), O(n^2)]; s=O(1)
 *     *.不稳定
 *	   *.in-place
 */

#ifndef _JVT_SELECTION_DIRECT_H_
#define _JVT_SELECTION_DIRECT_H_
#include "../../jvt_algorithm.h"

// 直接选择排序
void jvt_selection_sort_direct(jvt_datas_t *datas);


void jvt_selection_sort_direct(jvt_datas_t *datas)
{
	int min_idx, i, j;

	for (i = 0; i < datas->size; i++)
	{
		min_idx = i;

		// 在未排序序列中，找到最小值
		for (j = i + 1; j < datas->size; j++)
		{
			if (datas->data[j] < datas->data[min_idx])
				min_idx = j;
		}

		// 未排序序列最小值, 与当前值(已排序序列‘最大值’), 交换
		jvt_swap(&datas->data[min_idx], &datas->data[i]);
	}
}

#endif //_JVT_SELECTION_DIRECT_H_
