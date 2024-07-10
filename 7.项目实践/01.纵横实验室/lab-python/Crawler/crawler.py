#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
reload(sys)
# print sys.getdefaultencoding()
sys.setdefaultencoding('utf-8')

# import crawler_estate as ce
from crawler_estate import CrawlerEstate
from main_view import Application

def crawler_app():
     app = Application()
     app.insert(['1', 'pudong', '88888', '1'])
     app.loop()

def main():
    # crawler_app()
    estate = CrawlerEstate()
    estate.crawler_estate()
    print ("the end!")

if __name__ == '__main__':
    main()
