/**
 * @created : 2024/05/09
 * @author  : Jevstein
 * @desc    : 工具类
 */

class JvtUtils {
  /**
   * 将时间戳转化为xx时xx分xx秒
   * @param {Number} durTime 
   * @returns 
   */
  static getFormatTime(durTime) {
    let remain = durTime;
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
}