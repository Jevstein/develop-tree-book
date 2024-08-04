
/**
 * @created : 2024/08/04
 * @author  : Jevstein
 * @desc    : iframe-protocol - 消息协议
 */

// 数据格式
// class IframeData {
//   seq = 0;      // 流水号-对应每条消息的唯一标识
//   type = null;  // 消息类型
//   data = null;  // 消息内容
// }

// 消息类型
const IFRAME_TYPE_SIMPLE                  = 10000; // 简单消息
const IFRAME_TYPE_ELECTRON_SIMPLE         = 10001; // 简单消息