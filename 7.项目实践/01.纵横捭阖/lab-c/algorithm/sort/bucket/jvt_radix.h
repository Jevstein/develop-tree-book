/*
 *  jvt_radix.h 
 *  jvt_radix
 *
 *  Created by Jevstein on 2018/8/3 17:02.
 *  Copyright @ 2018year Jevstein. All rights reserved.
 *
 *  基数("分配式distribution"、"桶子法bin"、"卡片")排序思想：
 *        它是桶排序的扩展--将整数按位数切割成不同的数字，然后按每个位数分别比较。具体做法
 *     是：将所有待比较数值统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，
 *     依次进行一次排序。这样从最低位排序一直到最高位排序完成以后, 数列就变成一个有序序列。
 *
 *     [PS]：
 *        以十进制为例，基数指的是数的位，如个位，十位百位等。而以十六进制为例，0xB2，
 *     就有两个radices（radix的复数）。
 *        最低位优先法Least significant digit(LSD): 短的关键字被认为是小的，排在前面，然后
 *     相同长度的关键字再按词典顺序或数字大小等排序。如{ 1，2，3，4，5，6，7，8，9，10，11 }
 *     或{ b, c, d, e, f, g, h, i, j, ba }。
 *        最高位优先法Most significance digit(MSD): 直接按照字典的顺序进行排序，对于字符串、
 *     单词或者是长度固定的整数排序比较合适。如：{ 1, 10, 2, 3, 4, 5, 6, 7, 8, 9 }和
 *     { b, ba, c, d, e, f, g, h, i, j }。
 *
 *     [Yi]: 简易辅助理解
 *        若元素为整型，k表示元素位数（如：‘95’含个位、十位，则k=2，同理'250'则k=3），arr
 *     表示元素数组; 则将数字0~9分为10个桶bucket，排序伪代码如下：
 *        void shuffle() { 
 *             for (int i=0; i<k; ++i) {//
 *                 for (int j=0; j<arr.size(); ++j) { bucket[arr[j]/pow(10, i) % 10].push(arr[j]); }//入桶: 如第一次，按个位(0~9)入桶
 *                 for (int j=0; j<arr.size(); ++j) { arr[j] = bucket.pop(); }//将桶数据拷贝到数组
 *             }
 *        }
 *
 *     *.复杂度：t=O(n*k), [O(n*k), O(n*k)]; s=O(n+k)
 *     *.稳定
 * 	   *.out-place
 */

#ifndef _JVT_RADIX_H_
#define _JVT_RADIX_H_
#include "../../jvt_algorithm.h"

// 基数排序
void jvt_radix_sort_lsd(jvt_datas_t *datas);//LSD: Least Significant Dight
void jvt_radix_sort_msd(jvt_datas_t *datas);//MSD: Most Significant Dight



#define RDX_DECIMALIST 10	//十进制

typedef struct _rdx_node
{
	JVT_KEY_TYPE value;
	struct _rdx_node * next;
} rdx_node_t;

void jvt_radix_sort_lsd(jvt_datas_t *datas)
{
	// 参考：https://www.cnblogs.com/ECJTUACM-873284962/p/6935506.html#autoid-1-1-0
	// LSD(Least Significant Dight): 从最低有效关键字开始排序

	int max_val = 0;
	JVT_KEY_TYPE *bucket = (JVT_KEY_TYPE *)calloc(datas->size, sizeof(JVT_KEY_TYPE));
	assert(bucket);
	for (int i = 0; i < datas->size; i++)
	{
		max_val = JVT_MAX(datas->data[i], max_val);
	}

	/* max_val: this variable decide the while-loop count
	, if max_val is 3 digits, then we loop through 3 times */
	for (int pos = 1; max_val / pos > 0; pos *= RDX_DECIMALIST)
	{
		/* reset counter */
		int digit_count[RDX_DECIMALIST] = { 0 };

		/* count pos-th digits (keys) */
		for (int i = 0; i < datas->size; i++)
		{
			digit_count[(datas->data[i] / pos) % RDX_DECIMALIST]++; //1).首先从个位数开始，增加计数
		}

		/* accumulated count */
		for (int i = 1; i < RDX_DECIMALIST; i++)
		{
			digit_count[i] += digit_count[i - 1]; //2).后面的计数累计前面的计数
		}

		/* to keep the order, start from back side */
		for (int i = datas->size - 1; i >= 0; i--)
		{
			bucket[--digit_count[(datas->data[i] / pos) % 10]] = datas->data[i];//3).
		}

		/* rearrange the original array using elements in the bucket */
		for (int i = 0; i < datas->size; i++)
		{
			datas->data[i] = bucket[i];
		}
	}

	free(bucket);
}

void jvt_radix_sort_msd(jvt_datas_t *datas)
{

}

#endif //_JVT_RADIX_H_
