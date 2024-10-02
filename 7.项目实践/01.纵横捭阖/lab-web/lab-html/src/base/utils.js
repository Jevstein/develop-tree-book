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

  /**
   * 添加水印
   * @param {*} text 水印内容
   */
  static addWatermark(text) {
    // 创建canvas元素
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
  
    // 设置canvas大小
    canvas.width = 300;
    canvas.height = 200;
  
    // 绘制水印文字
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 半透明黑色
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.atan(canvas.height / canvas.width));
    ctx.fillText(text, 0, 0);
  
    // 创建水印图片
    var watermark = new Image();
    watermark.src = canvas.toDataURL('image/png');
  
    // 添加水印图片到body
    document.body.style.backgroundImage = 'url(' + watermark.src + ')';
    document.body.style.backgroundRepeat = 'repeat';
  }
  
}

/**
 * 枚举类: 用于定义常量, 防止魔法字符串，可确保枚举不被覆盖或访问不存在的命名常量
 * 也可以使用冻结的方式创建枚举类（但访问不存在的命名常量会返回undefined），
 * 例如：const Enum = Object.freeze({ A: 1, B: 2, C: 3 });
 * @param {Object} baseEnum 基础枚举对象
 */
function JvtEnum(baseEnum) {
  return new Proxy(baseEnum, {
    get(target, name) {
      if (!baseEnum.hasOwnProperty(name)) {
        throw new Error(`"${name}" value does not exist in the enum`)
      }
      return baseEnum[name]
    },
    set(target, name, value) {
      throw new Error('Cannot add a new value to the enum')
    }
  })
}