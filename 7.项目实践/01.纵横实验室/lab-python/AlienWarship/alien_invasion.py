#!/usr/bin/python
# -*- coding: utf-8 -*-

import pygame

from settings import Settings
from game_stats import GameStats
from scoreboard import Scoreboard
from button import Button
from ship import Ship
import game_functions as gf
from pygame.sprite import Group

def run():
    # 1.初始化游戏并创建一个屏幕对象
    pygame.init()
    pygame.display.set_caption("Alien Invasion")
    ai_settings = Settings()
    screen = pygame.display.set_mode((ai_settings.screen_width, ai_settings.screen_height))

    # 2.创建一个用于存储游戏统计信息的实例
    stats = GameStats(ai_settings)

    # 3.创建Play按钮
    play_button = Button(ai_settings, screen, "Play")

    # 4.创建一艘飞船
    ship = Ship(ai_settings, screen)

    # 5.创建一组子弹
    bullets = Group()

    # 6.创建一群外星人
    aliens = Group()
    gf.create_fleet(ai_settings, screen, ship, aliens)

    # 7.创建一个积分榜
    sb = Scoreboard(ai_settings, screen, stats)

    # 8.开始游戏的主循环
    while True:
        # 监视键盘和鼠标事件
        gf.check_events(ai_settings, screen, stats, sb, play_button, ship, aliens, bullets)
        if stats.game_active:
            # 根据移动标志调整飞船的位置
            ship.update()
            # 子弹移动
            gf.update_bullets(ai_settings, screen, stats, sb, ship, aliens, bullets)
            # 外星人移动
            gf.update_aliens(ai_settings, screen, stats, sb, ship, aliens, bullets)
        # 更新屏幕上的图像，并切换到新屏幕
        gf.update_screen(ai_settings, screen, stats, sb, ship, aliens ,bullets, play_button)
