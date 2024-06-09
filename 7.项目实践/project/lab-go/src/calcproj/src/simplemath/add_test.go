// add_test.go
package simplemath

import "testing"

func TestAdd1(t *testing.T) {
	r := Add(1, 2)
	if r != 2 {// 这里本该是3，故意改成2测试错误场景
		t.Errorf("Add(1, 2) failed. Got %d, expected 3.", r)
	} 
}

//$ go test simplemath