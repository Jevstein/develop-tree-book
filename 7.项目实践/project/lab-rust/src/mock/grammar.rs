use crate::base::utils::lab_print_title;
use crate::mock::math::add;

/**
 * 变量的使用
 * 1、Rust中的变量声明不需要指定类型，编译器会自动推断变量类型。
 * 2、Rust中的变量默认是不可变的，如果需要修改变量的值，必须将其定义为可变变量。
 * 3、Rust中的变量声明可以包含初始值，也可以不包含初始值，如果不包含初始值，则变量会被默认初始化为0、false或空值。
 * 4、Rust中的变量声明可以用let、const、static关键字声明。
 * 5、Rust中的变量声明可以用mut关键字声明可变变量。
 * 6、Rust中的变量声明可以用类型注解来指定变量类型。
 * 7、Rust中的变量声明可以用=来指定初始值。
 *
 * 变量的类型
 *  // 数据类型	    描述	       举例	            范围
 *  // i8	    有符号8位整数	let x: i8 = 42;	    -128 到 127
 *  // i16	    有符号16位整数	let x: i16 = 42;	-32,768 到 32,767
 *  // i32	    有符号32位整数	let x: i32 = 42;	-2,147,483,648 到 2,147,483,647
 *  // i64	    有符号64位整数	let x: i64 = 42;	-9,223,372,036,854,775,808 到 9,223,372,036,854,775,807
 *  // i128	    有符号128位整数	let x: i128 = 42;	-170,141,183,460,469,231,731,687,303,715,884,105,728 到 170,141,183,460,469,231,731,687,303,715,884,105,727
 *  // u8	    无符号8位整数	let x: u8 = 42;	    0 到 255
 *  // u16	    无符号16位整数	let x: u16 = 42;	0 到 65,535
 *  // u32	    无符号32位整数	let x: u32 = 42;	0 到 4,294,967,295
 *  // u64	    无符号64位整数	let x: u64 = 42;	0 到 18,446,744,073,709,551,615
 *  // u128	    无符号128位整数	let x: u128 = 42;	0 到 340,282,366,920,938,463,463,374,607,431,768,211,455
 *  // f32	    单精度浮点数	let x: f32 = 3.14;	精度为6-9位
 *  // f64	    双精度浮点数	let x: f64 = 3.14;	精度为15-17位
 *  // bool	    布尔类型	    let x: bool = true;	true 或 false
 *  // char	    Unicode字符类型	let x: char = ‘A’;	单个Unicode字符
 *  // 元组类型	  可包含不同类型的值	let tup: (i32, f64, char) = (42, 3.14, ‘A’);	-
 *  // 数组类型	  包含相同类型的值，长度固定	let arr: [i32; 3] = [1, 2, 3];	-
 *  // 引用类型	  用于引用其他值的指针类型	let x: i32 = 42; let y: &i32 = &x;
 */
fn variable_usage() {
    let x = 10; // 其类型会被编译器自动推断为i32类型
    let y: i32 = 20; // 也可以显式指定类型

    let mut z = 30; // 在Rust中，变量默认是不可变的，如果需要修改变量的值，必须将其定义为可变变量
    println!("x: {}, y: {}, z: {}", x, y, z);

    z = 40; // 声明了mut后，这里才能修改z的值

    println!("x: {}, y: {}, z: {}", x, y, z);
}

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

/**
 * 可变数组-Vec
 * 1、Vec是一种动态数组类型，可以存储不同类型的值, 也可以在运行时添加或移除元素。与数组不同，Vec 的大小不是在编译时固定的，而是可以在运行时动态调整。
 * 2、Vec类型可以用vec!宏来创建，也可以用Vec::new()方法创建空的Vec。
 * 3、Vec类型的方法：push、pop、insert、remove、len、is_empty、clear、contains、iter。
 * 4、Vec类型可以用索引访问元素，也可以用迭代器访问元素。
 * 5、Vec类型可以用to_vec方法将&str转换为Vec类型。
 * 6、Vec类型可以用extend方法将一个Vec追加到另一个Vec。
 * 7、Vec类型可以用split_off方法将Vec分割成两部分。
 * 8、Vec类型可以用as_slice方法将Vec转换为 &[T] 类型。
 * 9、Vec类型可以用as_mut_slice方法将Vec转换为 &mut [T] 类型。
 * 10、Vec类型可以用from_iter方法将一个迭代器转换为Vec类型。
 * 11、Vec类型可以用drain方法将Vec中的元素逐个移除。
 * 12、Vec类型可以用split_at方法将Vec分割成两部分。
 * 13、Vec类型可以用swap_remove方法将Vec中的元素交换并移除。
 * 14、Vec类型可以用retain方法根据条件移除Vec中的元素。
 * 15、Vec类型可以用resize方法调整Vec的大小。
 * 16、Vec类型可以用reverse方法反转Vec中的元素。
 * 17、Vec类型可以用dedup方法移除Vec中的重复元素。
 * 18、Vec类型可以用binary_search方法在有序Vec中查找元素。
 * 19、Vec类型可以用sort方法对Vec进行排序。
 * 20、Vec类型可以用dedup_by方法移除Vec中的重复元素，并使用指定的比较函数。
 * 21、Vec类型可以用partition方法对Vec进行划分。
 * 22、Vec类型可以用windows方法获取Vec的滑动窗口。
 * 23、Vec类型可以用split_inclusive方法获取包含分隔符的子串。
 */
fn vec_usage() {
    // 创建一个空向量
    let mut v1 = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);
    v1.push(4);
    v1.push(5);
    println!("1、创建一个空向量 => v1: {:?}", v1);

    // 创建一个包含元素的向量
    let mut v2 = vec![1, 2, 3];
    v2.push(4);
    v2.push(5);
    println!("2、创建一个包含元素的向量 => v2: {:?}", v2);

    // Vec类型方法: push、pop、insert、remove、len、is_empty、clear、contains、iter
    let mut v = vec![1, 2, 3, 4, 5];
    println!("3、初始化 => v: {:?}", v);

    println!("4、通过索引访问第三个元素: {}", v[2]);

    for i in &v {
        println!("5、通过迭代器访问元素: {}", i);
    }

    v.insert(2, 10);
    println!("5、插入元素: {:?}", v);

    v.remove(3);
    println!("6、移除元素: {:?}", v);

    v.pop();
    println!("7、移除最后一个元素: {:?}", v);

    println!("8、vec的长度: {}", v.len());

    println!("9、vec是否为空: {}", v.is_empty());

    v.clear();
    println!("10、清空: {:?}", v);

    println!("11、vec是否包含元素: {}", v.contains(&2));
}

/**
 * HashTable(Map): -- 用于解决各种问题，如缓存、索引等
 *   Hash表(table)通常指的是哈希表(hash table)，也称为字典(dictionary)、映射(map)等。哈希表是一种常用的数据结构，
 * 可以快速地查找和插入数据，其基本思想是通过哈希函数将键(key)映射到一个固定的位置，然后在该位置存储对应的值(value)。
 *   HashTable处理冲突的方法：开放地址法(open addressing)、链表法(chaining)。
 * 1、HashMap是一种哈希表类型，可以存储键值对，键必须是不可变类型，值可以是任意类型。
 * 2、HashMap类型可以用HashMap::new()方法创建空的HashMap。
 * 3、HashMap类型的方法：insert、get、entry、remove、len、is_empty、clear、contains_key、keys、values、iter。
 * 4、HashMap类型可以用get_mut方法获取键对应的值的可变引用。
 * 5、HashMap类型可以用extend方法将一个HashMap追加到另一个HashMap。
 * 6、HashMap类型可以用drain方法将HashMap中的元素逐个移除。
 * 7、HashMap类型可以用split_off方法将HashMap分割成两部分。
 * 8、HashMap类型可以用as_slice方法将HashMap转换为 &[(&K, &V)] 类型。
 * 9、HashMap类型可以用as_mut_slice方法将HashMap转换为 &mut [(&K, &mut V)] 类型。
 * 10、HashMap类型可以用from_iter方法将一个迭代器转换为HashMap类型。
 * 11、HashMap类型可以用into_iter方法将HashMap转换为迭代器。
 * 12、HashMap类型可以用reserve方法预分配空间。
 * 13、HashMap类型可以用shrink_to_fit方法压缩HashMap的空间。
 * 14、HashMap类型可以用hasher方法获取哈希函数。
 * 15、HashMap类型可以用default方法设置默认值。
 * 16、HashMap类型可以用eq_key方法比较两个键是否相等。
 * 17、HashMap类型可以用eq_val方法比较两个值是否相等。
 * 18、HashMap类型可以用into_keys方法获取键的迭代器。
 * 19、HashMap类型可以用into_values方法获取值的迭代器。
 * 20、HashMap类型可以用into_keys_values方法获取键值对的迭代器。
 * 21、HashMap类型可以用extend_from_slice方法将一个切片追加到HashMap。
 * 22、HashMap类型可以用retain方法根据条件移除HashMap中的元素。
 * 23、HashMap类型可以用split_by_fn方法根据函数移除HashMap中的元素。
 * 24、HashMap类型可以用split_by_hasher方法根据哈希函数移除HashMap中的元素。
 * 25、HashMap类型可以用into_keys_mut方法获取键的可变迭代器。
 * 26、HashMap类型可以用into_values_mut方法获取值的可变迭代器。
 * 27、HashMap类型可以用into_keys_values_mut方法获取键值对的可变迭代器。
 * 28、HashMap类型可以用get_key_value方法获取键值对。
 * 29、HashMap类型可以用get_key_value_mut方法获取键值对的可变引用。
 * 30、HashMap类型可以用into_keys_values_hasher方法获取键值对的迭代器和哈希函数。
 * 31、HashMap类型可以用into_keys_values_mut_hasher方法获取键值对的可变迭代器和哈希函数。
 * 32、HashMap类型可以用into_keys_hasher方法获取键的迭代器和哈希函数。
 * 33、HashMap类型可以用into_values_hasher方法获取值的迭代器和哈希函数。
 * 34、HashMap类型可以用into_keys_values_mut_hasher方法获取键值对的可变迭代器和哈希函数。
 * 
 * 除了HashMap类型外，Rust标准库中还提供了BTreeMap（有序哈希表-基于B树B-tree实现）类型，需要注意键的类型必须实现Ord trait
 */
fn hash_map_usage() {
    use std::collections::HashMap;

    let mut map = HashMap::new();

    map.insert("a", 1);
    map.insert("b", 2);
    map.insert("c", 3);

    let s = String::from("Alice");
    let ss = s.to_string();
    map.insert(&ss, 100);
    // map.insert(&String::from("Bob").to_string(), 90);

    println!("1、初始化 => map: {:?}", map);

    let v = map.get("a");
    println!("2、通过键获取值: {:?}", v);

    let v = map.get("d");
    println!("3、通过不存在的键获取值: {:?}", v);

    for (k, v) in &map {
        println!("4、通过迭代器访问键值对: {}: {}", k, v);
    }

    map.remove("a");
    println!("5、移除元素: {:?}", map);

    let v = map.entry("d").or_insert(4);
    println!("6、插入元素: {:?}", v);
}

/**
 * 函数的使用
 * 1、Rust中的函数声明不需要指定类型，编译器会自动推断函数返回值类型。
 * 2、Rust中的函数可以有多个参数，参数类型可以省略，参数也可以用模式匹配来解构。
 * 3、Rust中的函数可以有默认参数值，可以有多个返回值。
 * 4、Rust中的函数可以用impl关键字定义方法，方法可以访问结构体的字段。
 * 5、Rust中的函数可以用pub关键字来公开函数，可以用pub(crate)来限制公开范围。
 * 6、Rust中的函数可以用extern关键字来声明外部函数，可以用unsafe关键字来声明不安全函数。
 * 7、Rust中的函数可以用async关键字定义异步函数。
 * 8、Rust中的函数可以用const关键字定义常量。
 * 9、Rust中的函数可以用macro_rules!关键字定义宏。
 * 10、Rust中的函数可以用dyn关键字定义trait对象。
 * 11、Rust中的函数可以用move关键字来捕获变量的所有权。
 */
fn func_uage() {
    let result = add(3, 5); // 调用 add 函数
    println!("add(3, 5): {}", result);
}

pub fn run() {
    lab_print_title("\n>>> 1、变量: let mul a = 10;");
    variable_usage();

    lab_print_title("\n>>> 2、字符串: String和&str");
    string_usage();

    lab_print_title("\n>>> 3、可变数组(Vec):");
    vec_usage();

    lab_print_title("\n>>> 4、HashTable(Map):");
    hash_map_usage();

    lab_print_title("\n>>> *、函数的使用:");
    func_uage();
}
