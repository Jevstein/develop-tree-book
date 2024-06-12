/**
* 来自： https://www.cnblogs.com/foxy/p/9003784.html
*
*/

package main

import "fmt"

func Producer(ch chan int) {
	// fmt.Printf("start producing... \n")

	for i := 1; i <= 10; i++ {
		ch <- i

		fmt.Printf("produce: %d\n", i)
	}
	close(ch)
}

func Consumer(id int, ch chan int, done chan bool) {
	// fmt.Printf("id[%d] wait for consuming... \n", id)

	for {
		value, ok := <-ch
		if ok {
			fmt.Printf("id[%d] consume: %d\n", id, value)
		} else {
			fmt.Printf("id[%d] closed\n", id)
			break
		}
	}
	done <- true
}

func main() {
	ch := make(chan int, 2) //第二个参数，代码消息队列的缓冲大小

	coNum := 2
	done := make(chan bool, coNum)
	for i := 1; i <= coNum; i++ {
		go Consumer(i, ch, done)
	}

	go Producer(ch)

	for i := 1; i <= coNum; i++ {
		<-done
	}
}
