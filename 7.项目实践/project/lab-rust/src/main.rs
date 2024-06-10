
mod mock;
mod base;

fn main() {
    mock::crates::ferris_says();  // 调用 ferris_says
    base::utils::jvt_print_title("\n====== Hello, world! This is Rustaceans. ======\n");


    base::utils::jvt_print_title(">>>>>> 一、Rust 基本语法 <<<<<<");
    mock::grammar::run();  // 调用 rust_basic_grammar 函数


    base::utils::jvt_print_title("\n=================== the end ===================\n");
}
