#!/usr/bin/python
# -*- coding: utf-8 -*-

#import crawler_estate_anjuke as cea

from crawler_estate_anjuke import CrawlerEstateAnjuke as Anjuke
from crawler_estate_ganji import CrawlerEstateGanji as Ganji

class CrawlerEstate(object):
    def __init__(self):
        self.anjuke = Anjuke()
        self.ganji = Ganji()

    def crawler_estate(self):
        # self.anjuke.get_anjuke()
        self.ganji.get_ganji()