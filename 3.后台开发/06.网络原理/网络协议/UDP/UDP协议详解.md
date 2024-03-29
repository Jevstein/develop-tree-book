[TOC]


# UDP协议详解
## 前言
我们知道：TCP是可靠的，UDP是不可靠的。那既然不可靠，为什么有了TCP后，还需要UDP？  
  事实上，TCP和IP协议是差不多同时诞生的，随着后面不断的开发，人们逐渐认识到TCP和IP是独立的。对于很多开发我们只需要像IP这种协议一样做到“尽可能传输”就可以了，不需要像TCP协议去做很多可靠性的保障，于是UDP协议应运而生。它只是在IP协议上添加了端口信息而已，然后就通过网络层发送出去，不管包是否到达，是否乱序，是否重传，所有的这些都由应用层去实现，或者不实现。这是十分有必要的，比如视频传输，我们丢失了一些帧或者一部分，再去做重传是没有什么意义的，因为下一个完整帧立马就会发送过来了。UDP协议比起TCP协议来说最大的优势就是`快`，天下武功为快不破嘛！！！

## 协议
UDP协议分为`首部字段`和`数据字段`，其中`首部字段`只占用8个字节，分别是个占用两个字节的`源端口`、`目的端口`、`长度`和`检验和`。具体协议字段信息如下：
![UDP协议图](images/UDP协议.jpg)

* 长度：UDP报文的整个大小，最小为8个字节（仅为首部)

* 检验和：在进行检验和计算时，会添加一个伪首部一起进行运算。

* 伪首部（占用12个字节）为：
    * 4个字节的源IP地址
    * 4个字节的目的IP地址
    * 1个字节的0 
    * 一个字节的数字17  
    * 占用2个字节UDP长度。
    
    这个伪首部不是报文的真正首部，只是引入为了计算校验和。相对于IP协议的只计算首部，UDP检验和会把首部和数据一起进行校验。接收端进行的校验和与UDP报文中的校验和相与，如果无差错应该全为1。如果有误，则将报文丢弃或者发给应用层、并附上差错警告。