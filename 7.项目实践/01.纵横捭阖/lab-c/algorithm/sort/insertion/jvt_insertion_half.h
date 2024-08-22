/*
 *  jvt_insertion_half.h 
 *  jvt_insertion_half
 *
 *  Created by Jevstein on 2018/7/28 19:56.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  折半插入(二分插入)排序思想：
 *          1.从第一个元素开始，该元素可以认为已经被排序
 *          2.取出下一个元素
 *          3.在已经排序的元素序列中选择一个中间位置,
 *            将新元素与中间位置元素比较大小, 将高位左移或低位右移
 *          4.重复步骤3，再求中间元素, 直到找到合适位置(即: 用'二分法'查找插入位置)
 *          5.将新元素插入到该位置后
 *          6.重复步骤2~5
 *
 *          *.复杂度：t=O(n^2)，[t1=O(n), t2=O(n^2)]; s=O(1)
 *          *.稳定
 * 			*.in-place
 *          
 *    [缺陷]: 查找效率高，但数组位移效率低
 */

#ifndef _JVT_INSERTION_HALF_H_
#define _JVT_INSERTION_HALF_H_
#include "../../jvt_algorithm.h"

//折半插入排序
void jvt_insertion_sort_half(jvt_datas_t *datas);


void jvt_insertion_sort_half(jvt_datas_t *datas)
{
	int l, h, m, idx;
	JVT_KEY_TYPE t;

	for (int i = 1; i < datas->size; i++)
	{//1.每个元素都参与比较，比较个数: n-1

		l = 0;		//已排序队列头
		h = i - 1;	//已排序队列尾
		t = datas->data[i];//待插入数据

		//2.与已排序的头尾相比较，找到插入位置
		if ((datas->data[l] < t) && (t < datas->data[h]))
		{//2.1.在已排序的范围内：利用'二分法'查找插入位置
			while (l <= h)
			{
				m = (l + h) / 2;
				if (t < datas->data[m])
					h = m - 1;
				else
					l = m + 1;
			}

			idx = l;//最后确定位置idx
		}
		else
		{//2.2.不在已排序的范围内：直接找到插入位置
			if (t >= datas->data[h])
			{//比最后一个元素大，则直接插到最后一个位置(保持位置不变，已排序队列+1)
				//idx = i;
				continue;
			}

			if (t <= datas->data[l])
			{//比第一个元素小, 则直接插到第一个位置
				idx = 0;
			}
		}

		//3.向后移位腾出插入空间
		for (int j = i; j > idx; j--)
		{
			datas->data[j] = datas->data[j-1];
		}

		//4.插入到合适位置
		datas->data[idx] = t;
	}
}

#endif //_JVT_INSERTION_HALF_H_
