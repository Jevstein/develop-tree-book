[TOC]

# staruml

## 1安装

略

### 2、去除水印（免注册）

1）打开包名路径

​	/Applications/StarUML.app/Contents/Resources/app.asar

2）解压

```shell
$asar e app.asar app
```

3）修改证书文件

​	打开/Applications/StarUML.app/Contents/Resources/app/src/engine/license-manager.js，找到validate()方法，替换为：

```jsx
  //增加新的函数
  validate() {
    return new Promise((resolve, reject) => {
      resolve({
        name: "DXkite",
        product: "DXkite product",
        licenseType: "DXkite Personal",
        quantity: "DXkite Quantity",
        timestamp: "1529049036",
      });
    })
  }
```

保存！

4）重新打包

```shell
$asar p app app.asar
```

5）替换app.asar

6）重新打开staruml，成功！