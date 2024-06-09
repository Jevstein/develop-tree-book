/**
 * https://blog.51cto.com/ustb80/2105678
 *
 *	客户端：
 *		1.连接服务器；
 *		2.向服务器发送消息；
 *		3.接收服务器的广播消息；
 */

package main

import (
	"fmt"
	"log"
	"net"
	"os"
)

func main() {
	Start(os.Args[1])
}

func Start(tcpAddrStr string) {
	tcpAddr, err := net.ResolveTCPAddr("tcp4", tcpAddrStr)
	if err != nil {
		log.Printf("Resolve tcp addr failed: %v\n", err)
		return
	}

	// 向服务器拨号
	conn, err := net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		log.Printf("Dial to server failed: %v\n", err)
		return
	}

	// 向服务器发消息
	go SendMsg(conn)

	// 接收来自服务器端的广播消息
	buf := make([]byte, 1024)
	for {
		length, err := conn.Read(buf)
		if err != nil {
			log.Printf("[recv]:: failed to receive server msg! err: %v\n", err)
			conn.Close()
			os.Exit(0)
			break
		}

		fmt.Printf("[recv]: %s\n", string(buf[0:length]))
	}
}

// 向服务器端发消息
func SendMsg(conn net.Conn) {
	username := "[" + conn.LocalAddr().String() + "]"
	for {
		var input string

		fmt.Println("please input command(exit when you input q/quit): ")

		// 接收输入消息，放到input变量中
		fmt.Scanln(&input)

		if input == "/q" || input == "/quit" {
			fmt.Println("[send]: Byebye ...")
			conn.Close()
			os.Exit(0)
		}

		// 只处理有内容的消息
		if len(input) > 0 {
			msg := "{" + username + " say:" + input + "}"
			_, err := conn.Write([]byte(msg))
			if err != nil {
				conn.Close()
				break
			}
		}
	}
}

// ./tcpclient 127.0.0.1:9090
