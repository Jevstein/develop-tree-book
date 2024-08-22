/*
 *  jvt_merge.h 
 *  jvt_merge
 *
 *  Created by Jevstein on 2018/8/2 10:27.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  归并排序思想：
 *        [将两个已经排序的序列合并成一个序列.] 它将数组分割为两个子数组,然后对子数组进行排序,
 *     最终将子数组归并为有序的数组。
 *        1.将一个大小为n个元素的数组分解为各包含n/2个元素的子数组(这个分解的过程会不断进行,直到
 *          子数组元素个数为1)
 *        2.当子数组的元素个数为1时,代表这个子数组已经有序,开始两两归并(将两个个数为1的子数组归
 *          并为一个个数为2的子数组,不断归并,直到所有子数组个数为2,然后继续将两个个数为2的子数组
 *          归并为一个个数为4的子数组….以此类推)
 *        3.不断重复步骤2,直到整个数组有序。
 *
 *        类似洗牌：采用类似洗牌的方式来理解这个过程.想象辅助数组为一个空牌堆,两个子数组为两堆牌
 *     a和b.我们从a堆与b堆中各取出一张牌进行比较,然后将较小的牌放入空牌堆中,不断重复比较直到任一
 *     牌堆为空.最后,再将未空的牌堆全部放入空牌堆中.
 *
 *      *.复杂度：t=O(nlogn)，[t1=O(nlogn), O(nlogn)]; s=O(n)
 *      *.稳定
 * 		*.out-place
 *
 *     [缺陷]: 需要新建一数组，作为辅助空间
 */

#ifndef _JVT_MERGE_H_
#define _JVT_MERGE_H_
#include "../jvt_algorithm.h"

void jvt_merge_sort_top_down(jvt_datas_t *datas);//归并排序, 自顶向下: 递归性质-后进先出
void jvt_merge_sort_bottom_up(jvt_datas_t *datas);//归并排序, 自底向上
void _merge_recursion(jvt_datas_t *datas, jvt_datas_t *aux, int l, int h);
void _merge(jvt_datas_t *datas, jvt_datas_t *aux, int l, int m, int h);


void jvt_merge_sort_top_down(jvt_datas_t *datas)
{
	//自顶向下: 递归-后进先出

	jvt_datas_t aux;
	aux.size = datas->size;
	aux.data = (JVT_KEY_TYPE *)calloc(datas->size, sizeof(JVT_KEY_TYPE));
	assert(aux.data);

	_merge_recursion(datas, &aux, 0, datas->size - 1);

	free(aux.data);
}

void jvt_merge_sort_bottom_up(jvt_datas_t *datas)
{
	//自底向上:

	jvt_datas_t aux;
	aux.size = datas->size;
	aux.data = (JVT_KEY_TYPE *)calloc(datas->size, sizeof(JVT_KEY_TYPE));
	assert(aux.data);

	int k, l;
	for (k = 1; k < datas->size; k = k << 1) 
	{//子序列的最小粒度为1, 子序列规模每次迭代时乘2 => k += k | k *= 2
		for (l = 0; l < datas->size - k; l += k << 1) // => l += k + k
		{
			_merge(datas, &aux, l, l + k - 1, JVT_MIN(l + k + k - 1, datas->size - 1));
		}
	}

	free(aux.data);
}

void _merge_recursion(jvt_datas_t *datas, jvt_datas_t *aux, int l, int h)
{
	if (h <= l)
		return;

	int m = (l + h) >> 1; // == (l + h) / 2
	_merge_recursion(datas, aux, l, m);
	_merge_recursion(datas, aux, m + 1, h);
	_merge(datas, aux, l, m, h);
}

void _merge(jvt_datas_t *datas, jvt_datas_t *aux, int l, int m, int h)
{
	int i = l, j = m + 1;
	int k;

	//1.将‘所有元素’全部拷贝到‘辅助元素’数组中，原数组即作为‘待排序数组’
	for (k = l; k <= h; k++)
	{
		aux->data[k] = datas->data[k];
	}

	//2.‘辅助子序列i’: i∈[l...m]; ‘辅助子序列j’: j∈[m+1...h]
	for (k = l; k <= h; k++)
	{
		if (i > m)       datas->data[k] = aux->data[j++]; //‘辅助子序列i’已用完: 将‘辅助子序列j’中剩余的数据复制到‘待排序数组’中
		else if (j > h)  datas->data[k] = aux->data[i++]; //‘辅助子序列j’已用完: 将‘辅助子序列i’中剩余的数据复制到‘待排序数组’中
		else if (aux->data[i] <= aux->data[j])
		                 datas->data[k] = aux->data[i++]; //从两‘辅助子序列’的首元素开始比较, 最小元素优先复制:‘辅助子序列元素i’
		else             datas->data[k] = aux->data[j++]; //从两‘辅助子序列’的首元素开始比较, 最小元素优先复制:‘辅助子序列元素j’
	}
}

#endif //_JVT_MERGE_H_
