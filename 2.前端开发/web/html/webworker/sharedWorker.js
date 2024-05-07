let num = 0;
const workerList = [];

self.addEventListener('connect', e => {
  const port = e.ports[0];

  console.log('connect...');

  port.addEventListener('message', e => {
    num += e.data === 'add' ? 1 : -1;
    workerList.forEach(port => { // 遍历所有已连接的part，发送消息
      port.postMessage(num);
      console.log('message workerList postMessage:', num);
    })
  });

  port.start();
  workerList.push(port); // 存储已连接的part
  port.postMessage(num); // 初始化
  console.log('connect postMessage:', num);
});
