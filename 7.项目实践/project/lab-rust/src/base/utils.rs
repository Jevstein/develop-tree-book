// use crossterm::style::{Color, Stylize};
// use crossterm::{execute, style::Print};
// use ansi_term::Colour::{Red, Green, Yellow, Blue, Purple, Cyan};
use ansi_term::Colour::Blue;

pub fn jvt_print_title(msg: &str) {
    // // 启用 ANSI 颜色代码
    // execute!(std::io::stdout(), crossterm::terminal::EnableAnsiColor).unwrap();
    // // 打印红色文本
    // execute!(std::io::stdout(), Print(msg).with(Color::Green)).unwrap();
    // // execute!(std::io::stdout(), Print(" World")).unwrap();
    // println!(); // 换行

    println!("{}", Blue.paint(msg));

    // let err_msg = "这是错误消息";
    // println!("{} this is red", Red.paint(format!("ERROR MESSAGE: {}", err_msg)));
    // println!("{} this is green", Green.paint("SUCCESS:"));
    // println!("{} this is yellow", Yellow.paint("WARNING:"));
    // println!("{} this is blue", Blue.paint("INFO:"));
    // println!("{} this is purple", Purple.paint("DEBUG:"));
    // println!("{} this is cyan", Cyan.paint("TRACE:"));
}
