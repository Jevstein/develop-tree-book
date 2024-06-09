/**
 * https://blog.51cto.com/ustb80/2105678
 *
 * 服务器端 - chat room：
 *	1.接受来自于客户端的连接请求并建立连接；
 *	2.所有客户端的连接会放进连接池中，用于广播消息
 *
 * 注意事项：
 *	某一个客户端断开连接后需要从连接池中摘除，并不再接收广播消息；
 *	某一个客户端断开连接后不能影响服务器端或别的客户端的连接
 */

package main

import (
	"fmt"
	"log"
	"net"
)

func main() {
	port := "9090"
	Start(port)
}

// 启动服务器
func Start(port string) {
	host := ":" + port

	// 获取tcp地址
	tcpAddr, err := net.ResolveTCPAddr("tcp4", host)
	if err != nil {
		log.Printf("resolve tcp addr failed: %v\n", err)
		return
	}

	// 监听
	listener, err := net.ListenTCP("tcp", tcpAddr)
	if err != nil {
		log.Printf("listen tcp port failed: %v\n", err)
		return
	}

	// 建立连接池，用于广播消息
	conns := make(map[string]net.Conn)

	// 消息通道
	messageChan := make(chan string, 10)

	// 广播消息
	go BroadMessages(&conns, messageChan)

	// 启动
	for {
		fmt.Printf("listening port %s ...\n", port)
		conn, err := listener.AcceptTCP()
		if err != nil {
			log.Printf("Accept failed:%v\n", err)
			continue
		}

		// 把每个客户端连接扔进连接池
		conns[conn.RemoteAddr().String()] = conn
		fmt.Println("session:", conns)

		// 处理消息
		go Handler(conn, &conns, messageChan)
	}
}

// 向所有连接上的乡亲们发广播
func BroadMessages(conns *map[string]net.Conn, messages chan string) {
	for {
		// 不断从通道里读取消息
		msg := <-messages
		// fmt.Println("[broad]::recv msg:", msg)

		// 向所有的乡亲们发消息
		for key, conn := range *conns {
			fmt.Printf("[broad]::send to [%s]: %s\n", key, msg)
			_, err := conn.Write([]byte(msg))
			if err != nil {
				log.Printf("[broad]::failed to broad message to [%s]! err: %v\n", key, err)
				delete(*conns, key)
			}
		}
	}
}

// 处理客户端发到服务端的消息，将其扔到通道中
func Handler(conn net.Conn, conns *map[string]net.Conn, messages chan string) {
	fmt.Printf("[Handler]::connect from client: [%s]\n", conn.RemoteAddr().String())

	buf := make([]byte, 1024)
	for {
		length, err := conn.Read(buf)
		if err != nil {
			log.Printf("[Handler]::failed to read client message! err: %v\n", err)
			delete(*conns, conn.RemoteAddr().String())
			conn.Close()
			break
		}

		// 把收到的消息写到通道中
		recvStr := string(buf[0:length])

		fmt.Println("[Handler]::recv msg:", recvStr)
		messages <- recvStr
	}
}
