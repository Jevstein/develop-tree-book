[TOC]

# rust的入门语法



**Rust 学习资料**
1、[Rust](https://rust.p2hp.com/)
2、[Rust 程序设计](https://www.rust-lang.org/zh-CN/)



## 一、rust简介




## 二、rust项目结构

```shell
lab-rust					-- 工程根目录
|- Cargo.toml			-- Rust 的清单文件。其中包含了项目的元数据和依赖库
|- src						-- 源码
	 |- main.rs
|- target					-- cargo run后生成的可执行文件和编译文件
```



## 三、**Cargo：Rust 的构建工具和包管理器**

在终端中执行以下命令：

```shell
$ cargo new [name]：创建一个新的Rust项目
$ cargo build：构建项目(只编译代码，不运行，默认编译的为debug版本)
$ cargo build --release：编译为release版本
$ cargo run：运行项目
$ cargo test：运行测试
$ cargo doc：生成文档
$ cargo update：更新依赖项
$ cargo clean：清除构建输出
$ cargo publish：将软件包发布到crates.io上
$ cargo add [name]：新增依赖项（相当于在Cargo.toml中手动添加: [name]=[x.x.x]), 如cargo add ansi_term
$ cargo install [package]: 安装指定软件包
$ cargo uninstall [package]: 卸载指定软件包
```



## 四、rust语法

### 1、变量的用法

```rust
/**
 * 变量的使用
 * 1、Rust中的变量声明不需要指定类型，编译器会自动推断变量类型。
 * 2、Rust中的变量默认是不可变的，如果需要修改变量的值，必须将其定义为可变变量。
 * 3、Rust中的变量声明可以包含初始值，也可以不包含初始值，如果不包含初始值，则变量会被默认初始化为0、false或空值。
 * 4、Rust中的变量声明可以用let、const、static关键字声明。
 * 5、Rust中的变量声明可以用mut关键字声明可变变量。
 * 6、Rust中的变量声明可以用类型注解来指定变量类型。
 * 7、Rust中的变量声明可以用=来指定初始值。
 */
fn variable_usage() {
    let x = 10; // 其类型会被编译器自动推断为i32类型
    let y: i32 = 20; // 也可以显式指定类型

    let mut z = 30; // 在Rust中，变量默认是不可变的，如果需要修改变量的值，必须将其定义为可变变量
    println!("x: {}, y: {}, z: {}", x, y, z);

    z = 40; // 声明了mut后，这里才能修改z的值

    println!("x: {}, y: {}, z: {}", x, y, z);
}
```

- **Rust数据类型：**

![Rust数据类型](./images/Rust数据类型.png)





> 巨人的肩膀：
>
> [Rust 全面指南：从基础到高级，一网打尽 Rust 的编程知识](https://blog.csdn.net/qq_36678837/article/details/131371856)