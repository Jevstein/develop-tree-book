/*
 *  jvt_bubble_cocktail.h 
 *  jvt_bubble_cocktail
 *
 *  Created by Jevstein on 2018/8/8 9:36.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  鸡尾酒(双冒泡)排序思想:
 *           数组中的数字本是无规律的排放，先找到最小的数字，把他放到第一位，然后
 *       找到最大的数字放到最后一位。然后再找到第二小的数字放到第二位，再找到第二
 *       大的数字放到倒数第二位。以此类推，直到完成排序。
 *
 *       *.复杂度：t=O(n^2)，[O(n)，O(n^2)]; s=O(1)
 *       *.稳定
 * 		 *.in-place 
 */

#ifndef _JVT_BUBBLE_COCKTAIL_H_
#define _JVT_BUBBLE_COCKTAIL_H_
#include "../../jvt_algorithm.h"

// 鸡尾酒(双冒泡)排序
void jvt_bubble_sort_cocktail(jvt_datas_t *datas);


void jvt_bubble_sort_cocktail(jvt_datas_t *datas)
{
	// 分为两半
	int i, j;
	for (i = 0; i < datas->size / 2; i++)
	{
		//1.从前往后: 将最大值排到队尾
		for (j = i; j < datas->size - i - 1; j++)
		{
			if (datas->data[j] > datas->data[j + 1])
			{
				jvt_swap(&datas->data[j], &datas->data[j + 1]);
			}
		}

		//2.从后往前: 将最小值排到队头(注：i之前是排过序的)
		for (j = datas->size - 1 - (i + 1); j > i; j--)
		{
			if (datas->data[j] < datas->data[j - 1])
			{
				jvt_swap(&datas->data[j], &datas->data[j - 1]);
			}
		}
	}
}

#endif //_JVT_BUBBLE_COCKTAIL_H_
