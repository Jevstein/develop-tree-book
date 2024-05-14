/**
 * @created : 2024/05/08
 * @author  : Jevstein
 * @desc    : 倒计时器 - 基于setTimeout实现，支持页面隐藏后继续计时，支持自定义空闲时间和总时间，支持回调函数，支持倒计时结束后执行回调函数
 */

class JvtCountDownTimer {
  _idlTime = 0;                     // 空闲时间
  // _totalTime = 0;                   // 总时间
  _onChange = null;                 // 回调函数

  _isRunning = false;               // 是否正在运行
  _leftTime = 0;                    // 剩余时间
  _startTime = 0;                   // 计时器的开始时间
  _count = 0;                       // 计时器的执行次数
  _timer = 0;                       // 定时器id
  _visibilityChangeListener = null; // 监听页面可见性变化的监听器

  constructor(props) {
    this.init(props);
  }

  init(
    props = {
      idlTime: 1000,
      totalTime: 60000,
      onChange: null,
    }
  ) {
    this._idlTime = props.idlTime;
    this._leftTime = props.totalTime;
    this._onChange = props.onChange;
    // this._totalTime = props.totalTime;
  }

  start() {
    if (this._isRunning) {
      return;
    }

    this._startTime = new Date().getTime();
    this._count = 0;
    this._isRunning = true;
    this._visibilityChangeListener = document.addEventListener('visibilitychange', () => this._handleChangeVisibility());

    this._run(this._idlTime);
  }

  stop() {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;
    clearTimeout(this._timer);
    document.removeEventListener('visibilitychange', this._visibilityChangeListener);
  }

  _handleChangeVisibility() {
    console.log('visibilitychange', document.visibilityState);

    if (document.visibilityState === 'hidden') {
      clearTimeout(this._timer);
      return;
    }

    this._leftTime -= (new Date().getTime() - this._startTime);
    if (this._leftTime < 0) {
      return;
    }

    this._startTime = new Date().getTime();
    this._count = 0;
    this._run(this._idlTime);
  }

  _update() {
    // console.log(JvtUtils.formatTime(leftTime).text); // 拿到data更新页面数据
    this._onChange && this._onChange(this._leftTime);
  }

  _run(nextTime) {
    if (this._leftTime <= 0) {
      this._isRunning = false;
      this._update();
    }

    if (!this._isRunning) {
      console.log('the end!'); // 拿到data更新页面数据
      clearTimeout(this._timer);
      return;
    }

    this._timer = setTimeout(() => {
      this._leftTime -= this._idlTime;

      this._update();

      clearTimeout(this._timer);

      this._count++;
      const offset = new Date().getTime() - (this._startTime + this._count * this._idlTime); // 误差时间
      this._run(Math.max(this._idlTime - offset, 0));
    }, nextTime);
  }
}