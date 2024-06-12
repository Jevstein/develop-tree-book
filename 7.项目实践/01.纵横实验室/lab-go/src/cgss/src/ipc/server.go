/*
	采用channel作为模块之间的通信方式。虽然channel可以传递任何数据类型，甚至包括另外一个channel，
	但为了让架构更容易拆分，这里严格限制了只能用于传递JSON格式的字符串类型数据。这样如果之后想将这
	样的单进程示例修改为多进程的分布式架构，也不需要全部重写，只需替换通信层即可
*/

package ipc

import (
	"encoding/json"
	"fmt"
)

type Request struct {
	Method string "method"
	Params string "params"
}

type Response struct {
	Code string "code"
	Body string "body"
}

type Server interface {
	Name() string
	Handle(method, params string) *Response
}

type IpcServer struct {
	Server
}

func NewIpcServer(server Server) *IpcServer {
	return &IpcServer{server}
}

func (server *IpcServer) Connect() chan string {
	session := make(chan string, 0)
	go func(c chan string) {
		for {
			request := <-c
			if request == "CLOSE" { // 关闭该连接
				break
			}
			var req Request
			err := json.Unmarshal([]byte(request), &req)
			if err != nil {
				fmt.Println("Invalid request format:", request)
			}
			resp := server.Handle(req.Method, req.Params)
			b, err := json.Marshal(resp)
			c <- string(b) // 返回结果
		}
		fmt.Println("Session closed.")
	}(session)
	fmt.Println("A new session has been created successfully.")
	return session
}
