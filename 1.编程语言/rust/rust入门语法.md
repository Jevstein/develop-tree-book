[TOC]

# rust的入门语法



**Rust 学习资料**
1、[Rust](https://rust.p2hp.com/)
2、[Rust 程序设计](https://www.rust-lang.org/zh-CN/)



## 一、rust简介

- 1、特点
- 


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



### 2、字符串的用法 

```rust
/*
* 字符串的使用
* Rust中的字符串有两种类型：String和&str。
* 1、String类型是可变的、堆分配的字符串类型，可以动态地增加或删除字符, 也可以用String::from()方法创建
* 2、&str是不可变的、静态分配的字符串类型，可以用作函数参数、返回值或结构体字段类型。
*     通常是通过引用字符串字面量或String对象的方法来创建
* 3、字符串的操作非常丰富，例如
*     1）使用+运算符拼接两个字符；
*     2）使用to_owned方法将&str转换为String类型，从而实现字符串的动态修改；
*     3）使用len方法获取字符串长度；
*     4）使用chars方法获取字符串中的字符等。
* 4、在Rust中很多字符串处理的库：
*     1) regex库用于处理正则表达式
*     2) serde_json库用于处理JSON数据
*     3) std::collections库提供了很多集合类型，例如HashMap、HashSet、BTreeMap、BTreeSet等
*     4) std::string库提供了字符串处理的函数，例如split、replace、trim、push_str、len、chars、split_at、starts_with、ends_with等
*     5) std::fs库提供了文件系统操作的函数，例如read_to_string、create_dir、remove_file等
*     6) std::io库提供了输入输出操作的函数，例如BufReader、BufWriter等
*     7) std::path库提供了路径处理的函数，例如PathBuf等
*/
fn string_usage() {
    // String类型
    let mut s = String::new();
    s.push_str("hello");
    s.push_str(", world!");
    println!("1、String::new() => s: {}", s);

    // &str类型
    let s1 = "Hello, world!";
    let s2 = String::from("Hello, world!");
    println!("2、String::from() => s1: {}, s2: {}", s1, s2);

    // &str类型转换为String类型
    let mut s3 = s1.to_string();
    s3.push_str(" this is Rustaceans!");
    println!("3、to_string() => s3: {}", s3);

    // 字符串的拼接
    let ss1 = "hello ";
    let ss2 = "world";
    let ss = ss1.to_owned() + ss2;
    println!(
        "4、拼接: ss.to_owned() => ss1: {}, ss2: {}, ss: {}, ss-len: {}",
        ss1,
        ss2,
        ss,
        ss.len()
    );
}

```



> 巨人的肩膀：
>
> [Rust 全面指南：从基础到高级，一网打尽 Rust 的编程知识](https://blog.csdn.net/qq_36678837/article/details/131371856)