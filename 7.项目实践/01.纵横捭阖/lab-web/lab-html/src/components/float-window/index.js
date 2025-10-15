/**
 * @created : 2025/10/10
 * @author  : IM消息组
 * @desc    : 在线客服 - 访客咨询嵌入式组件
 */

class JvtDraggable {
  _props = {
    handleElement: null,    // 拖拽手柄
    boundaryElement: null,  // 限制拖拽范围的元素
    axis: 'both',           // 拖拽方向: 'x' | 'y' | 'both'
    cursor: 'grabbing',     // 拖拽时的光标样式,move
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

    this._props.handleElement.addEventListener('mousedown', this.onMouseDown);
    this._props.handleElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this._props.handleElement.addEventListener('dragstart', (e) => e.preventDefault());// 防止拖拽时选中文本
  }

  destroy() {
    this._isDragging = false;

    this._props.handleElement.removeEventListener('mousedown', this.onMouseDown);
    this._props.handleElement.removeEventListener('touchstart', this.onTouchStart);
  }

  onMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this._startDrag(e, { x: e.clientX, y: e.clientY });

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const touch = e.touches[0];
    this._startDrag(e, { x: touch.clientX, y: touch.clientY });

    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd);
  }

  onMouseMove = (e) => {
    if (!this._isDragging) {
      // console.warn('not dragging');
      return;
    }

    e.stopPropagation();
    e.preventDefault();
    this._dragging(e, { x: e.clientX, y: e.clientY });
  }

  onTouchMove = (e) => {
    if (!this._isDragging)
      return;

    e.stopPropagation();
    e.preventDefault();

    const touch = e.touches[0];
    this._dragging(e, { x: touch.clientX, y: touch.clientY });
  }

  onMouseUp = (e) => {
    this._endDrag(e);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onTouchEnd = (e) => {
    this._endDrag(e);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  _startDrag(event, clientPossion) {
    this._isDragging = true;
    this._startPossion = {
      x: clientPossion.x - this._currentPossion.x,
      y: clientPossion.y - this._currentPossion.y
    };
    this._currentPossion = { x: 0, y: 0 };

    this._props.handleElement.style.cursor = this._props.cursor;
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
    // console.log('onStart: ', this._currentPossion);
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
    // console.log('onDrag: ', this._currentPossion);
  }

  _endDrag(event) {
    if (!this._isDragging) {
      return;
    }
    // console.warn('end dragging');

    // this._dragging(e, { x: e.clientX, y: e.clientY });

    this._isDragging = false;
    this._props.handleElement.style.cursor = '';
    // this._props.handleElement.classList.remove('dragging');

    const options = {
      startPossion: this._startPossion,
      currentPossion: this._currentPossion
    };
    this._props.onEnd?.(event, options);
    // console.log('onEnd: ', this._currentPossion);

    if (this._props.onChange) {// 缩放时，要清空
      this._startPossion = { x: 0, y: 0 };
      this._currentPossion = { x: 0, y: 0 };
    }
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
    // console.log('update: ', this._currentPossion);
  }
}

class JvtDragResizer {
  _props = {
    hostElement: null,  // 目标(宿主)元素
    director: 'n',      // 拖动方向：n(上), w(左), nw(左上)
  };

  _startRect = null; // { width: 0, height: 0 };

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
    const rtl = ''; // getNeedRTL() ? 'drag-nw-rtl' : '';
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

        const mask = document.createElement('div');
        mask.setAttribute('class', 'ui-weapp-em-visitor-drag-resizer-mask');
        mask.style.width = `100%`;
        mask.style.height = `100%`;
        mask.style.background = 'red';
        mask.style.position = 'absolute';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.opacity = '0';
        this._props.hostElement.appendChild(mask);
      },
      onEnd: (event) => {
        this._props.hostElement.removeChild(document.querySelector('.ui-weapp-em-visitor-drag-resizer-mask'));
        this._startRect = null;
      },
      onChange: (options) => {
        // console.error('onChange: ', options.currentPossion);
        if (this._startRect) {
          const { x, y } = options.currentPossion;
          const { width, height } = this._startRect;
          this._props.hostElement.style.width = `${width - x}px`;
          this._props.hostElement.style.height = `${height - y}px`;
        }
      }
    });
  }
}

class JvtFloatWindow {
  _props = {
    title: '在线客服', // 访客标题（鼠标移入会弹出提示）
    rootId: '',       // 挂载访客聊天窗口的节点，不传默认为body
    data: {
      url: '',        // 客服系统地址
    },
    isReload: false,  // 是否重新加载聊天窗口
    chatSize: null,   // 聊天窗口大小
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

    if (this._props.isReload) {
      const item = this._isVisibleWindow ? this._createWindow() : this._createEntry();
      item && main.appendChild(item);
    } else {
      main.appendChild(this._createEntry());
      main.appendChild(this._createWindow());
    }

    root && root.appendChild(main);
  }

  _createEntry() {
    const entry = document.createElement('div');
    entry.setAttribute('id', `id-${this._prefix}-entry`);
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
    main.setAttribute('id', `id-${this._prefix}-main`);
    main.setAttribute('class', `main ${this._props.isReload ? '' : 'hide'}`);
    if (this._props.chatSize) {
      main.style.width = `${this._props.chatSize.width}px`;
      main.style.height = `${this._props.chatSize.height}px`;
    }
    this._createDraggable({
      handleElement: main,
      boundaryElement: this._getRoot(),
      onDrag: (e, options) => {
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

    if (this._props.isReload) {
      this._isVisibleWindow = isVisible;

      const root = this._getRoot();
      root && root.removeChild(document.getElementById(`id-${this._prefix}`));
      this._render();
      return;
    }

    const entry = document.getElementById(`id-${this._prefix}-entry`);
    const main = document.getElementById(`id-${this._prefix}-main`);
    if (isVisible) {
      main.classList.remove('hide');
      entry.classList.add('hide');
    } else {
      entry.classList.remove('hide');
      main.classList.add('hide');
    }
  }
}