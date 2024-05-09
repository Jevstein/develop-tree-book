/**
 * 倒计时：webworker
 * 文档：解决setInterval和setTimeout越来越慢的问题 - https://blog.csdn.net/qq_44318215/article/details/126927341
 */

// const workercode = () => {
  // const getFormatTime = (durTime) => {
  //   let remain = durTime;
  //   const hour = Math.floor(remain / (60 * 60 * 1000));
  //   remain = remain % 3600000;
  //   const minute = Math.floor(remain / (60 * 1000));
  //   remain = remain % 60000;
  //   const second = Math.floor(remain / 1000);
  //   return {
  //     hour,
  //     minute,
  //     second,
  //   };
  // };

  // let time = 3670000;

  // setInterval(() => {
  //   time = time - 1000;
  //   if (time < 0) {
  //     close(); // 关闭worker线程
  //     return;
  //   }
  //   // const data = getFormatTime(time);
  //   // postMessage(JSON.stringify(data)); // 向主线程发送消息
  //   postMessage(time); // 向主线程发送消息
  // }, 1000);
// };

// let code = workercode.toString();
// code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

// const blob = new Blob([code], { type: 'application/javascript' });
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;

let _isStop = false;

const _run = () => {
  let time = 3670000;
  
  _isStop = false;

  const intervalId = setInterval(() => {
    time = time - 1000;
    if (time < 0) {
      _isStop = true;
    }

    if (_isStop) {
      clearInterval(intervalId);
      close(); // 关闭worker线程
      return;
    }

    self.postMessage(time); // 向主线程发送消息
  }, 1000);
}

self.addEventListener('message', e => { // 接收到消息
  console.log('worker message:', e.data);
  // self.postMessage('Greeting from Worker.js'); // 向主线程发送消息

  if (e.data === 'start') {
    _run();
    return;
  }

  if (e.data === 'stop') {
    _isStop = true;
  }
});