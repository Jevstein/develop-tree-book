// 基于H5通知API实现
 
// 点击按钮触发通知
var button = document.querySelector('#button');
button.onclick = function () {
    var option = {
        title: '温馨提示',
        body: '不要天天坐在电脑前，要早点休息！'
    };
    var myNotification = new window.Notification(option.title, option);
    // 给提示添加点击事件
    myNotification.onclick = function () {
        console.log('点击了');
    }
};
 
// 监听网络通了
window.addEventListener('online', function () {
    // 参数参考Notification文档
    var option = {
        title: '温馨提示',
        body: '网络好了，你该上工了！'
    };
    var myNotification = new window.Notification(option.title, option);
    // 给提示添加点击事件
    myNotification.onclick = function () {
        console.log('点击了');
    }
});
 
 
// 监听网络断了
window.addEventListener('offline', function () {
    // 参数参考Notification文档
    var option = {
        title: '温馨提示',
        body: '网已经断了，你该休息了！'
    };
    var myNotification = new window.Notification(option.title, option);
    // 给提示添加点击事件
    myNotification.onclick = function () {
        console.log('点击了');
    }
})