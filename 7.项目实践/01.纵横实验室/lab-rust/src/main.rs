
mod mock;
mod base;

fn main() {
    base::utils::lab_print_title("\n====== Hello, world! This is Rustaceans. ======\n");

    mock::crates::ferris_says();

    base::utils::lab_print_title("\n>>>>>> 一、Rust 入门演习 <<<<<<");
    mock::exercise::run();


    base::utils::lab_print_title("\n=================== the end ===================\n");
}
