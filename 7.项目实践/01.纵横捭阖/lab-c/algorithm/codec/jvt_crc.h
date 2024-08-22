/*
 *  jvt_crc.h 
 *  jvt_crc
 *
 *  Created by Jevstein on 2020/5/29 21:25.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  CRC（循环冗余校验码）：
 *     假设发送信息为16位，生成多项式采用17位的G(x)=0x11021，得到16位的CRC校验码。信息码+校验码共32位
 * 
 *  CRC（循环冗余校验）在线计算：
 *      http://www.ip33.com/crc.html
 *      https://www.lammertbies.nl/comm/info/crc-calculation
 */

#ifndef _JVT_CRC_H_
#define _JVT_CRC_H_

//CRC-CCITT (XModem), e.g:
//G(x) = X^16 + X^12 + X^5 + X^0
//     = 1*X^16 + 0*X^15 + ... + 0*^X13 + 1*X12 + ... + 1*X^5 + ... + X^0
//     = 0001 0001 0000 0010 0001
//     = 0x11021
#define GX 0x11021
typedef unsigned int UINT32;

UINT32 jvt_crc_code_16(const UINT32 data, UINT32 *crc);
UINT32 jvt_crc_decode_16(const UINT32 data);

UINT32 jvt_crc_code_16(const UINT32 data, UINT32 *crc)
{
    UINT32 temp = 0;
    UINT32 ax = 0;
    UINT32 bx = 0;
    UINT32 cx = 15;

    temp = data;        //eg: 0xAB12 = 0000 0000 0000 0000 1010 1011 0001 0010

    temp <<= 16;        //信息左移16位, eg: 0xAB120000 = 1010 1011 0001 0010 0000 0000 0000 0000
    ax = temp >> 15;    //将前17位存在ax中, 准备与多项式GX做异或操作, eg: 0x15624 = 0000 0000 0000 0001 0101 0110 0010 0100
    // temp <<= 17;        //除了前17位后剩下的15位, eg: 0x0 = 0
    temp = 0;

    for (cx = 15; cx > 0; cx--)
    {
        if (((ax >> 16) & 0x1) == 0x1)
            ax ^= GX;

        ax <<= 1;        
        bx = temp >> 31;        
        ax += bx;        
        temp <<= 1;
    }

    if (((ax >> 16) & 0x1) == 0x1)//最后一位的异或操作
        ax ^= GX;

    *crc = ax; //crc 为根据信息内容data和CRC_CCITT的生成多项式GX求出的CRC码。
    
    //附加crc的新数据
    return (data << 16) + (*crc);
}

UINT32 jvt_crc_decode_16(const UINT32 data_crc)
{
    UINT32 data = 0;
    UINT32 ax = 0;
    UINT32 bx = 0;
    UINT32 cx = 0;

    data = data_crc;//data_crc为信息内容
    data <<= 16;
    ax = data >> 15;
    data <<= 17;
    for (cx = 15; cx > 0; cx--)
    {
        if (((ax >> 16) & 0x1) == 0x1)
            ax ^= GX;

        ax <<= 1;
        bx = data >> 31;
        ax += bx;
        data <<= 1;
    }
    if (((ax >> 16) & 0x1) == 0x1)
        ax ^= GX;

    return ax; //ax 加密信息data_crc模2除多项式GX的余数
}

#endif //_JVT_CRC_H_