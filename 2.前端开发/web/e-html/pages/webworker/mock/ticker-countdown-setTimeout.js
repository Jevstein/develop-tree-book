/**
 * 倒计时：监听页面切换 - setTimeout递归
 * 文档：解决setInterval和setTimeout越来越慢的问题 - https://blog.csdn.net/qq_44318215/article/details/126927341
 */

// importScripts('./test.js');
// console.log('importScripts add:', add(1, 2)); // log 3

///////////////////////////////

let totalTime = 3670000; // 总时间
let leftTime = totalTime; // 剩余时间
let isStop = false;

let startTime = new Date().getTime(); // 计时器的开始时间
let count = 0; // 计时器的执行次数

let timer = 0; //  定时器id

const _run = (nextTime) => {
  if (nextTime <= 0) {
    isStop = true;
    console.log(JvtUtils.getFormatTime(leftTime).text); // 拿到data更新页面数据
  }

  if (isStop) {
    console.log('the end!', JvtUtils.getFormatTime(leftTime).text, leftTime, nextTime); // 拿到data更新页面数据
    clearTimeout(timer);
    return;
  }

  timer = setTimeout(() => {
    leftTime = leftTime - 1000;
    console.log(JvtUtils.getFormatTime(leftTime).text); // 拿到data更新页面数据

    clearTimeout(timer);

    count++;
    const offset = new Date().getTime() - (startTime + count * 1000); // 误差时间
    _run(1000 - offset);
  }, nextTime);
}

// _run(1000);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    clearTimeout(timer)
  } else {
    totalTime = totalTime - (new Date().getTime() - startTime)
    if (totalTime < 0) {
      return;
    }
    leftTime = totalTime
    startTime = new Date().getTime()
    count = 0
    _run(1000);
  }
})

const jvtCountDownTMStart = () => {
  totalTime = 3670000; // 总时间
  leftTime = totalTime; // 剩余时间
  isStop = false;

  startTime = new Date().getTime();
  count = 0; // 计时器的执行次数

  timer = 0; //  定时器id

  _run(1000);
}

const jvtCountDownTMStop = () => {
  isStop = true;
}