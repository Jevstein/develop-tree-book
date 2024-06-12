/*
 *  jvt_quick.h 
 *  jvt_quick
 *
 *  Created by Jevstein on 2018/7/27 13:57.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  快速排序思想：
 *      1.从数列中挑出一个元素，称为"基准"（pivot）。
 *      2.重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的
 *        摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处
 *        于数列的中间位置。这个称为分区（partition）操作。
 *      3.递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。
 *
 *      *.复杂度：t=O(nlogn)，[t1=O(nlogn), t2=O(n^2)]; s=O(1)
 *      *.不稳定
 * 		*.in-place
 *
 *  [注]：快排的时间复杂度跟选取基准的方法有关，若默认选择了第一个元素作为基准，
 *        随机性较大。可以在序列中选取开始中间结尾三个数的中位数作为基准，进行优化。
 *
 *  [应用场景]: 希望能够得到一个好性能的平均情况下
 */
#ifndef _JVT_QUICK_H_
#define _JVT_QUICK_H_
#include "../jvt_algorithm.h"

void jvt_quick_sort(jvt_datas_t *datas);			//快速排序
int _partition(jvt_datas_t *datas, int l, int r);	//分区
void _quick_sort(jvt_datas_t *datas, int l, int r);	//快排


void jvt_quick_sort(jvt_datas_t *datas)
{
	_quick_sort(datas, 0, datas->size - 1);
}

void _quick_sort(jvt_datas_t *datas, int l, int r)
{
	if (r <= l)
		return;

	int j = _partition(datas, l, r);//分区
	_quick_sort(datas, l, j - 1);	//左半部分
	_quick_sort(datas, j + 1, r);	//右半部分
}

int _partition(jvt_datas_t *datas, int l, int r)
{
	int i = l, j = r + 1;
	int pivot = datas->data[l];//以第一个数作为‘基准值’

	do
	{
		// 保证：‘左边数值’ < ‘基准值’
		while(datas->data[++i] < pivot) {
			if (i == r)
				break;
		}

		// 保证：‘右边数值’ > ‘基准值’
		while(datas->data[--j] > pivot) {
			if (j == l)
				break;
		}
		
		if (i >= j)
			break;

		// 交换: 此时的i与j分别是
		// data[i] - 左边数起第一个大于‘基准值’的数，
		// data[j] - 右边数起第一个小于‘基准值’的数
		jvt_swap(&datas->data[i], &datas->data[j]);
	} while (1);
	
	// ‘基准值’与右边最后一个小于‘基准值’的数
	jvt_swap(&datas->data[l], &datas->data[j]);

	return j;//返回分区位置
}

#endif//_JVT_QUICK_H_
