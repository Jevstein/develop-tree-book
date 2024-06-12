
/*
 *  jvt_codec.c 
 *  jvt_codec
 *
 *  Created by Jevstein on 2020/05/31 9:23.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  内容：crc校验、
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "codec/jvt_crc.h"

void crc_debug()
{
    UINT32 data = 0xAB12;
    UINT32 crc = 0;
    UINT32 data_crc = 0;
    UINT32 crc_ret = 0;
    const UINT32 N = 16;

    //1.发送端
    printf("--------- 1.对将发送的数据进行CRC编码 ---------\n");
    data_crc = jvt_crc_code_16(data, &crc);
    printf("原始数据:%x\n", data);
    printf("多项式信息:%x\n", GX);
    printf("生成CRC校验码:%x\n", crc);
    printf("带CRC的新数据:%x\n", data_crc);

    //2.接收端
    printf("\n--------- 2.对接收到到数据进行CRC校验 ---------\n");
    data = data_crc >> N;
    printf("带CRC的原始信息:%x，实际原始信息: %x\n", data_crc, data);
    crc_ret = jvt_crc_decode_16(data);
    // printf("CRC校验码:%x\n", crc_ret);
    printf("多项式信息:%x\n", GX);
    printf("最后模2除结果:%x\n", crc_ret);

    data_crc <<= N;
    data_crc >>= N;
    printf((data_crc ^ crc_ret) == 0 ? "\n传输成功！\n" : "\n传输错误！\n" );
}


int main () {

    // CRC校验
    printf("========= CRC校验 =========\n");
    crc_debug();

    //

    return 0;
}