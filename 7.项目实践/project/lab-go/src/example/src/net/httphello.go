/**
* 引入Go语言标准库中的net/http 包，主要用于提供Web服务，响应并处理客户端
*（浏览器）的HTTP请求：http://localhost:8080/hello，届时输出"hello, world"
* 
* 其中，使用io包而不是fmt包来输出字符串，这样源文件编译成可执行
* 文件后，体积要小很多，运行起来也更省资源
*/

package main

import (
	"io"
	"log"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, world!")
}

func main() {
	http.HandleFunc("/hello", helloHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err.Error())
	}
}
