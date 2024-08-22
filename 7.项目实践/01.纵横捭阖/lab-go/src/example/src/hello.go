//规则:小写字母开头的函数只在本包内可见，大写字母开头的函数才 能被其他包使用。
//     这个规则也适用于类型和变量的可见性。

package main

// import "fmt"
// import "errors"
import (
	"errors"
	"fmt"
)

func GetName() (firstName, lastName, nickName string) {
	return "May", "Chan", "Chibi Maruko"
}

const (
	Sunday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
	numberOfDays //这个常量没有导出xs

	/*
		同Go语言的其他符号(symbol)一样，以大写字母开头的常量在包外可见。
		以上例子中numberOfDays为包内私有，其他符号则可被其他包访问。
	*/
)

func modify(array [5]int) {
	array[0] = 10 // 试图修改数组的第一个元素
	fmt.Println("In modify(), array values:", array)
}

func arrslice_test() {
	arr := [10]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 0}

	var slice []int = arr[:5]

	for _, v := range arr {
		fmt.Print(v, " ")
	}

	fmt.Println("\nElements of mySlice: ")
	for _, v := range slice {
		fmt.Print(v, " ")
	}
	fmt.Println("")

	mySlice := make([]int, 5, 10)
	for i, v := range mySlice {
		fmt.Print("[", i, "]=", v, ", ")
	}
	fmt.Println("")
	fmt.Println("len(mySlice):", len(mySlice))
	fmt.Println("cap(mySlice):", cap(mySlice))

	mySlice = append(mySlice, 1, 2, 3)
	mySlice2 := []int{8, 9, 10}
	mySlice = append(mySlice, mySlice2...) // 给mySlice后面添加另一个数组切片
	for i := 0; i < len(mySlice); i++ {
		fmt.Println("mySlice[", i, "] =", mySlice[i])
	}
}

type PersonInfo struct {
	ID      string
	Name    string
	Address string
}

func map_test() {
	var personDB map[string]PersonInfo
	personDB = make(map[string]PersonInfo)
	// 往这个map里插入几条数据
	personDB["12345"] = PersonInfo{"12345", "Tom", "Room 203,..."}
	personDB["1"] = PersonInfo{"1", "Jack", "Room 101,..."}
	// 从这个map查找键为"1234"的信息
	person, ok := personDB["1234"]
	if ok {
		fmt.Println("Found person", person.Name, "with ID 1234.")
	} else {
		fmt.Println("Did not find person with ID 1234.")
	}
}

func ctrl_test() {
	a := []int{1, 2, 3, 4, 5, 6}

	for i, v := range a {
		fmt.Print("[", i, "]=", v, ", ")
	}
	fmt.Println("\n---------")

	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		a[i], a[j] = a[j], a[i]
	}

	for i, v := range a {
		fmt.Print("[", i, "]=", v, ", ")
	}
	fmt.Println("\n---------")
}

func Add(a int, b int) (ret int, err error) {
	if a < 0 || b < 0 { // 假设这个函数只支持两个非负数字的加法
		err = errors.New("Should be non-negative numbers!")
		return
	}
	return a + b, nil // 支持多重返回值
}

func multi_param(args ...int) {
	for _, arg := range args {
		fmt.Println(arg)
	}
}

func mutli_param2(args ...int) { // 按原样传递
	multi_param(args...)

	fmt.Println("")

	// 传递片段，实际上任意的int slice都可以传进去
	multi_param(args[1:]...)
}

func MyPrintf(args ...interface{}) {
	for _, arg := range args {
		switch arg.(type) {
		case int:
			fmt.Println(arg, "is an int value.")
		case string:
			fmt.Println(arg, "is a string value.")
		case int64:
			fmt.Println(arg, "is an int64 value.")
		default:
			fmt.Println(arg, "is an unknown type.")
		}
	}
}

func Func_test() {
	ret, err := Add(100, 200)
	fmt.Println("a + b: ret=", ret, ", err=", err)

	mutli_param2(1, 2, 3)

	var v1 int = 1
	var v2 int64 = 234
	var v3 string = "hello"
	var v4 float32 = 1.234
	MyPrintf(v1, v2, v3, v4)
}

func closure_test() {
	var j int = 5
	a := func() func() {
		var i int = 10
		return func() {
			fmt.Printf("i, j: %d, %d\n", i, j)
		}
	}()

	a()

	j *= 2

	a()
}

////////////////////////////////////////////////////////////////////////
/*
	func (a Integer) Less(b Integer) bool { // 面向对象
		return a < b
	}
	func Integer_Less(a Integer, b Integer) bool { // 面向过程
		return a < b
	}
	a.Less(2) // 面向对象的用法
	Integer_Less(a, 2) // 面向过程的用法
*/
type Integer int

func (a Integer) Less(b Integer) bool {
	return a < b
}
func (a *Integer) Add(b Integer) {
	*a += b
}

type LessAdder interface {
	Less(b Integer) bool
	Add(b Integer)
}

func Obj_test() {
	var a Integer = 1
	if a.Less(2) {
		fmt.Println(a, "Less 2")
	}

	// var b LessAdder = &a //正确
	// var b LessAdder = a //错误
}

////////////////////////////////////////////////////////////////////////
func Add_g(x, y int) {
	z := x + y
	fmt.Println("add_g", z)
}

func Count(ch chan int) {
	ch <- 1
	fmt.Println("write：", ch)
}

// func LoopWrite(ch chan int) {
// 	for i:=0; i<10; i++ {
// 		ch <- i
// 		fmt.Println("write in ch：", i)
// 	}
// }

// func LoopRead(ch chan int) {
// 	for {
// 		ret := <-ch
// 		fmt.Println("read from ch：", ret)
// 		if (ret > 9) {
// 			break
// 		}
// 	}
// }

func go_test() {

	fmt.Println("========= go_test =========")

	fmt.Println("------ 1.add ------")
	// for i := 0; i < 10; i++ {
	// 	go Add_g(i, i)
	// }

	fmt.Println("------ 2.select ------")
	func(name string){
		ch := make(chan int, 1)
		for i := 0; i<30; i = i+1 {
			select {
				case ch <- 0:
				case ch <- 1:
			}
			i := <-ch
			fmt.Printf("[%s] Value received: %d\n", name, i)
		}
	}("select test")

	fmt.Println("------ 3.chan: count ------")
	chs := make([]chan int, 10)
	for i := 0; i < 10; i++ {
		chs[i] = make(chan int)
		go Count(chs[i])
	}

	for _, ch := range chs {
		ret := <-ch
		fmt.Println("read：", ret)
	}

	// fmt.Println("------ 3.chan: write/read ------")
	// ch := make(chan int)
	// go LoopWrite(ch)
	// go LoopRead(ch)

	for i := 0; i < 100000; i = i + 1 {
	}
}

func main() {
	var str string
	str = "Hello world!"
	fmt.Println(str[0], ", ", str)

	_, lastName, _ := GetName()
	fmt.Printf("Hello %s, Wednesday=%d!\n", lastName, numberOfDays)

	var b bool
	b = (1 != 0)              // 编译正确
	fmt.Println("Result:", b) // 打印结果为Result: true

	array := [5]int{1, 2, 3, 4, 5} // 定义并初始化一个数组
	modify(array)                  // 传递给一个函数，并试图在函数体内修改这个数组内容
	fmt.Println("In main(), array values:", array)

	arrslice_test()
	map_test()
	ctrl_test()
	Func_test()
	closure_test()
	Obj_test()
	go_test()
}
