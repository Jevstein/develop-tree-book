#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup

class CrawlerEstateAnjuke(object):
    def __init__(self):
        # 'user-agent'：通过浏览器地址栏输入about:version获得
        self.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}
        self.link = 'https://shanghai.anjuke.com/sale/'

    def getHouseInfo(self, link):
        r = requests.get(link, headers = self.headers)

        soup = BeautifulSoup(r.text,'lxml')
        house_list = soup.find_all('li',class_='list-item')

        print (house_list)
        return house_list

        for house in house_list:
            name=house.find('div',class_='house-title').a.text.strip()
            price=house.find('span',class_='price-det').text.strip()
            price_area=house.find('span',class_='unit-price').text.strip()#单位面积
            no_room=house.find('div',class_='details-item').span.text#几室几厅
            area=house.find('div',class_='details-item').contents[3].text
            floor=house.find('div',class_='details-item').contents[5].text
            year=house.find('div',class_='details-item').contents[7].text

            broker=house.find('span',class_='brokername').text
            broker=broker[1:]

            address=house.find('span',class_='comm-address').text.strip()
            address=address.replace(u'\xa0\xa0\n',' ')

            tag_list=house.find_all('span',class_='item-tags')
            tags=[i.text for i in tag_list]

            # print(name,price,price_area,no_room,area,floor,year,broker,address,tags)
            data = u'%s,%s,%s,%s,%s,%s,%s,%s,%s,%s' % (name, price, price_area, no_room, area, floor, year, broker, address, tags)
            print (data)
            # with open('anjuke.txt', 'a') as file_object:
            #    file_object.write(data)

    def get_anjuke(self):
        for i in range(1,2):
            self.link = self.link + '/p' + str(i)
            print('page'+str(i))
            self.getHouseInfo(self.link)