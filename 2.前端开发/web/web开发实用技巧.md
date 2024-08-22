[TOC]

# web实用技巧



## 1、 localStorage存储计算

**localStorage的最大存储量一般为5MB**

### 1）计算localStorage的大小

```javascript
function calcLocalStorageSize(obj) {
  if (!obj) {
    console.warn('当前浏览器不支持!');
  }
  
  let size = 0;
  for (let i = 0; i < obj.length; i++) {
    const key = obj.key(i);
    const value = obj.getItem(key);
    // size += key.length + value.length;// 计算键和值的大小
    size += new Blob([key+value]).size;
  }
  if (size > 1024 * 1024) return `${size / (1024 * 1024)}MB`;
  else if (size > 1024) return `${size / (1024)}KB`;
  
  return `${size}B`;
}

calcLocalStorageSize(window.localStorage)
```



### 2）计算localStorage的容量

```javascript
function calcLocalStorageCapacity(obj) {
  if (!obj) {
    console.warn('当前浏览器不支持!');
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
        obj.removeItem('test');
        obj.setItem('test', sum);
        console.log(sum.length / 1024 + 'KB');
    } catch(e) {
      	alert(sum.length / 1024 + 'KB, 超出最大限制');
        clearInterval(timer);
    }
  }, 0.1);
}

calcLocalStorageCapacity(window.localStorage)
```



