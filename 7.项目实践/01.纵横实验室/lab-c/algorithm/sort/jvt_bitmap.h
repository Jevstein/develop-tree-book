/*
 *  jvt_bitmap.h 
 *  jvt_bitmap
 *
 *  Created by Jevstein on 2019/03/12 15:35.
 *  Copyright @ 2019year Jevstein. All rights reserved.
 *
 *  [参考]：
 * 		https://blog.csdn.net/qq_18108083/article/details/85063072
 * 		https://www.cnblogs.com/li-daphne/p/5549600.html
 * 
 *  [位图概念]: bitset/bitmap
 *      位图就是用一个bit来标记某个元素对应的值，键值就是该元素。最大的好处就是节省了内存空间。
 * 
 *  [位图排序思想]：
 *      利用位图进行排序，输入的数据是有要求的（数据不能重复，且大致直到数据的范围）。例如我们对
 *  {3,5,2,6,8}进行排序，可以利用一个8bit的二进制向量set[1-8]来表示该集合，如果数据存在那么相
 *  应的set位就是1，否则就是0，最后我set={0,1,1,0,1,1,0,1}。此时可根据set集合输出对应的下标
 *  就是排序结果
 *
 *  [位图应用]: 关注大量数据，内存不足
 *      1.给40亿个不重复的unsinged int的整数(没有排过序)，然后给出一个数，如何快速的判断这个数
 *  是否在那40亿个数中?
 *  分析：因为unsigned int数据的最大范围在40亿左右，40*10^8/(1024*1024*8) = 476.837M，因此
 *  可以申请512M的内存空间，每个bit位表示一个unsigned int。然后读入40亿个数，并设置相应的bit为1，
 *  然后读取要查询的数，查看bit是否为1？
 *      2.给出40亿个unsigned int的整数，如何判断这40亿个数中哪些数是重复的？
 *  分析：也可以申请512M的内存空间，然后读取40亿个整数，并且将相应的bit位设置为1。如果是第一次读取
 *  某个数，那么相应的bit位为0; 如果是第二次读取该数，那么相应的bit位为1;
 * 
 *  [位图操作]:
 *      1.假设有若干不重复的数据，数据的范围是[1-100]，则可申请一个int a[100/(4*8)+1] = int a[4];
 *      2.假设有数据95，那么应该将逻辑下标为95的二进制设置1，这个逻辑位置有两部分组成：字节位置（数组下标）
 *  和位位置。(其中: 假设位数组的类型为int, 则一个int包含的位数=8*4=32)
 *  (1).字节位置 = 数据/32; 位运算: data>>5                    (右移5位)
 *  (2).位的位置 = 数据%32; 位运算: data&0x1f == data&00011111（利用位运算求余数）
 */

#ifndef _JVT_BITMAP_H_
#define _JVT_BITMAP_H_
#include "../jvt_algorithm.h"

#define BTM_SHIFT 5
#define BTM_MASK 0x1f //二进制：0001 1111

//位图排序
void jvt_bitmap_sort(jvt_datas_t *datas);
void _btm_set(int *bit_array, int data);
void _btm_clear(int *bit_array, int data);
int _btm_check(int *bit_array, int data);


void jvt_bitmap_sort(jvt_datas_t *datas)
{
    int *bit_arr = (int *)calloc(datas->size/(sizeof(int) * 8) + 1, sizeof(int));
    assert(bit_arr);

    int i, j;
    for (i = 0; i < datas->size; i++) {
        _btm_set(bit_arr, datas->data[i]);
    }

    for (i = 0, j = 0; i < datas->size; i++) {
        if (_btm_check(bit_arr, i)) {
            datas->data[j++] = i;
        }
    }

    free(bit_arr);
}

void _btm_set(int *bit_array, int data) 
{
    bit_array[data >> BTM_SHIFT] |= 1 << (data & BTM_MASK);
}

void _btm_clear(int *bit_array, int data)
{
    bit_array[data >> BTM_SHIFT] &= ~(1 << (data & BTM_MASK));
}

int _btm_check(int *bit_array, int data)
{
    return bit_array[data >> BTM_SHIFT] & (1 << (data & BTM_MASK));
}


// *C++: std::bitset
//
// using namespace std;
// #define MAX 100
// #define SHIFT 5
// #define MASK 0x1f
// #define DIGITS 32
// #define NUMs 10000

// class A {
// public:///sort 1000000 by decs
//     int data[NUMs];
//     int tmp[NUMs/32+1];
//     void init() {
//         memset(data,0,sizeof(data));
//         for(int i = 0;i<NUMs;i++){
//             data[i] = NUMs-i;
//         }
//     }

//     void test(){
//         cout<<"begining"<<endl;
//         bitset<NUMs+1> b;
//         init();
//         for(int i = 0;i<NUMs;i++){
//             b.set(data[i],1);
//         }

//         for(int i = 0;i<NUMs;i++) {
//             if(b[i]==1) cout<<i<<" ";
//             if(i%10==0) cout<<endl;
//         }

//         cout<<"end"<<endl;
//     }
// };

#endif //_JVT_BITMAP_H_
