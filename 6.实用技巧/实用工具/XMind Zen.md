[TOC]

# XMind Zen

## 1.去除水印

XMind Zen最新使用版，导出的图片有水印，网上破解方法有：

| 方案                                                         | 说明                                                         | 启发                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------ |
| [Xmind ZEN破解版来袭：如何去除水印](https://www.jianshu.com/p/7ddce2525044) | 已经过时了，无法找到这几个文件                               |                          |
| https://www.jianshu.com/p/625c8a0aff8e                       | 不幸网址已无法打开，大概意思是：<br />只要替换XMind ZEN\resources下的app.asar文件就OK了 | 问题就在这个文件app.asar |

​	结合以上两个方案，使用010Editor打开app.asar文件(路径：C:\Program Files\XMind ZEN\resources\app.asar)，搜索png-watermark。

![网络图片](https://upload-images.jianshu.io/upload_images/1984473-72d114b44dc3f805.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

见js代码，将image width（默认为1）改成0，即长度没有就展示不出来了。如此导出png，成功！pdf类似



## 2.永久试用

正版购买地址：https://www.xmind.cn/pricing/，有能力的同学请支持正版，谢谢！！！

```shell
#1.必须先进入软件，新建一个思维导图，产生用户状态文件就行。

#2.打开路径：C:\Users\Administrator\AppData\Roaming\XMind ZEN\Electron v3\vana\state\activation.json
   内容改为： {"trialStartTime":1}
   
#3.保存后，再次打开Xmind
```



> 巨人的肩膀：
> [最新版XMind Zen水印去除](https://www.jianshu.com/p/efaad7a099fe)
> [Xmind ZEN永久使用（非破解）](http://www.manongjc.com/article/39182.html)





