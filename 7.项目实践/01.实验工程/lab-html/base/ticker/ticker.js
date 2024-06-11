/**
 * @created : 2024/05/08
 * @author  : Jevstein
 * @desc    : 定时器 - 一个定时器控制多个事件
 */

class JvtTicker {
  _intervalId = null;
  _idCount = 0;
  _eventMap = {};

  constructor(
    props = {
      idlTime: 1000,
    }
  ) {
    this._idlTime = props.idlTime;
  }

  add(eventId, data, func) {
    const id = eventId || ++this._idCount;

    _eventMap[id] = {
      eventId: id,
      data,
      func
    };

    return id;
  }

  remove(id) {
    if (!id) {
      this._eventMap = {};
      return;
    }

    if (this._eventMap[id]) {
      delete this._eventMap[id];
    }
  }

  close() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    this.remove();
  }

  run() {
    // https://blog.csdn.net/qq_44318215/article/details/126927341
    
    this._intervalId = setInterval(() => {
      for (key in this._eventMap) {
        func = this._eventMap[key].func;
        if (!func) {
          continue;
        }

        const timeoutId = setTimeout(() => {
          func({
            eventId: this._eventMap[key].eventId,
            data: this._eventMap[key].data,
          });
          clearTimeout(timeoutId);
        }, 10);
      }
    }, this._idlTime);
  }
}