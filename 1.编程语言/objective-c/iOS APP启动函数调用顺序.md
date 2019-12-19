[TOC]

# iOS APP启动函数调用顺序

## 一、OC调用

​	C++ 会为静态创建的对象生成初始化器，与静态语言不同，OC基于Runtime机制可以用类的名字来实例化一个类的对象。Runtime 维护了一张映射类名与类的全局表，当加载一个 dylib 时，其定义的所有的类都需要被注册到这个全局表中。ObjC 在加载时可以通过 fix-up 在动态类中改变实例变量的偏移量，利用这个技术可以在不改变dylib的情况下添加另一个 dylib 中类的方法，而非常见的通过定义类别（Category）的方式改变一个类的方法。

​	主执行文件和相关的 dylib的依赖关系构成了一张巨大的有向图，执行初始化器先加载叶子节点，然后逐步向上加载中间节点，直至最后加载根节点。这种加载顺序确保了安全性，加载某个 dylib 前，其所依赖的其余 dylib 文件肯定已经被预先加载。最后 dyld 会调用 main() 函数。main() 会调用 UIApplicationMain()，程序启动。



## 二、程序启动逻辑

​	使用Xcode打开一个项目，很容易会发现一个文件－－main.m文件，此处就是应用的入口了。程序启动时，先执行main函数，main函数是ios程序的入口点，内部会调用UIApplicationMain函数，UIApplicationMain里会创建一个UIApplication对象 ，然后创建UIApplication的delegate对象 —–（您的）AppDelegate ，开启一个消息循环（main runloop），每当监听到对应的系统事件时，就会通知AppDelegate。

```objective-c
int main(int argc, char * argv[]) {
	@autoreleasepool {
		return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
	}
}
```

​	UIApplication对象是应用程序的象征，每一个应用都有自己的UIApplication对象，而且是单例的。通过[UIApplication sharedApplication]可以获得这个单例对象，一个iOS程序启动后创建的第一个对象就是UIApplication对象， 利用UIApplication对象，能进行一些应用级别的操作。



## 三、UIApplicationMain函数实现

```objective-c
int UIApplicationMain (int argc, char *argv[], NSString *principalClassName, NSString * delegateClassName);

int UIApplicationMain(int argc, char * _Nonnull * _Null_unspecified argv, NSString * _Nullable principalClassName, NSString * _Nullable delegateClassName);
```

​	第一个参数表示参数的个数，第二个参数表示装载函数的数组，第三个参数，是UIApplication类名或其子类名，若是nil，则默认使用UIApplication类名。第四个参数是协议UIApplicationDelegate的实例化对象名，这个对象就是UIApplication对象监听到系统变化的时候通知其执行的相应方法。

​	启动完毕会调用 didFinishLaunching方法，并在这个方法中创建UIWindow，设置AppDelegate的window属性，并设置UIWindow的根控制器。如果有storyboard，会根据info.plist中找到应用程序的入口storyboard并加载箭头所指的控制器，显示窗口。storyboard和xib最大的不同在于storyboard是基于试图控制器的，而非视图或窗口。展示之前会将添加rootViewController的view到UIWindow上面（在这一步才会创建控制器的view）

```
[window addSubview: window.rootViewControler.view];
```

​	每个应用程序至少有一个UIWindow，这window负责管理和协调应用程序的屏幕显示，rootViewController的view将会作为UIWindow的首视图。

![iOS APP启动函数调用顺序](images\iOS APP启动函数调用顺序.jpg)

未使用storyboard的启动



## 四、程序启动的完整过程

### 1.main 函数

### 2.UIApplicationMain

* 创建UIApplication对象

* 创建UIApplication的delegate对象

* delegate对象开始处理(监听)系统事件(没有storyboard)

* 程序启动完毕的时候, 就会调用代理的application:didFinishLaunchingWithOptions:方法

* 在application:didFinishLaunchingWithOptions:中创建UIWindow

* 创建和设置UIWindow的rootViewController

* 显示窗口

### 3.storyboard

​	根据Info.plist获得最主要storyboard的文件名,加载最主要的storyboard(有storyboard)

 * 创建UIWindow

 * 创建和设置UIWindow的rootViewController

 * 显示窗口

  

## 五、AppDelegate的代理方法
```objective-c
//app启动完毕后就会调用
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{

}
```


```objective-c
//app程序失去焦点就会调用                    

- (void)applicationWillResignActive:(UIApplication *)application {

}

```

```
//app进入后台的时候调用， 一般在这里保存应用的数据(游戏数据,比如暂停游戏)
- (void)applicationDidEnterBackground:(UIApplication *)application {

}
```

```objective-c
//app程序程序从后台回到前台就会调用
- (void)applicationWillEnterForeground:(UIApplication *)application{

}
```

```objective-c
//app程序获取焦点就会调用
- (void)applicationDidBecomeActive:(UIApplication *)application{

 }
```

```objective-c
// 内存警告，可能要终止程序，清除不需要再使用的内存
- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application{

}
```

```objective-c
// 程序即将退出调用
- (void)applicationWillTerminate:(UIApplication *)application{

}
```


### 1. AppDelegate加载顺序

```objective-c
1.application:didFinishLaunchingWithOptions:
2.applicationDidBecomeActive:
```



### 2. ViewController中的加载顺序

```objective-c
 1.loadView

 2.viewDidLoad

 3.viewWillAppear

 4.viewWillLayoutSubviews

 5.viewDidLayoutSubviews

 6.viewDidAppear
```



### 3. View中的加载顺序

```objective-c
1.initWithCoder
  如果没有storyboard就会调用initWithFrame，这里两种方法视为一种

2.awakeFromNib

3.layoutSubviews

4.drawRect
```



### 4.一些方法的使用时机

#### + (void)load;

​	应用程序启动就会调用的方法，在这个方法里写的代码最先调用。



#### +(void)initialize;

​	用到本类时才调用，这个方法里一般设置导航控制器的主题等，如果在后面的方法设置导航栏主题就太迟了！



#### didFinishLaunchingWithOptions:

-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions;

​	这个方法里面会创建UIWindow，设置根控制器并展现，比如某些应用程序要加载授权页面也是在这加，也可以设置观察者，监听到通知切换根控制器等。



#### -(void)awakeFromNib;

​	在使用IB的时候才会涉及到此方法的使用，当.nib文件被加载的时候，会发送一个awakeFromNib的消息到.nib文件中的每个对象，每个对象都可以定义自己的awakeFromNib函数来响应这个消息，执行一些必要的操作。在这个方法里设置view的背景等一系列普通操作。



#### -(void)loadView;

​	创建视图的层次结构，在没有创建控制器的view的情况下不能直接写 self.view 因为self.view的底层是：

```objective-c
if（_view == nil）{
	_view = [self loadView]
}
```
​	这么写会直接造成死循环。如果重写这个loadView方法里面什么都不写，会显示黑屏。



#### -(void)viewWillLayoutSubviews;

​	视图将要布局子视图，苹果建议的设置界面布局属性的方法，这个方法和viewWillAppear里，系统的底层都是没有写任何代码的，也就是说这里面不写super 也是可以的。



#### -(void)layoutSubviews;

​	在这个方法里一般设置子控件的frame。



#### -(void)drawRect:(CGRect)rect;

​	UI控件都是画上去的，在这一步就是把所有的东西画上去。drawRect方法只能在加载时调用一次，如果后面还需要调用，比如下载进度的圆弧，需要一直刷帧，就要使用setNeedsDisplay来定时多次调用本方法。

#### -(void)applicationDidBecomeActive:(UIApplication *)application;

​	这是AppDelegate的应用程序获取焦点方法，真正到了这里，才是所有东西全部加载完毕。



## 六、启动分析

​	应用启动时，会播放一个启动动画。iPhone上是400ms，iPad上是500ms。如果应用启动过慢，用户就会放弃使用，甚至永远都不再回来。为了防止一个应用占用过多的系统资源，开发iOS的苹果工程师门设计了一个“看门狗”的机制。在不同的场景下，“看门狗”会监测应用的性能。如果超出了该场景所规定的运行间，“看门狗”就会强制终结这个应用的进程。=

​	iOS App启动时会链接并加载Framework和static lib，执行UIKit初始化，然后进入应用程序回调，执行Core Animation transaction等。每个Framework都会增加启动时间和占用的内存，不要链接不必要的Framework，必要的Framework不要标记为Optional。避免创建全局的C++对象。

​	初始化UIKit时字体、状态栏、user defaults、Main.storyboard会被初始化。User defaults本质上是一个plist文件，保存的数据是同时被反序列化的，不要在user defaults里面保存图片等大数据。

​	对于 OC 来说应尽量减少 Class,selector 和 category 这些元数据的数量。编码原则和设计模式之类的理论会鼓励大家多写精致短小的类和方法，并将每部分方法独立出一个类别，但这会增加启动时间。在调用的地方使用初始化器，不要使用\\atribute((constructor)) 将方法显式标记为初始化器，而是让初始化方法调用时才执行。比如使用 dispatch_once(),pthread_once() 或 std::once()。也就是在第一次使用时才初始化，推迟了一部分工作耗时。

​	建立网络连接前需要做域名解析，如果网关出现问题，dns解析不正常时，dns的超时时间是应用控制不了的。在程序设计时要考虑这些问题，如果程序启动时有网络连接，应尽快的结束启动过程，网络访问通过线程解决，而不阻塞主线程的运行。


> 参考: 
> [联系人:石虎  QQ: 1224614774昵称:嗡嘛呢叭咪哄 .iOS APP启动函数调用顺序](https://blog.csdn.net/shihuboke/article/details/73929514) 