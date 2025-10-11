/**
 * @created : 2025/10/10
 * @author  : IM消息组
 * @desc    : 在线客服 - 访客咨询嵌入式组件
 */

function getNeedRTL() {
  return false;
}

class JvtDraggable {
  _props = {
    handleElement: null,    // 拖拽手柄
    boundaryElement: null,  // 限制拖拽范围的元素
    axis: 'both',           // 拖拽方向: 'x' | 'y' | 'both'
    cursor: 'move',         // 拖拽时的光标样式
    onStart: null,          // 开始拖拽回调
    onDrag: null,           // 拖拽中回调
    onEnd: null,            // 拖拽结束回调
    onChange: null,         // 位置变化回调
  };

  _isDragging = false;              // 是否正在拖拽
  _startPossion = { x: 0, y: 0 };   // 开始拖拽时的位置
  _currentPossion = { x: 0, y: 0 }; // 当前拖拽位置
  _boundaryRect = null;             // 边界矩形

  static create(props) {
    return new JvtDraggable(props);
  }

  constructor(props) {
    const {
      handleElement,
      boundaryElement,
      ...others
    } = props || {};

    this._props = {
      ...this._props,
      ...others,
      handleElement: (typeof handleElement === 'string') ? document.getElementById(handleElement) : handleElement,
      // boundaryElement: (typeof boundaryElement === 'string') ? document.getElementById(boundaryElement) : boundaryElement,
    };

    if (!this._props.handleElement) {
      console.error(`未找到节点或ID为"${handleElement}"的元素`);
      return;
    }

    this.init();
  }

  init() {
    // this._update();
    // if (getComputedStyle(this.element).position === 'static') {// 确保元素可定位
    //   this.element.style.position = 'absolute';
    // }

    this._props.handleElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this._props.handleElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    this._props.handleElement.addEventListener('dragstart', (e) => e.preventDefault());// 防止拖拽时选中文本
  }

  destroy() {
    this._isDragging = false;

    this._props.handleElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this._props.handleElement.removeEventListener('touchstart', this.onTouchStart.bind(this));
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();

    this._startDrag(e, { x: e.clientX, y: e.clientY });

    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onTouchStart(e) {
    e.stopPropagation();
    e.preventDefault();

    const touch = e.touches[0];
    this._startDrag(e, { x: touch.clientX, y: touch.clientY });

    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onMouseMove(e) {
    if (!this._isDragging)
      return;

    e.stopPropagation();
    e.preventDefault();
    this._dragging(e, { x: e.clientX, y: e.clientY });
  }

  onTouchMove(e) {
    if (!this._isDragging)
      return;

    e.stopPropagation();
    e.preventDefault();

    const touch = e.touches[0];
    this._dragging(e, { x: touch.clientX, y: touch.clientY });
  }

  onMouseUp(e) {
    this._endDrag(e);
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onTouchEnd(e) {
    this.endDragging(e);
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }

  _startDrag(event, clientPossion) {
    this._isDragging = true;
    this._startPossion = {
      x: clientPossion.x - this._currentPossion.x,
      y: clientPossion.y - this._currentPossion.y
    };

    // this._props.handleElement.classList.add('dragging');

    // 更新边界信息
    if (this._props.boundaryElement) {
      this._boundaryRect = this._props.boundaryElement.getBoundingClientRect();
    }

    const options = {
      startPossion: this._startPossion,
      currentPossion: this._currentPossion
    };
    this._props.onStart?.(event, options);
    console.log('onStart: ', this._currentPossion);
  }

  _dragging(event, clientPossion) {
    const {
      axis,
    } = this._props;

    let newPossion = {
      x: clientPossion.x - this._startPossion.x,
      y: clientPossion.y - this._startPossion.y
    }

    // 边界限制
    if (this._boundaryRect) {
      const elementRect = this._props.handleElement.getBoundingClientRect();

      // 计算边界限制
      const maxX = this._boundaryRect.width - elementRect.width;
      const maxY = this._boundaryRect.height - elementRect.height;

      newPossion = {
        x: Math.max(0, Math.min(newPossion.x, maxX)),
        y: Math.max(0, Math.min(newPossion.y, maxY))
      };
    }

    this._currentPossion = {
      x: axis === 'y' ? 0 : newPossion.x,
      y: axis === 'x' ? 0 : newPossion.y,
    };

    this._update();

    const options = {
      startPossion: this._startPossion,
      currentPossion: this._currentPossion
    };
    this._props.onDrag?.(event, options);
    console.log('onDrag: ', options);
  }

  _endDrag(event) {
    if (!this._isDragging)
      return;

    this._isDragging = false;
    this._props.handleElement.style.cursor = '';
    // this._props.handleElement.classList.remove('dragging');

    const options = {
      startPossion: this._startPossion,
      currentPossion: this._currentPossion
    };
    this._props.onEnd?.(event, options);
    console.log('onEnd: ', this._currentPossion);
  }

  _update() {
    const { onChange } = this._props;
    if (onChange) {
      const options = {
        startPossion: this._startPossion,
        currentPossion: this._currentPossion
      };
      return onChange(options);
    }

    const { x, y } = this._currentPossion;
    this._props.handleElement.style.transform = `translate(${x}px, ${y}px)`;
    console.log('update: ', this._currentPossion);
  }
}

class JvtDragResizer {
  _props = {
    hostElement: null,  // 目标(宿主)元素
    director: 'n',      // 拖动方向：n(上), w(左), nw(左上)
  };

  _startRect = {
    width: 0,
    height: 0,
  };

  _mapDragProps = {
    'w': { // 左
      axis: 'x',
    },
    'n': {// 上
      axis: 'y',
    },
    'nw': {// 左上
      axis: 'both',
    },
  }

  static create(props) {
    return new JvtDragResizer(props);
  }

  constructor(props) {
    const {
      hostElement,
      director,
      ...others
    } = props || {};

    this._props = {
      hostElement: (typeof hostElement === 'string') ? document.getElementById(hostElement) : hostElement,
      director: director || 'n',
      ...others,
    };

    if (!this._props.hostElement || !(this._props.hostElement instanceof HTMLElement)) {
      console.error('必须指定 hostElement 属性');
      return;
    }

    this._createDraggable();
  }

  _createDraggable() {
    const rtl = getNeedRTL() ? 'drag-nw-rtl' : '';
    const className = `ui-weapp-em-visitor-drag-resizer drag-${this._props.director} ${rtl}`;
    const node = document.createElement('p');
    node.setAttribute('class', className);
    this._props.hostElement && this._props.hostElement.appendChild(node);

    return JvtDraggable.create({
      ...this._mapDragProps[this._props.director],
      handleElement: node,
      boundaryElement: this._props.boundaryElement,
      cursor: '',
      // position: {
      //   x: 0,
      //   y: 0
      // },
      onStart: (event) => {
        this._startRect = {
          width: parseInt(document.defaultView.getComputedStyle(this._props.hostElement).width, 10),
          height: parseInt(document.defaultView.getComputedStyle(this._props.hostElement).height, 10),
        }
      },
      onEnd: (event) => {
      },
      onChange: (options) => {
        console.log('onChange: ', options);
        const { x, y } = options.currentPossion;
        const { width, height } = this._startRect;
        this._props.hostElement.style.width = `${width - x}px`;
        this._props.hostElement.style.height = `${height - y}px`;
      }
    });
  }
}

class JvtFloatWindow {
  _props = {
    title: '在线客服',
    rootId: '',
    data: {
      url: '',
    },
  };
  _prefix = 'weapp-em-visitor-float-window';
  _isVisibleWindow = false;
  _isDraging = false;
  _draggable = null;
  _dragResizers = [];

  static create(props) {
    return new JvtFloatWindow(props);
  }

  constructor(props) {
    props && (this._props = { ...this._props, ...props });

    this._render();
  }

  _getRoot() {
    if (!this._props.rootId) {
      return document.body;
    }
    return document.getElementById(this._props.rootId);
  }

  _createDraggable(options) {
    this._draggable && this._draggable.destroy();

    const timer = setTimeout(() => {
      this._draggable = JvtDraggable.create(options);
      clearTimeout(timer);
    }, 500);

    // document.addEventListener('DOMContentLoaded', () => {
    //   this._draggable = JvtDraggable.create(options);
    // });
  }

  _createDragResizers(options) {
    if (this._dragResizers.length > 0) {
      this._dragResizers.forEach((item) => item?.destroy?.());
      this._dragResizers = [];
    }

    const timer = setTimeout(() => {
      ['n', 'w', 'nw'].forEach((director) => {
        const dragResizer = JvtDragResizer.create({ ...options, director });
        this._dragResizers.push(dragResizer);
      });
      clearTimeout(timer);
    }, 500);
  }

  _render() {
    const root = this._getRoot();

    const main = document.createElement('div');
    main.setAttribute('id', `id-${this._prefix}`);
    main.setAttribute('class', `ui-${this._prefix}`);

    const item = !this._isVisibleWindow ? this._createEntry() : this._createWindow();
    item && main.appendChild(item);

    root && root.appendChild(main);
  }

  _createEntry() {
    const entry = document.createElement('div');
    entry.setAttribute('class', 'entry');
    entry.setAttribute('title', this._props.title);
    entry.onclick = (event) => this.handleClickEntry(event, true);
    this._createDraggable({
      handleElement: entry,
      boundaryElement: this._getRoot(),
      onDrag: (e, options) => {
        this._isDraging = true;
      }
    });

    const img = document.createElement('img');
    img.src = './assets/Icon-customerservice02.svg';
    img.alt = 'Customer Service Icon';
    img.style.width = '20px';
    img.style.height = 'auto';
    img.style.filter = 'brightness(100)';

    entry.appendChild(img);
    return entry;
  }

  _createWindow() {
    const main = document.createElement('div');
    main.setAttribute('class', 'main');
    this._createDraggable({
      handleElement: main,
      boundaryElement: this._getRoot(),
      onDrag: (element, e) => {
        this._isDraging = true;
      }
    });

    this._createDragResizers({
      hostElement: main,
      boundaryElement: this._props.rootId,
    });

    // 标题栏
    const header = document.createElement('div');
    header.setAttribute('class', 'header');
    {
      const img = document.createElement('img');
      img.src = './assets/logo-mukelin.png';
      img.alt = '.';
      img.style.width = '97px';
      img.style.height = 'auto';
      header.appendChild(img);
    }
    {
      const img = document.createElement('img');
      img.setAttribute('class', 'img-close');
      img.src = './assets/Icon-Down-arrow01.svg';
      img.alt = '.';
      img.style.width = '20px';
      img.style.filter = 'brightness(100)';
      img.onclick = (event) => this.handleClickEntry(event, false);
      header.appendChild(img);
    }
    main.appendChild(header);

    // 内容区 - iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('class', 'iframe');
    iframe.setAttribute('id', 'id-weblab-iframe');
    iframe.setAttribute('scrolling', 'yes');
    iframe.setAttribute('name', 'top');
    iframe.src = this._props.data.url;
    main.appendChild(iframe);

    return main;
  }

  handleClickEntry(event, isVisible) {
    event.stopPropagation();
    event.preventDefault();

    if (this._isDraging) {
      this._isDraging = false;
      return;
    }

    this._isVisibleWindow = isVisible;
    const root = this._getRoot();
    root && root.removeChild(document.getElementById(`id-${this._prefix}`));
    this._render();
  }
}