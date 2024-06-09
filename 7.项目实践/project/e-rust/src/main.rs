
mod mock; 

fn main() {
    mock::crates::ferris_says();  // 调用 ferris_says
    println!("====== Hello, world! This is Rustaceans. ======");

    
    let result = mock::math::add(3, 5);  // 调用 add 函数 
    println!("Result1: {}", result);



    println!("=================== the end ===================");
}
