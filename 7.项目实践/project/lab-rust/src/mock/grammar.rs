
use crate::mock::math::add;
use crate::base::utils::jvt_print_title;

fn variable_usage() {
    // 数据类型	    描述	       举例	            范围
    // i8	    有符号8位整数	let x: i8 = 42;	    -128 到 127
    // i16	    有符号16位整数	let x: i16 = 42;	-32,768 到 32,767
    // i32	    有符号32位整数	let x: i32 = 42;	-2,147,483,648 到 2,147,483,647
    // i64	    有符号64位整数	let x: i64 = 42;	-9,223,372,036,854,775,808 到 9,223,372,036,854,775,807
    // i128	    有符号128位整数	let x: i128 = 42;	-170,141,183,460,469,231,731,687,303,715,884,105,728 到 170,141,183,460,469,231,731,687,303,715,884,105,727
    // u8	    无符号8位整数	let x: u8 = 42;	    0 到 255
    // u16	    无符号16位整数	let x: u16 = 42;	0 到 65,535
    // u32	    无符号32位整数	let x: u32 = 42;	0 到 4,294,967,295
    // u64	    无符号64位整数	let x: u64 = 42;	0 到 18,446,744,073,709,551,615
    // u128	    无符号128位整数	let x: u128 = 42;	0 到 340,282,366,920,938,463,463,374,607,431,768,211,455
    // f32	    单精度浮点数	let x: f32 = 3.14;	精度为6-9位
    // f64	    双精度浮点数	let x: f64 = 3.14;	精度为15-17位
    // bool	    布尔类型	    let x: bool = true;	true 或 false
    // char	    Unicode字符类型	let x: char = ‘A’;	单个Unicode字符
    // 元组类型	  可包含不同类型的值	let tup: (i32, f64, char) = (42, 3.14, ‘A’);	-
    // 数组类型	  包含相同类型的值，长度固定	let arr: [i32; 3] = [1, 2, 3];	-
    // 引用类型	  用于引用其他值的指针类型	let x: i32 = 42; let y: &i32 = &x;

    let x = 10;             // 其类型会被编译器自动推断为i32类型
    let y: i32 = 20;        // 也可以显式指定类型

    let mut z = 30;         // 在Rust中，变量默认是不可变的，如果需要修改变量的值，必须将其定义为可变变量
    println!("x: {}, y: {}, z: {}", x, y, z);

    z = 40;                 // 声明了mut后，这里才能修改z的值

    println!("x: {}, y: {}, z: {}", x, y, z);
}

fn string_usage() {
    jvt_print_title("Rust中的字符串有两种类型：String和&str");

    jvt_print_title("\n1、String类型是可变的、堆分配的字符串类型，可以动态地增加或删除字符, 也可以用String::from()方法创建");
    {
        let mut s = String::new();
        s.push_str("hello");
        s.push_str(", world!");
        println!("s: {}", s);

        let s1 = "Hello, world!";
        let s2 = String::from("Hello, world!");
        println!("s1: {}, s2: {}", s1, s2);
    }

    jvt_print_title("\n2、&str是不可变的、静态分配的字符串类型，可以用作函数参数、返回值或结构体字段类型。通常是通过引用字符串字面量或String对象的方法来创建");
    jvt_print_title("注意：由于&str是不可变的，因此不能向其添加或删除字符。但是可以使用to_string方法将&str转换为String类型，从而实现字符串的动态修改");
    {
        let s = "hello";
        let mut t = s.to_string();
        t.push_str(", world!");
        println!("s: {}, t: {}", s, t);
    }

    jvt_print_title("\n3、在Rust中，字符串的操作非常丰富，例如可以使用+运算符将两个字符串拼接起来，\
        使用len方法获取字符串长度，使用chars方法获取字符串中的字符等。此外，Rust还提供了很多字符串处理的库，\
        例如regex库用于处理正则表达式，serde_json库用于处理JSON数据等。\
        总之，字符串在Rust中是一个非常重要的数据类型，具有丰富的操作和处理方式，可以用于解决各种问题，如文本处理、网络通信等
    ");
    {
        let s1 = "hello ";
        let s2 = "world";
        let s3 = s1.to_owned() + s2;
        println!("s1: {}, s2: {}, s3: {}, s3-len: {}", s1, s2, s3, s3.len());
    }
}

fn vec_usage() {
    jvt_print_title("\n1、Rust中的Vec类型是一种动态数组类型，可以存储不同类型的值，可以动态地增加或删除元素");
    {
        let mut v = Vec::new();
        v.push(1);
        v.push(2);
        v.push(3);
        v.push(4);
        v.push(5);
        println!("v: {:?}", v);

        let mut v2 = vec![1, 2, 3, 4, 5];
        v2.push(6);
        v2.push(7);
        println!("v2: {:?}", v2);
    }

    jvt_print_title("\n2、Vec类型提供了很多方法，例如push、pop、insert等，可以方便地操作数组元素");
    {
        let mut v = vec![1, 2, 3, 4, 5];
        v.insert(2, 10);
        v.remove(3);
        println!("v: {:?}", v);
    }
}

fn function_call() {
    let result = add(3, 5); // 调用 add 函数
    println!("add(3, 5): {}", result);
}

pub fn run() {
    jvt_print_title("\n>>> 1、变量的使用:");
    variable_usage();

    jvt_print_title("\n>>> 2、字符串的使用:");
    string_usage();

    jvt_print_title("\n>>> 3、可变数组-Vec:");
    vec_usage();

    jvt_print_title("\n>>> *、函数调用:");
    function_call();


}
