#!/usr/bin/python
# -*- coding: utf-8 -*-

import tkinter
from tkinter import ttk

class Application(object):
    def __init__(self):
        self.root = tkinter.Tk()
        self.root.title("crawler")
        #self.root.geometry("600x400")

        # self.frame_left_top = Frame(width=400, height=200)
        # self.frame_right_top = Frame(width=400, height=200)
        # self.frame_center = Frame(width=800, height=400)
        # self.frame_bottom = Frame(width=800, height=50)

        # self.tree = ttk.Treeview(self.root)
        # self.tree["columns"] = ("index", "area", "count", "price")
        # self.tree.column("index", width=100)
        # self.tree.column("area", width=100)
        # self.tree.column("count", width=100)
        # self.tree.column("price", width=100)
        # self.tree.heading("index", text="index")
        # self.tree.heading("area", text="area")
        # self.tree.heading("count", text="count")
        # self.tree.heading("price", text="price")
        # self.tree.pack()

        self.tree = ttk.Treeview(self.root, columns=['1','2','3','4'], show='headings')
        self.tree.column('1', width=100, anchor='center')
        self.tree.column('2', width=100, anchor='center')
        self.tree.column('3', width=100, anchor='center')
        self.tree.column('4', width=100, anchor='center')
        self.tree.heading('1', text='index')
        self.tree.heading('2', text='area')
        self.tree.heading('3', text='count')
        self.tree.heading('4', text='price')
        # self.tree.grid()
        self.tree.pack()

        '''
        # ----vertical scrollbar------------
        self.vbar = ttk.Scrollbar(self.root, orient=VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=self.vbar.set)
        self.tree.grid(row=0, column=0, sticky=NSEW)
        self.vbar.grid(row=0, column=1, sticky=NS)

        # ----horizontal scrollbar----------
        self.hbar = ttk.Scrollbar(self.root, orient=HORIZONTAL, command=self.tree.xview)
        self.tree.configure(xscrollcommand=self.hbar.set)
        self.hbar.grid(row=1, column=0, sticky=EW)
        '''

    def insert(self, list):
        # list = ['pudong', '88888', '1']
        # self.tree.insert("", index, text="line1", values=(area, count, price))
        self.tree.insert('', 'end', values=list)

    def loop(self):
        self.root.mainloop()

'''
import tkinter as tk
# 定义Application类表示应用/窗口，继承Frame类
class Application(tk.Frame):
    # Application构造函数，master为窗口的父控件
    def __init__(self, master=None):
        # 初始化Application的Frame部分
        tk.Frame.__init__(self, master)
        # 显示窗口，并使用grid布局
        self.grid()
        # 创建控件
        self.createWidgets()
    # 创建控件
    def createWidgets(self):
        # 创建一个文字为'Quit'，点击会退出的按钮
        self.quitButton = tk.Button(self, text='Quit', command=self.quit)
        # 显示按钮，并使用grid布局
        self.quitButton.grid()
# 创建一个Application对象app
app = Application()
# 设置窗口标题为'First Tkinter'
app.master.title = 'First Tkinter'
# 主循环开始
app.mainloop()
'''