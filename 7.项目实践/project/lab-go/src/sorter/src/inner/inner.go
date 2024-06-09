package inner

import (
	"fmt"
	"time"
	"log"
)

const (
	Ldate         = 1 << iota     // 日期:  2009/01/23
	Ltime                         // 时间:  01:23:23
	Lmicroseconds                 // 微秒:  01:23:23.123123.
	Llongfile                     // 路径+文件名+行号: /a/b/c/d.go:23
	Lshortfile                    // 文件名+行号:   d.go:23
	LUTC                          // 使用标准的UTC时间格式 
	LstdFlags     = Ldate | Ltime // 默认
)

// func Ldefault() {
// 	log.Println("这是默认的格式\n")
// }

// func Ldate() {
// 	log.SetFlags(log.Ldate)
// 	log.Println("这是输出日期格式\n")
// }

// func Ltime() {
// 	log.SetFlags(log.Ltime)
// 	log.Println("这是输出时间格式\n")
// }

// func Lmicroseconds() {
// 	log.SetFlags(log.Lmicroseconds)
// 	log.Println("这是输出微秒格式\n")
// }

// func Llongfile() {
// 	log.SetFlags(log.Llongfile)
// 	log.Println("这是输出路径+文件名+行号格式\n")
// }

// func Lshortfile() {
// 	log.SetFlags(log.Lshortfile)
// 	log.Println("这是输出文件名+行号格式\n")
// }

// func LUTC() {
// 	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.LUTC)
// 	log.Println("这是输出 使用标准的UTC时间格式 格式\n")
// }

func Logdbg(args ...interface{}) { 
	fmt.Println("[", time.Now().Format("2006-01-02 15:04:05"), "][dbg]", args)
}

func Loginf(args ...interface{}) { 
	// fmt.Println("[", time.Now().Format("2006-01-02 15:04:05"), "][inf]", args)
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.LUTC)
	log.Println("[inf]", args)
}

func Logerr(args ...interface{}) { 
	fmt.Println("[", time.Now().Format("2006-01-02 15:04:05"), "][error]", args)
}