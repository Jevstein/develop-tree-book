

class BitmapSwitchPanel {
  _obj = undefined;

  constructor(props = {
    value: [],
    binaryLenth: 30,
    onChange,
    target,
  }) {
    this._obj = new JvtBitmapSwitch({
      ...props, 
      onChange: (data) => {
        const decimalElement = document.getElementById(`id-bitmap-view-decimal-${data.subIndex}`);
        const binaryElement = document.getElementById(`id-bitmap-view-binary-${data.subIndex}`);
        // const itemBtnElement = document.getElementById(`id-bitmap-item-btn-${data.index}`);

        const binary = Number(data.subValue).toString(2).padStart(props.binaryLenth, '0');
        decimalElement.innerHTML = data.subValue;
        binaryElement.innerHTML = binary.replace(/1/g, '<span class="on">1</span>');
        // itemBtnElement.classList.toggle('checked', data.subChecked);

        props?.onChange(data);
      }
    });
    this._obj && this._create(props.target);
  }

  _create(target) {
    const count = this._obj.getCount();
    const binaryLenth = this._obj.getBinaryLenth();

    const panelElement = document.createElement('div');
    panelElement.classList.add('bitmap-switch-panel');

    for (let i = 0; i < count; i++) {
      const viewElement = document.createElement('div');
      viewElement.classList.add('view');

      // 二进制文本
      const value = this._obj.getValueByIdx(i);
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
        const isChecked = this._obj.getChecked(index);

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
          const isChecked = this._obj.getChecked(index);
          this._obj.setChecked(index, !isChecked);
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

  queryChecked(index) {
    const isChecked = this._obj.getChecked(index);
    alert(`第 ${index} 个开关的状态: ${isChecked ? '开启' : '关闭'}!`);
  }
}