/*
 *  jvt_counting.h 
 *  jvt_counting
 *
 *  Created by Jevstein on 2018/8/3 11:44.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  计数排序思想：
 *        一组数在排序之前先统计这组数中其他数小于这个数的个数，则可以确定这个数的位置。
 *     例如要排序的数为:{7,4,2,1,5,3,1,5}则比7小的有7个数，所以7应该在排序好的数列的第
 *     八位，同理3在第四位，对于重复的数字，1在1位和2位（暂且认为第一个1比第二个1小），
 *     5和1一样位于6位和7位。
 *
 *        *假设输入的线性表L的长度为n，L=L1,L2,..,Ln；线性表的元素属于有限偏序集S，|S|=k且
 *     k=O(n)，S={S1,S2,..Sk}；则计数排序可以描述如下：
 *        1、扫描整个集合S，对每一个Si∈S，找到在线性表L中小于等于Si的元素的个数T(Si)；
 *        2、扫描整个线性表L，对L中的每一个元素Li，将Li放在输出线性表的第T(Li)个位置上，
 *     并将T(Li)减1。
 *
 *        "当数据表长度为n，已知数据表中数据的范围有限，比如在范围0−k之间，而k又比n小许多，
 *     则可以通过统计每一个范围点上的数据频次来实现计数排序。但计数排序局限性比较大，只限
 *     于对整数进行排序。计数排序是消耗空间复杂度来获取快捷的排序方法，其空间复杂度为O（K）
 *     同理K为要排序的最大值。"
 *
 *     *.复杂度：t=O(n+k), [t1=O(n+k), t2=O(n+k)]; s=O(k)
 *     *.稳定
 * 	   *.out-place
 *
 *     [缺陷]: 1.需要新建一数组，作为辅助空间; 
 *             2.要求数据的范围有限，如: 范围[0−k],且k远远小于n (n=数据表长度)
 *             3.要求数据为整数
 */

#ifndef _JVT_COUNTING_H_
#define _JVT_COUNTING_H_
#include "../../jvt_algorithm.h"

//计数排序
void jvt_counting_sort(jvt_datas_t *datas);


void jvt_counting_sort(jvt_datas_t *datas)
{
	// 1.找出最大值和最小值
	JVT_KEY_TYPE v_min = datas->data[0];
	JVT_KEY_TYPE v_max = datas->data[0];
	for (int i = 1; i < datas->size; i++)
	{
		v_min = JVT_MIN(datas->data[i], v_min);
		v_max = JVT_MAX(datas->data[i], v_max);
	}

	// 2.创建桶：并初始化
	const int k = v_max - v_min + 1;
	int *bucket = (int *)calloc(k, sizeof(int));
	for (int i = 0; i < k; i++)
	{
		bucket[i] = 0;
	}

	// 3.桶计数: 桶中元素(存储位置: 与最小值的距离)记录‘待排数据’的个数
	for (int i = 0; i < datas->size; i++)
	{
		bucket[datas->data[i] - v_min]++;
	}

	// 4.桶中计数对应数据复制到‘待排数据数组’
	int idx = 0;
	for (JVT_KEY_TYPE v = v_min; v <= v_max; v++)
	{//遍历‘最小~最大’所有数据
		for (int j = 0; j < bucket[v - v_min]; j++)
		{//对应桶中元素有计数，则复制; 有多少计数则复制多少
			datas->data[idx++] = v;
		}
	}

	free(bucket);
}

#endif //_JVT_COUNTING_H_
