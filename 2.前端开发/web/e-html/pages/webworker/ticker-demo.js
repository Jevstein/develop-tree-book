class TickerDemo {

  _type = 1;
  _isRun = false;
  _accumulatorId = 0;
  _nodeMap = {};

  constructor() {

  }

  clear() {
    this._isRun = false;
    this._accumulatorId = 0;
    this._nodeMap = {};
  }

  create(type) {
    _type = type;
  }

  handleChange(params) {

  }

  addItems(params) {
    const {
      count,
      parentElement,
      totalTime,
    } = params;

    const strtime = JvtUtils.formatTime(totalTime).text;

    for (let i = 0; i < count; i++) {
      const data = this._createNodeDom({
        id: ++this._accumulatorId,
        parentElement,
        strtime,
      });
      this._nodeMap[data.id] = {
        ...data,
        totalTime,
        onChange: function () {
          --this.totalTime;
          data.onUpdateTime(JvtUtils.formatTime(this.totalTime).text);
        },
      };
    }
  }

  deleteItems(params) {
    const nodeMapKeys = Object.keys(this._nodeMap);
    const count = Math.min(params.count, nodeMapKeys.length);
    const randomNums = JvtUtils.generateUniqueNumbers(0, nodeMapKeys.length - 1, count);
    console.log('deleteItems:', randomNums);

    for (let i of randomNums) {
      const key = nodeMapKeys[i];
      this._nodeMap[key].onPreRemove();
    }
    const idTimer = setTimeout(() => {
      for (let i of randomNums) {
        const key = nodeMapKeys[i];
        // console.log('deleteItem:', i, key, this._nodeMap[key]);
        this._nodeMap[key].onRemove();
        delete this._nodeMap[key];
      }
      clearTimeout(idTimer);
    }, 1000);
  }

  start() {
    this._isRun = true;

    Object.keys(this._nodeMap).forEach(key => {
      this._nodeMap[key].onStart();
      this._nodeMap[key]['timer'] = new JvtCountDownTimer({
        idlTime: 1000,
        totalTime: this._nodeMap[key].totalTime,
        onChange: (time) => {
          const strtime = JvtUtils.formatTime(time).text;
          this._nodeMap[key].onUpdateTime(strtime);
          if (time <= 0) {
            this._nodeMap[key].onStart(false);
          }
        },
      });
      this._nodeMap[key]['timer'].start();
    });
  }

  stop() {
    this._isRun = false;

    Object.keys(this._nodeMap).forEach(key => {
      this._nodeMap[key].onStart(false);
      this._nodeMap[key]['timer'].stop();
    });
  }

  _createNodeDom(params) {
    const {
      parentElement, 
      strtime,
      id,
    } = params;

    const itemElement = document.createElement('div');
    itemElement.setAttribute('class', 'ticker-item stop');
    // {
      const nameElement = document.createElement('span');
      nameElement.innerHTML = '倒计时';
      nameElement.setAttribute('class', 'name');
      itemElement.appendChild(nameElement);

      const timeElement = document.createElement('span');
      timeElement.innerHTML = strtime;
      timeElement.setAttribute('class', 'time');
      itemElement.appendChild(timeElement);

      const closeElement = document.createElement('div');
      closeElement.innerHTML = '×';
      closeElement.setAttribute('class', 'close');
      closeElement.onclick = () => {
        // itemElement.style.color = "red";
        // itemElement.style.border = "1px solid red";
        // itemElement.classList.remove('.new');
        // itemElement.classList.add('.delete');
        const classNames = itemElement.className;
        itemElement.className = classNames.replace(classNames, "ticker-item remove").trim();
        const idTimer = setTimeout(() => {
          itemElement.remove();
          delete this._nodeMap[id];
          clearTimeout(idTimer);
        }, 500);
      };
      itemElement.appendChild(closeElement);
    // }
    parentElement.appendChild(itemElement);

    return {
      id,
      // itemElement,
      // timeElement,
      // closeElement,
      onPreRemove: function () {
        const classNames = itemElement.className;
        itemElement.className = classNames.replace(classNames, "ticker-item remove").trim();
      },
      onRemove: function () {
        itemElement.remove();
      },
      onStart: function (isRunning = true) {
        const state = isRunning ? 'start' : 'stop';
        const classNames = itemElement.className;
        itemElement.className = classNames.replace(classNames, `ticker-item ${state}`).trim();
      }, 
      onUpdateTime: function (time) {
        timeElement.innerHTML = time;
      }
    }
  }

}

const gTickerDemoInstance = new TickerDemo()