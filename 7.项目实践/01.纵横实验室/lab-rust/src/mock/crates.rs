use ferris_says::say; // from the previous step
use std::io::{stdout, BufWriter};

pub fn ferris_says() {
    // println!("Hello, world!");
    // let x = 10;
    // let y: i32 = 20;

    let stdout = stdout();
    let message = String::from("Hello fellow Rustaceans!");
    let width = message.chars().count();

    let mut writer = BufWriter::new(stdout.lock());
    say(&message, width, &mut writer).unwrap();
}