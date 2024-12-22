
class BitmapSwitchDirector {
  _core = undefined;
  _activeItemIndex = undefined;
  _lastBlinkStop = undefined;

  static create(target) {
    return new BitmapSwitchDirector(target);
  }

  constructor(target) {
    this._create(target);
  }

  _create(target) {
    const directorElement = document.createElement('div');
    directorElement.classList.add('bitmap-switch-director');
    {
      // settings
      const settingsElement = document.createElement('div');
      settingsElement.classList.add('settings');
      {
        {
          const itemElement = document.createElement('div');
          itemElement.classList.add('item');
          itemElement.innerHTML = `开关值：`;
          {
            const textElement = document.createElement('input');
            textElement.classList.add('bitmap-text');
            textElement.setAttribute('id', 'id-bitmap-text');
            textElement.setAttribute('type', 'text');
            textElement.setAttribute('value', _jvt_bitmap_data_);
            // textElement.setAttribute('onchange', 'handleChangeBitmapPreview()');
            itemElement.onchange = () => this.handleChangeBitmapPreview();
            itemElement.appendChild(textElement);
          }
          itemElement.innerHTML += ` 二进制位数：`;
          {
            const binaryElement = document.createElement('input');
            binaryElement.classList.add('bitmap-binary');
            binaryElement.setAttribute('id', 'id-bitmap-binarylen');
            binaryElement.setAttribute('title', '指定开关值每项的二进制位数。因js仅支持32位整数，且最高位为符号位，所以最大值为31，为了UI整齐，故此处默认30');
            binaryElement.setAttribute('type', 'number');
            binaryElement.setAttribute('value', '30');
            binaryElement.setAttribute('min', '4');
            binaryElement.setAttribute('max', '64');
            // binaryElement.setAttribute('onchange', 'handleChangeBitmapPreview()');
            itemElement.onchange = () => this.handleChangeBitmapPreview();
            itemElement.appendChild(binaryElement);
          }
          settingsElement.appendChild(itemElement);
        }
        {
          const itemElement = document.createElement('div');
          itemElement.classList.add('item');
          itemElement.innerHTML = `第几位：`;
          {
            const indexElement = document.createElement('input');
            indexElement.classList.add('bitmap-index');
            indexElement.setAttribute('id', 'id-bitmap-index');
            indexElement.setAttribute('title', '从0开始');
            indexElement.setAttribute('type', 'text');
            indexElement.setAttribute('value', '22');
            // indexElement.setAttribute('onchange', 'handleChangeBitmapPreview()');
            itemElement.onchange = () => this.handleChangeBitmapPreview();
            itemElement.appendChild(indexElement);

            const queryBtnElement = document.createElement('div');
            queryBtnElement.classList.add('query-btn');
            queryBtnElement.onclick = () => this.handleClickQuery();
            queryBtnElement.innerHTML = `查询`;
            itemElement.appendChild(queryBtnElement);
          }
          settingsElement.appendChild(itemElement);
        }
      }
      directorElement.appendChild(settingsElement);

      // preview
      const previewElement = document.createElement('div');
      previewElement.classList.add('preview');
      previewElement.setAttribute('id', 'id-bitmap-preview');
      // {
      //   this._createPreviewPanel(previewElement);
      // }
      directorElement.appendChild(previewElement);
    }
    target.appendChild(directorElement);

    this._createPreview();
  }

  _createPreview() {
    const textElement = document.getElementById("id-bitmap-text");
    const binaryLenthElement = document.getElementById("id-bitmap-binarylen");
    const previewElement = document.getElementById("id-bitmap-preview");
    previewElement.innerHTML = "";

    this._core = new JvtBitmapSwitch({
      value: textElement.value,
      binaryLenth: binaryLenthElement.value,
      onChange: (data) => this.handleChangeSwitch(data),
    });

    if (!this._core) {
      return;
    }

    this._createPreviewNavi(previewElement);
    this._createPreviewPanel(previewElement);
  }

  _createPreviewNavi(target) {
    const count = this._core.getCount();
    const binaryLenth = this._core.getBinaryLenth();

    const naviElement = document.createElement('div');
    naviElement.classList.add('navi');
    for (let i = 0; i < count; i++) {
      const viewElement = document.createElement('div');
      viewElement.classList.add('view');
      viewElement.setAttribute('id', `id-bitmap-navi-view-${i}`);
      viewElement.onclick = () => {
        const nowActiveElement = document.getElementById(`id-bitmap-navi-view-${i}`);
        const lastActiveElement = document.getElementById(`id-bitmap-navi-view-${this._activeItemIndex}`);
        const nowPanelViewElement = document.getElementById(`id-bitmap-view-${i}`);

        if (typeof(this._activeItemIndex) !== 'undefined') {
          this._lastBlinkStop && this._lastBlinkStop(true);
          lastActiveElement && lastActiveElement.classList.remove('active');
        }

        nowActiveElement.classList.add('active');
        this._activeItemIndex = i;

        nowPanelViewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this._lastBlinkStop = this._blinkElement(nowPanelViewElement, 100, 1000);
      }

      const badgeElement = document.createElement('div');
      badgeElement.classList.add('group-badge');
      badgeElement.innerHTML = i;
      viewElement.appendChild(badgeElement);

      // 二进制文本
      const value = this._core.getValueByIdx(i);
      const itemElement = document.createElement('div');
      itemElement.classList.add('item');
      itemElement.setAttribute('id', `id-bitmap-navi-item-${i}`);
      itemElement.innerHTML = ``;
      {
        const decimalElement = document.createElement('div');
        decimalElement.classList.add('decimal');
        decimalElement.setAttribute('id', `id-bitmap-navi-decimal-${i}`);
        decimalElement.innerHTML = value;
        itemElement.appendChild(decimalElement);

        const binary = Number(value).toString(2).padStart(binaryLenth, '0');

        const binaryElement = document.createElement('div');
        binaryElement.classList.add('binaryElement');
        binaryElement.setAttribute('id', `id-bitmap-navi-binary-${i}`);
        binaryElement.innerHTML = binary.replace(/1/g, '<span class="on">1</span>');
        itemElement.appendChild(binaryElement);
      }
      viewElement.appendChild(itemElement);
      naviElement.appendChild(viewElement);
    }
    target.appendChild(naviElement);

    setTimeout(() => {
      const headerElement = document.getElementById(`id-bitmap-navi-binary-${0}`);
      naviElement.style.width = headerElement.offsetWidth + 32 + 'px';
    }, 10);
  }

  _createPreviewPanel(target) {
    const count = this._core.getCount();
    const binaryLenth = this._core.getBinaryLenth();

    const panelElement = document.createElement('div');
    panelElement.classList.add('panel');

    for (let i = 0; i < count; i++) {
      const viewElement = document.createElement('div');
      viewElement.classList.add('view');
      viewElement.setAttribute('id', `id-bitmap-view-${i}`);

      const badgeElement = document.createElement('div');
      badgeElement.classList.add('group-badge');
      badgeElement.innerHTML = i;
      viewElement.appendChild(badgeElement);

      // 二进制文本
      const value = this._core.getValueByIdx(i);
      const headerElement = document.createElement('div');
      headerElement.classList.add('item-header');
      headerElement.setAttribute('id', `id-bitmap-view-header-${i}`);
      // headerElement.innerHTML = `${value}</br>${Number(value).toString(2).padStart(binaryLenth, '0')}`;
      headerElement.innerHTML = ``;
      {
        const decimalElement = document.createElement('div');
        decimalElement.classList.add('decimal');
        decimalElement.setAttribute('id', `id-bitmap-view-decimal-${i}`);
        decimalElement.innerHTML = value;
        headerElement.appendChild(decimalElement);

        const binary = Number(value).toString(2).padStart(binaryLenth, '0');

        const binaryElement = document.createElement('div');
        binaryElement.classList.add('binaryElement');
        binaryElement.setAttribute('id', `id-bitmap-view-binary-${i}`);
        binaryElement.innerHTML = binary.replace(/1/g, '<span class="on">1</span>');
        headerElement.appendChild(binaryElement);
      }
      viewElement.appendChild(headerElement);

      // 开关集合
      const bodyElement = document.createElement('div');
      bodyElement.classList.add('item-body');
      bodyElement.style.maxWidth = '0px';
      setTimeout(() => {
        const headerElement = document.getElementById(`id-bitmap-view-header-${i}`);
        bodyElement.style.maxWidth = headerElement.offsetWidth + 'px';
      }, 10);
      for (let j = 0; j < binaryLenth; j++) {
        const index = i * binaryLenth + j;
        const isChecked = this._core.getChecked(index);

        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.setAttribute('id', `id-bitmap-item-btn-${index}`);
        isChecked && itemElement.classList.add('checked');
        itemElement.innerHTML = `${isChecked ? '开启' : '关闭'}(${(j + 1).toString().padStart(2, '0')})`;
        const funcCreatebadge = () => {
          const badgeElement = document.createElement('div');
          badgeElement.classList.add('badge');
          badgeElement.innerHTML = index;
          itemElement.appendChild(badgeElement);
        }
        itemElement.onclick = () => {
          const isChecked = this._core.getChecked(index);
          this._core.setChecked(index, !isChecked);
          itemElement.innerHTML = `${!isChecked ? '开启' : '关闭'}(${(j + 1).toString().padStart(2, '0')})`;
          itemElement.classList.toggle('checked', !isChecked);

          funcCreatebadge();
        };
        funcCreatebadge();

        bodyElement.appendChild(itemElement);
      }
      viewElement.appendChild(bodyElement);

      panelElement.appendChild(viewElement);
    }

    target.appendChild(panelElement);
  }

  _blinkElement(element, duration, timeout) {
    let active = false;
    let interval = null;
    let timer = null;

    interval = setInterval(function() {
      active = !active;
      if (active) {
        // element.style.opacity = 1;
        const activeBorderElement = document.createElement('div');
        activeBorderElement.classList.add('active-border');
        element.appendChild(activeBorderElement);
      } else {
        // element.style.opacity = 0.5;
        const activeBorderElement = element.querySelector('.active-border');
        activeBorderElement && element.removeChild(activeBorderElement);
      }
    }, duration);

    const stop = (isRemove = false) => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // element.style.opacity = 1;

      const activeBorderElement = element.querySelector('.active-border');
      if (isRemove) {
        activeBorderElement && element.removeChild(activeBorderElement);
        return;
      }

      if (!activeBorderElement) {
        const activeBorderElement = document.createElement('div');
        activeBorderElement.classList.add('active-border');
        element.appendChild(activeBorderElement);
      }
    }

    timer = setTimeout(() => stop(), timeout);
   
    return stop;
  }

  handleChangeSwitch(data) {
    console.log('onSwitchChange', data);

    const binary = Number(data.subValue).toString(2).padStart(this._core.getBinaryLenth(), '0');

    const indexElement = document.getElementById("id-bitmap-text");
    const decimalElement = document.getElementById(`id-bitmap-view-decimal-${data.subIndex}`);
    const binaryElement = document.getElementById(`id-bitmap-view-binary-${data.subIndex}`);
    const decimalNaviElement = document.getElementById(`id-bitmap-navi-decimal-${data.subIndex}`);
    const binaryNaviElement = document.getElementById(`id-bitmap-navi-binary-${data.subIndex}`);

    indexElement.value = data.value;
    decimalElement.innerHTML = data.subValue;
    binaryElement.innerHTML = binary.replace(/1/g, '<span class="on">1</span>');
    decimalNaviElement.innerHTML = data.subValue;
    binaryNaviElement.innerHTML = binary.replace(/1/g, '<span class="on">1</span>');
  }

  handleChangeBitmapPreview() {
    this._createPreview();
  }

  handleClickQuery() {
    const indexElement = document.getElementById("id-bitmap-index");
    const index = indexElement.value;
    const isChecked = this._core.getChecked(index);
    alert(`第 ${index} 个开关的状态: ${isChecked ? '开启' : '关闭'}!`);
  }
}

/**  IntersectionObserver */

// const container = document.getElementById('container');
// const itemCount = 1000000; // 假设有百万级的元素
 
// // 创建一个用于填充DOM的函数
// function renderItems(start, end) {
//   container.innerHTML = ''; // 清空容器内容
//   for (let i = start; i < end; i++) {
//     const element = document.createElement('div');
//     element.textContent = `Item ${i}`;
//     container.appendChild(element);
//   }
// }
 
// // 创建一个IntersectionObserver实例
// const observer = new IntersectionObserver((entries) => {
//   if (entries[0].isIntersecting) {
//     const visibleItems = Math.ceil(container.clientHeight / entry.target.clientHeight);
//     const start = Math.floor(entries[0].target.id);
//     const end = start + visibleItems;
//     renderItems(start, end);
//   }
// }, {
//   root: null,
//   threshold: 0.5
// });
 
// // 监听容器的滚动事件
// container.addEventListener('scroll', () => {
//   const firstVisibleItem = Math.floor(container.scrollTop / container.firstElementChild.clientHeight);
//   const placeholder = document.createElement('div');
//   placeholder.id = firstVisibleItem;
//   container.textContent = ''; // 清空容器内容
//   container.appendChild(placeholder);
//   observer.observe(placeholder);
// });
 
// // 初始化
// renderItems(0, 10); // 假设初始显示前10个元素