/*
 *  iostream.cpp 
 *
 *  Created by Jevstein on 2020/01/12 12:07.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - iostream
 * [简介]：
 *      当然，真正的C++运行库，不仅实现了字符串的一般赋值、取值和重载基本运算符，且拥有强大的模版定制功
 * 能、缓冲，和庞大的继承体系及一系列辅助类。此处简单实现ofstream，且没有继承体系，即没有ios_base、
 * stream、istream、fstream等类似的相关类；流对象没有内置的缓冲功能，即没有stream_buffer类支持；
 * cout作为ofstream的一个实例，它的输出文件是标准输出。
 *      在实际项目的业务开发中，往往也会涉及到序列化的操作，该流的封装有助于理解序列化的细节和流程。
 * 
 */

#include "minicrt++.h"
#ifdef WIN32
#include <Windows.h>
#endif

using namespace std;

stdout_stream cout;

stdout_stream::stdout_stream()
    : ofstream()
{
    fp_ = stdout;
}

ofstream::ofstream()
    : fp_(NULL)
{

}

ofstream::ofstream(const char* filename, ofstream::openmode md/* = ofstream::out*/)
{
    open(filename, md);
}

ofstream::~ofstream()
{
    close();
}

ofstream& ofstream::operator << (char c)
{
    fputc(c, fp_);
    return *this;
}

ofstream& ofstream::operator << (int n)
{
    fprintf(fp_, "%d", n);
    return *this;
}

ofstream& ofstream::operator << (const char *str)
{
    fprintf(fp_, "%s", str);
    return *this;
}

ofstream& ofstream::operator << (ofstream& (*)(ofstream&))
{
    return manip(*this);
}

bool ofstream::open(const char* filename, ofstream::openmode md/* = ofstream::out*/)
{
    char mode[4];

    close();
    switch (md)
    {
    case out | trunc:               strcpy(mode, "w");     break;
    case out | in | trunc:          strcpy(mode, "w+");    break;
    case out | trunc | binary:      strcpy(mode, "wb");    break;
    case out | in | trunc | binary: strcpy(mode, "wb+");   break;
    default:
        return;
    }

    fp_ = fopen(filename, mode);
    return (fp_ != NULL);
}

void ofstream::close()
{
    if (fp_)
    {
        fclose(fp_);
        fp_ = NULL;
    }
}

ofstream& ofstream::write(const char* buf, size_t size)
{
    fwrite(buf, 1, size, fp_);
    return *this;
}