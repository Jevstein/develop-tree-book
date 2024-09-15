/**
 * @created : 2024/05/09
 * @author  : Jevstein
 * @desc    : 工具类
 */

class JvtUtils {

  /**
   * 生成指定数量的不重复的随机数
   * @param {Number} min 最小值
   * @param {Number} max 最大值 
   * @param {Number} count 数量
   * @returns {Array} 
   */
  static generateUniqueNumbers(min, max, count) {
    const numbers = new Set();
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
    }
    return Array.from(numbers);
  }

  /**
   * 将时间戳转化为xx时xx分xx秒
   * @param {Number} timestamp 
   * @returns {Object}
   */
  static formatTime(timestamp) {
    let remain = timestamp;
    const hour = Math.floor(remain / (60 * 60 * 1000));
    remain = remain % 3600000;
    const minute = Math.floor(remain / (60 * 1000));
    remain = remain % 60000;
    const second = Math.floor(remain / 1000);
    return {
      hour,
      minute,
      second,
      text: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    };
  };

  /**
   * 节流: 在一定时间间隔内只执行第一次回调（控制高频事件执行次数）
   * https://cloud.tencent.com/developer/article/2218785
   * @param {*} cb 
   * @param {*} wait 
   * @returns 
   */
  static throttle(cb, wait = 3000){
    let previous = 0;
    return (...args) => {
      const now = +new Date();
      if ( now - previous > wait ){
        previous = now;
        cb.apply(this, args);
      }
    }
  }

  /**
   * 防抖: 在一定时间间隔内只执行末次回调（用户触发事件过于频繁）
   * https://cloud.tencent.com/developer/article/2218785
   * @param {*} cb 
   * @param {*} wait 
   * @param {*} immediate 若为true，则在只执行首次回调，相当于节流
   * @returns 
   */
  static debounce(cb, wait = 3000, immediate = false) {
    let timeout;
  
    return function(...args) {
      const callNow = immediate && !timeout;
  
      timeout && clearTimeout(timeout);
  
      timeout = setTimeout(() => {
        timeout = null;
        !immediate && cb.apply(this, args);
      }, wait);
  
      callNow && cb.apply(this, args);
    };
  }
}