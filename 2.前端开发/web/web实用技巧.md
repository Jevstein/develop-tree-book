[TOC]

# web实用技巧



## 1、 localStorage存储计算

**localStorage的最大存储量一般为5MB**

### 1）计算localStorage的大小

```javascript
function calcLocalStorageSize() {
  let size = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    // size += key.length + value.length;// 计算键和值的大小
    size += new Blob([key+value]).size;
  }
  if (size > 1024 * 1024) return `${size / (1024 * 1024)}MB`;
  else if (size > 1024) return `${size / (1024)}KB`;
  
  return `${size}B`;
}
```



### 2）计算localStorage的容量

```javascript
function calcLocalStorageCapacity() {
  if (!window.localStorage) {
    console.warn('当前浏览器不支持localStorage!');
  }

  var test = '0123456789';
  var add = function(num) {
    num += num;
    if(num.length == 10240) {
      test = num;
      return;
    }
    add(num);
  }
  add(test);

  var sum = test;
  var timer = setInterval(function(){
    sum += test;
    try {
        window.localStorage.removeItem('test');
        window.localStorage.setItem('test', sum);
        console.log(sum.length / 1024 + 'KB');
    } catch(e) {
      	alert(sum.length / 1024 + 'KB, 超出最大限制');
        clearInterval(timer);
    }
  }, 0.1);
}
```



