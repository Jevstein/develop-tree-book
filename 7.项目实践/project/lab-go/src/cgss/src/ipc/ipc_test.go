package ipc

import (
	"testing"
)

type EchoServer struct {
	// Server
}

func (server *EchoServer) Handle(method, request string) *Response {
	// return "ECHO:" + request
	return nil
}

func (server *EchoServer) Name() string {
	return "EchoServer"
}

func TestIpc(t *testing.T) {
	server := NewIpcServer(&EchoServer{})
	client1 := NewIpcClient(server)
	client2 := NewIpcClient(server)
	resp1, err1 := client1.Call("method", "From Client1")
	resp2, err2 := client1.Call("method", "From Client2")
	if err1 != nil || err2 != nil {
		t.Error("IpcClient.Call failed. resp1:", resp1, "resp2:", resp2)
	}
	client1.Close()
	client2.Close()
}
