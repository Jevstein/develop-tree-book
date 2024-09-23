
mod mock;
mod base;

fn main() {
    base::utils::lab_print_title("\n====== Hello, world! This is Rustaceans. ======\n");

    // base::utils::lab_print_title("\n很高兴为您服务，请输入以下命令进行操作：\n");
    // [{
    //     cmd: 0, name: "Rust 入门演习", func: xxxx
    // }]

    loop {
        mock::crates::ferris_says();
    
        base::utils::lab_print_title("\n>>>>>> 一、Rust 入门演习 <<<<<<");
        mock::exercise::run();

        base::utils::lab_print_title("\n>>>>>> 二、启动websocket服务 <<<<<<");

        println!("loop");
        break;
    }

    base::utils::lab_print_title("\n=================== the end ===================\n");
}
