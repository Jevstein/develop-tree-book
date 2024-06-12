/*
 *  jvt_heap.h 
 *  jvt_heap
 *
 *  Created by Jevstein on 2018/7/31 13:52.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  堆排序思想：
 *        1.创建最大堆（Build_Max_Heap）：将堆所有数据重新排序
 *        2.堆排序（HeapSort）：移除位在第一个数据的根节点，并做最大堆调整的递归运算
 *
 *        *.复杂度：t=O(nlogn), [O(nlogn), O(nlogn)]; s=O(n)
 *        *.不稳定
 * 		  *.in-place
 *
 *    [堆]:  https://www.cnblogs.com/chengxiao/p/6129630.html
 *        堆是具有以下性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，
 *        称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆.e.g:
 *        1.大顶堆: {50,45,40,20,25,35,30,10,15}    2.小顶堆: {10,20,15,25,50,30,40,35,45}
 *                 50					                     10
 *              /     \					                   /    \
 *             45      40				                  20     15
 *            / \     /  \				                 / \    /  \
 *          20   25  35  30				               25   50 30  40
 *         /  \							              /  \
 *       10   15						            35   45
 *
 *    [应用场景]: 关注最坏情况
 */

#ifndef _JVT_HEAP_H_
#define _JVT_HEAP_H_
#include "../jvt_algorithm.h"

//堆排序
void jvt_head_sort(jvt_datas_t *datas);
void _sink(jvt_datas_t *datas, int n, int k);


void jvt_head_sort(jvt_datas_t *datas)
{
	//因为叶子节点没有子节点，那叶子节点就是一个堆，所以应从非叶子节点开始处理
	//[注]完全二叉树其中一个性质：顶点从1开始计数，最后一个非叶结点是第n/2个结点(n=节点总数)

	//1.建堆(建大顶堆): 首先将n个结点以自顶向下、从左到右的方式从1到n编码, 将其转换成为一棵完全二叉树;
	//    然后从最后一个非叶子结点（结点编号为n/2）开始到根结点（结点编号为1），逐个扫描所有的结点，
	//    根据需要将当前结点向下调整，直到以当前结点为根结点的子树符合堆的特性。
	//    [注]这步操作的复杂度为O(N)
	int len = datas->size;
	for (int k = len / 2; k >= 1; k--)
	{//从最后一个非叶子节点开始，对每一个非叶子节点处理
		_sink(datas, len, k);
	}

	//2.排序(从小到大): 每次删除顶部元素并将顶部元素输出或放入一个新数组中，直到堆为空为止。
	//        最终输出或者存放在新数组中的数就是有序数列。
	while (len > 0)
	{
		// 1.将顶部元素(最大的数)放置队尾
		jvt_swap(&datas->data[0], &datas->data[len - 1]);

		len--;

		// 2.将剩余的数排成堆(大顶堆)
		_sink(datas, len, 1);
	}
}

void _sink(jvt_datas_t *datas, int n, int k)
{
	// k: '当前堆根节点'. 因k从1开始计数, 故:
	// [k - 1]:     '当前堆根节点'
	// j = [2 * k]: 右子节点
	while (2 * k <= n)
	{
		int j = 2 * k;//右子节点
		if ((j < n) && (datas->data[j - 1] < datas->data[j]))
		{//在节点范围内 & (左子节点 < 右子节点)
			j++;//下一个子节点
		}

		// '当前堆根节点' >= '最大子节点': 退出循环
		if (datas->data[k - 1] >= datas->data[j - 1])
			break;

		// '当前堆根节点' < '最大子节点':  交换
		jvt_swap(&datas->data[k - 1], &datas->data[j - 1]);

		//将下一个子节点作为'当前堆根节点'
		k = j;
	}
}

#endif //_JVT_HEAP_H_
