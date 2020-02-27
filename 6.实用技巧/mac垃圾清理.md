[TOC]

# mac下的垃圾清理

## 1.可清理分析

### 1.1.Xcode清理

| 清理项                 | 路径                                                         | 影响                                                         | 空间 |
| :--------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | :--: |
| **对旧设备的支持**     | ~/Library/Developer/Xcode/iOS DeviceSupport                  | 可重新生成;<br />连接旧设备调试时会重新生成                  | 3GB  |
| **旧版本的模拟器支持** | ~/Library/Application Support/iPhone Simulator               | 不可恢复;<br />若需旧版本模拟器,需重新下载                   | 3GB  |
| **模拟器的临时文件**   | ~/Library/Application Support/iPhone Simulator/6.1/tmp       | 可重新生成;<br />放心删                                      | 2GB  |
| **模拟器中安装的Apps** | ~/Library/Application Support/iPhone Simulator/6.1/Applications | 不可恢复；<br />对应模拟器中安装的Apps被清空                 | 1GB  |
| **Archives**           | ~/Library/Developer/Xcode/Archives                           | 不可恢复；<br />Adhoc或者App Store版本会被删除。建议备份dSYM文件夹 | 6GB  |
| **DerivedData**        | ~/Library/Developer/Xcode/DerivedData                        | 可重新生成；<br />删除build生成的项目索引、输出、日志        | 12GB |
| **旧Docsets**          | ~/Library/Developer/Shared/Documentation/DocSets             | 不可恢复；<br />将删除旧的Docsets文档                        | 2GB  |



## 2.脚本化清理

```shell
# mac_cleaner.sh

```



> 参考:
>
> 

