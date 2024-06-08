[TOC]

# rust的环境搭建



## 1.安装步骤

### 1）mac、linux、unix系统

```shell
#1、执行命令
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

【注意】执行这步后，要重启shell！

#2、检测安装成功
rustc --version
cargo --version

#3、更新
rustup update

#4、卸载
rustup self uninstall
```

**Cargo：Rust 的构建工具和包管理器**

​	您在安装 Rustup 时，也会安装 Rust 构建工具和包管理器的最新稳定版，即 Cargo。Cargo 可以做很多事情：

- `cargo build` 可以构建项目

- `cargo run` 可以运行项目

- `cargo test` 可以测试项目

- `cargo doc` 可以为项目构建文档

- `cargo publish` 可以将库发布到 [crates.io](https://crates.io/)。

  

### 2）windows系统

略



## 2.创建项目

hello, world!

```shell
#1、创建命令
cargo new e-rust

自动生成目录结构 =>
e-rust				-- 根目录
|- Cargo.toml	-- Rust 的清单文件。其中包含了项目的元数据和依赖库
|- src				-- 源码
	 |- main.rs
	 
#2、运行命令
cargo run

运行结果 =>
Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/e-rust`
Hello, world!

```



## 3.配置依赖

​	引入第三方库--- 可在[crates.io（](https://crates.io/)即 Rust 包的仓库）中找到所有类别的库。在 Rust 中，我们通常把包称作“crates”。比如，引入[`ferris-says`](https://crates.io/crates/ferris-says) 的库：

* 1、编辑Cargo.toml文件

	```shell
  ...
  [dependencies]
  ferris-says = "0.3.1"
  ```

* 2、执行命令

  ```shell
  cargo build
  ```

* 3、使用依赖库（crates）

  使用`ferris-says` crate 中导出的 `say` 函数，在main.rs中加入以下代码：

  ```rust
  use ferris_says::say;
  ```

  完整的main.rs文件，如下：

  ```shell
  use ferris_says::say; // from the previous step
  use std::io::{stdout, BufWriter};
  
  fn main() {
      let stdout = stdout();
      let message = String::from("Hello fellow Rustaceans!");
      let width = message.chars().count();
  
      let mut writer = BufWriter::new(stdout.lock());
      say(&message, width, &mut writer).unwrap();
  }
  ```

* 4、运行

  ```shell
   # 执行命令
   cargo run
   
   # 执行结果
   __________________________
  < Hello fellow Rustaceans! >
   --------------------------
          \
           \
              _~^~^~_
          \) /  o o  \ (/
            '_   -   _'
            / '-----' \
  ```

  







> 巨人的肩膀：
>
> [快速配置 Rust 开发环境并编写一个小应用](https://www.rust-lang.org/zh-CN/learn/get-started) 
>
> [Rust 语言从入门到实战](https://view.inews.qq.com/k/20231205A0544100?no-redirect=1&web_channel=wap&openApp=false)

