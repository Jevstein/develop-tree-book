

[TOC]

# windows实用技巧

## 1.右键打开app（如：notepad++）

> 参考：
> [文件上右键没有“notepad++方式打开”怎么办？](https://jingyan.baidu.com/article/fa4125ac849f5768ad709264.html)

```shell
#1.右键打开app
1.打开注册表（regedit）：HKEY_CLASSES_ROOT\Directory\BackGround\Shell
2.插入右击文件的菜单项：
  新建项：Nodepad++（即：HKEY_CLASSES_ROOT\Directory\BackGround\Shell\Nodepad++）
3.新建图标: 
  在HKEY_CLASSES_ROOT\Directory\BackGround\Shell\Nodepad++下，新建字符串
     数值名称：Icon
     数值数据：F:\Program Files (x86)\Notepad++\notepad++.exe
4.新建命令:   
  1)新建项：command（即：HKEY_CLASSES_ROOT\Directory\BackGround\Shell\Nodepad++\command）
  2)双击默认，输入数值数据：F:\Program Files (x86)\Notepad++\notepad++.exe

#2.右键文件打开app
1.打开注册表（regedit）：HKEY_CLASSES_ROOT\*\Shell
2.插入右击文件的菜单项：
  新建项：Open with Nodepad++（即：HKEY_CLASSES_ROOT\*\Shell\Open with Nodepad++）
3.新建图标: 
  在HKEY_CLASSES_ROOT\*\Shell\Open with Nodepad++下，新建字符串
     数值名称：Icon
     数值数据：F:\Program Files (x86)\Notepad++\notepad++.exe
4.新建命令:   
  1)新建项：command（即：HKEY_CLASSES_ROOT\*\Shell\Open with Nodepad++\command）
  2)双击默认，输入数值数据：F:\Program Files (x86)\Notepad++\notepad++.exe "%1"
```

