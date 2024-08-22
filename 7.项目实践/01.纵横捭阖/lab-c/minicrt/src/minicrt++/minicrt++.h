/*
 *  minicrt++.h 
 *
 *  Created by Jevstein on 2020/01/05 07:56.
 *  Copyright @ 2020year Jevstein. All rights reserved.
 *
 *  Mini CRT(模拟Glibc、MSVC CRT) - c++运行库
 * [简介]：
 *    通常C++运行库独立于c语言运行库，但c++运行库却依赖于c语言运行库。C++运行库仅包含对C++的一些特性
 * 的支持，如：new/delete、STL、异常处理、流（stream）等；不包含诸如：入口函数、堆管理、基本文件操作。
 * 请看不同系统平台提供的c/c++语言运行库：
 *    1）linux下，c运行库：libc.so/libc.a，c++运行库：libstdc++.so/libstdc++.a
 *    2）windows下，c运行库：libcmt.lib/msvcr90.dll, c++运行库：libcpmt.lib/msvcp90.dll
 * 
 */
#ifndef __MINI_CRT_CPP_H__
#define __MINI_CRT_CPP_H__
#include "../minicrt/minicrt.h"

namespace std
{
    class string
    {
    public:
        string();
        explicit string(const char* str);
        string(const string &str);
        ~string();

        string& operator = (const string& str);
        string& operator = (const char* s);
        const char& operator[](size_t idx) const { return buffer_[idx]; }
        char& operator[](size_t idx) { return buffer_[idx]; }
        const char* c_str() const { return buffer_; }
        size_t length() const { return length_; }
        size_t size() const { return length_; }

    private:
        size_t length_;
        char *buffer_;
    };

    class ofstream
    {
    protected:
        ofstream(const ofstream&);
    public:
        enum openmode {in=1, out=2, binary=4, trunc=8};
        ofstream();
       explicit ofstream(const char* filename, ofstream::openmode md = ofstream::out);
        ~ofstream();

        ofstream& operator << (char c);
        ofstream& operator << (int n);
        ofstream& operator << (const char *str);
        ofstream& operator << (ofstream& (*)(ofstream&));

        bool open(const char* filename, ofstream::openmode md = ofstream::out);
        void close();
        ofstream& write(const char* buf, size_t size);

    protected:
        FILE *fp_;
    };
    inline ofstream& endl(ofstream& o) { return o << '\n';}

    class stdout_stream : public ofstream
    {
    public:
        stdout_stream();
    };

    extern stdout_stream cout;
}

#endif//__MINI_CRT_CPP_H__