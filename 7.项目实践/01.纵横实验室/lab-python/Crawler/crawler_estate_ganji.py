#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import re
from bs4 import BeautifulSoup

'''
#本程序用于抓取赶集网上海各地区二手房房价均值，默认抓取页数为50页。
#使用python语言，requests库抓取网页，re库用于正则抓取。
class Ganji(object):
    def __init__(self):
        # 各地区页面代码
        self.num_area = {
            '1': 'https://wap.ganji.com/sh/fang5/pudongxinqu/o',
            '2': 'https://wap.ganji.com/sh/fang5/minhang/o',
            '3': 'https://wap.ganji.com/sh/fang5/xuhui/o',
            '4': 'https://wap.ganji.com/sh/fang5/changning/o',
            '5': 'https://wap.ganji.com/sh/fang5/putuo/o',
            '6': 'https://wap.ganji.com/sh/fang5/jingan/o',
            '7': 'https://wap.ganji.com/sh/fang5/luwan/o',
            '8': 'https://wap.ganji.com/sh/fang5/huangpu/o',
            '9': 'https://wap.ganji.com/sh/fang5/zhabei/o',
            'a': 'https://wap.ganji.com/sh/fang5/hongkou/o',
            'b': 'https://wap.ganji.com/sh/fang5/yangpu/o',
            'c': 'https://wap.ganji.com/sh/fang5/baoshan/o',
            'd': 'https://wap.ganji.com/sh/fang5/jiading/o',
            'e': 'https://wap.ganji.com/sh/fang5/qingpu/o',
            'f': 'https://wap.ganji.com/sh/fang5/songjiang/o',
            'g': 'https://wap.ganji.com/sh/fang5/jinshan/o',
            'h': 'https://wap.ganji.com/sh/fang5/fengxian/o',
            'i': 'https://wap.ganji.com/sh/fang5/nanhui/o',
            'j': 'https://wap.ganji.com/sh/fang5/chongming/o',
            'k': 'https://wap.ganji.com/sh/fang5/shanghaizhoubian/o'
        }

        # 各地区显示代码
        self.area = {
            '1': '浦东新区',
            '2': '闵行区',
            '3': '徐汇区',
            '4': '长宁区',
            '5': '普陀区',
            '6': '静安区',
            '7': '卢湾区',
            '8': '黄浦区',
            '9': '闸北区',
            'a': '虹口区',
            'b': '杨浦区',
            'c': '宝山区',
            'd': '嘉定区',
            'e': '青浦区',
            'f': '松江区',
            'g': '金山区',
            'h': '奉贤区',
            'i': '南汇区',
            'j': '崇明区',
            'k': '上海周边'
        }

    # 获得房价均值函数
    def get_price(self, numb):
        sp_list = []
        for n in range(1, 50):  # 抓取前50页
            url = self.num_area[numb] + str(n)
            urlpage = requests.get(url)
            urlpage.encoding = 'utf-8'
            urltx = urlpage.text

            size_price = re.findall(u'(\d+)\u33a1.*?(\d+)\u4e07\u5143', urltx, re.S)  # 从页面获取房价和面积
            for sp in size_price:
                sp_list.append(sp)

        priclist = []
        sum_pric = 0
        i = 0
        for sizepri in sp_list:  # 计算平均房价
            pric = round(float(sizepri[1]) / float(sizepri[0]), 2)
            # print pric
            priclist.append(pric)
            sum_pric = sum_pric + pric
            i = i + 1

        if (i == 0):
            print ('no information')
        else:
            print (self.area[numb] + "共获取二手房数量：" + str(i) + "，平均房价为：" + str(round(float(sum_pric) / float(i), 2)) + "万元每平方")

    # 获取输入区域
    def get_area(self):
        print('')
        areanum = str(raw_input("请输入需要查询的区代码,可一次输入多个代码："))
        if str(0) in areanum:  # 输入有0则计算全部区域
            for numbe in (
            '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'):
                get_price(numbe)
        else:  # 输入无0则计算输入区域
            for numb in (
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'):
                if str(numb) in areanum:
                    print numb
                    self.get_price(numb)

    # 获取输入区域
    def get_ganji(self):
        print "本程序用于计算赶集上海二手区房价，单位万/平米"
        print ('每个区对应代码如下：
        0：显示上海所有区单独的平均房价；
        1：浦东新区；
        2：闵行区；
        3：徐汇区；
        4：长宁区；
        5：普陀区；
        6：静安区；
        7：卢湾区；
        8：黄浦区；
        9：闸北区；
        a：虹口区；
        b：杨浦区；
        c：宝山区；
        d：嘉定区；
        e：青浦区；
        f：松江区；
        g：金山区；
        h：奉贤区；
        i：南汇区；
        j：崇明区；
        k：上海周边；
        ')
        self.get_area()
'''

# ###########################################################################################

'''
    url: 
        https://3g.ganji.com/
        http://sh.ganji.com/
    estate:
        'fang5':  二手房
        'fang12': 新房
    area:
        'pudongxinqu': 浦东新区
        'minhang': 闵行区
        'xuhui': 徐汇区
        'changning': 长宁区
        'putuo': 普陀区
        'jingan': 静安区
        'luwan': 卢湾区
        'huangpu': 黄浦区
        'zhabei': 闸北区
        'hongkou': 虹口区
        'yangpu': 杨浦区
        'baoshan': 宝山区
        'jiading': 嘉定区
        'qingpu': 青浦区
        'songjiang': 松江区
        'jinshan': 金山区
        'fengxian': 奉贤区
        'nanhui': 南汇区
        'chongming': 崇明区
        'shanghaizhoubian':上海周边
    price:
        'p1':  100万以下
        'p2':  100 - 150万
        'p3':  150 - 200万
        'p4':  200 - 250万
        'p5':  250 - 300万
        'p6':  300 - 400万
        'p7':  400 - 600万
        'p8':  600 - 1000万
        'p11:  1000万以上
         'b600e1000':  自定义，如 #600 - 1000万
    housetype:
        'h1': 1室
        'h2': 2室
        'h3': 3室
        'h4': 4室
        'h5': 5室
        'h6': 5室以上
'''
def ganji_url(url, estate, area="", price="", housetype=""):
    link = url + estate + area + price + housetype
    print (link)
    return link

class CrawlerEstateGanji(object):
    def __init__(self):
        self.title = 'the estate information form ganji'
        # 'user-agent'：通过浏览器地址栏输入about:version获得
        self.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}

    def getHouseInfo3G(self, link):
        r = requests.get(link, headers = self.headers)
        soup = BeautifulSoup(r.text,'lxml')
        house_list = soup.find_all('div',class_='list-items')
        for house in house_list:
            # print (house)
            # name = house.select('div[class="house-name"]') # 模糊查找
            name = house.find('div',class_='house-name').text.strip()
            lobby = house.find('div',class_='house-info').contents[1].text.strip()
            lobby = re.sub('\s', '', lobby)  # 去掉空白字符，包括换行
            area = house.find('div',class_='house-info').contents[3].text.strip()
            direct = house.find('div',class_='house-info').contents[5].text.strip()
            condition_list = house.find('div',class_='house-condition').find_all('span',class_='border4')
            conditions = ''
            for condition in condition_list:
                conditions += condition.text.strip() + ' '
            price = house.find('div',class_='house-price').text.strip()
            addr = house.find('div',class_='house-addr').find('span', class_='house-area').text.strip()

            data = u'%s, %s, %s, %s, %s, %s, %s' % (name, lobby, area, direct, conditions, price, addr)
            print (data.strip())

    def getHouseInfoPC(self, link):
        r = requests.get(link, headers = self.headers)
        soup = BeautifulSoup(r.text,'lxml')
        house_list = soup.find_all('div',class_='f-list-item ershoufang-list')
        for house in house_list:
            # print (house)
            name = house.find('a', class_='js-title value title-font').text.strip()
            house_info = house.find('dd', class_='dd-item size').text.strip()
            house_info = house_info.replace('\n', ' ')
            feature = house.find('dd', class_='dd-item feature').text.strip()
            feature = feature.replace('\n', ' ')
            price = house.find('dd', class_='dd-item info').text.strip()
            price = price.replace('\n', ' ')
            # print (price)

            # data = u'%s, %s, %s, %s, %s, %s, %s' % (name, lobby, area, direct, conditions, price, addr)
            data = u"'%s' | '%s' | '%s' | '%s'" % (name, house_info, feature, price)
            print (data.strip())
            # break

    def getHouseInfo(self, addr, count):
        if (addr.__contains__(1)):   # pc
            # link = ganji_url('http://sh.ganji.com/', 'fang5/', 'xuhui/', 'b100e300', 'h3')
            link = ganji_url('http://sh.ganji.com/', 'fang5/', 'xuhui/', '', 'h3')
            for idx in range(0, count):
                link = '%s/o%i' % (link, idx)
                self.getHouseInfoPC(link)
        else:
            print ('error, invalid addr: ', addr)

    def get_ganji(self):
        # link = ganji_url('https://3g.ganji.com/', 'fang5/', 'pudongxinqu/', 'b100e300', 'h3')

        # self.getHouseInfo([1,2], 10)
        self.getHouseInfo([1], 1)
        #self.getHouseInfo3G(ganji_url('https://3g.ganji.com/', 'fang5/'))
