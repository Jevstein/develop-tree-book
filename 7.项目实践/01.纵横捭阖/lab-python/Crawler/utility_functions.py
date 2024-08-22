#!/usr/bin/python
# -*- coding: utf-8 -*-

import re

def strip_s(str):
    '''
        去掉空白字符,包括换行符
            \s 表示空白字符：[<空格>\t\r\n\f\v]
    '''
    return re.sub('\s','',str)