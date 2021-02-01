[TOC]

# iOS打包

## 1.合并sdk，同时适应模拟器和真机

```shell
# 查看
$ lipo -info /src_path/debug-iphoneos/demo.framework/demo
***
Non-fat file: *** arm64

# 打包
$ lipo -create /src_path1/debug-iphoneos/demo.framework/demo /src_path2/debug-simulator/demo.framework/demo -output dest_path/demo

```

