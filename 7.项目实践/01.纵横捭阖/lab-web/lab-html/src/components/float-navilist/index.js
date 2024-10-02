class JvtFloatNavilist extends JvtHTMLComponent {
  _title = '存储选型';
  _datas = [
    // { id: 'cookie', name: 'cookie', desc: 'Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它用于存储用户的一些个人信息。Cookie 大小不超过4KB，且每次请求都会发送回服务器。' },
    // { id: 'window', name: 'window', desc: '' },
    // { id: 'localStorage', name: 'localStorage', desc: '' },
    // { id: 'sessionStorage', name: 'sessionStorage', desc: '' },
    // { id: 'indexedDB', name: 'indexedDB', desc: '' },
    // { id: 'sqlite', name: 'sqlite', desc: '' },
  ];
  _activeData = {};
  _onChanged = (data) => { };

  static create(props) {
    return new JvtFloatNavilist(props);
  }

  constructor(props) {
    super({prefix: 'float-navilist'});

    const {
      rootId,
      title,
      activeId,
      datas,
      onChanged
    } = props || {};

    title && (this._title = title);
    datas && (this._datas = datas);
    activeId && (this._activeData = this._getActivedData(activeId));
    onChanged && (this._onChanged = onChanged);

    this._init(rootId);
  }

  _getActivedData(id) {
    if (typeof id !== 'undefined') {
      return this._datas.find(item => item.id === id) || {};
    }
    return this._activeData;
  }

  _init(rootId) {
    const root = document.getElementById(rootId);

    const navilist = document.createElement('div');
    navilist.setAttribute('class', this._getUniqueElement('', 'class'));

    {
      // 标题
      const titleElement = document.createElement('div');
      titleElement.innerHTML = this._title;
      titleElement.setAttribute('class', 'title');
      navilist.appendChild(titleElement);

      const contentElement = document.createElement('div');
      contentElement.setAttribute('class', 'content');
      {
        // 列表
        const areaElement = document.createElement('div');
        areaElement.setAttribute('class', 'area');
        this._datas.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.innerHTML = `${item.name}`;
          itemElement.setAttribute('class', `item ${(item.id === this._activeData.id) ? 'active' : ''}`);
          itemElement.setAttribute('id', this._getUniqueElement(`-${item.id}`, 'id'));
          itemElement.onclick = () => this.handleClick(item);

          areaElement.appendChild(itemElement);
        });
        contentElement.appendChild(areaElement);

        // 描述
        const descData = this._activeData.desc || '';
        const descElement = document.createElement('div');
        descElement.setAttribute('class', 'desc');
        descElement.setAttribute('id', this._getUniqueElement('-desc', 'id'));
        descElement.innerHTML = typeof descData === 'string' ? descData : '';
        Array.isArray(descData) && descData.forEach(item => {
          const descItemElement = document.createElement('div');
          descItemElement.innerHTML = !!item.a ? `<a href="${item.a}" target="_blank">${item.text}</a>` : item.text;
          descElement.appendChild(descItemElement);
        });
        contentElement.appendChild(descElement);
      }
      navilist.appendChild(contentElement);
    }

    root && root.appendChild(navilist);
  }

  handleClick(data) {
    if (this._activeData.id === data.id) {
      return;
    }

    this._activeData = data;

    const activeElement = document.querySelector(`.item.active`);
    activeElement && activeElement.classList.remove('active');

    const clickedElement = document.querySelector(`#${this._getUniqueElement(`-${data.id}`, 'id')}`);
    clickedElement && clickedElement.classList.add('active');

    const descData = this._activeData.desc || '';
    if (descData) {
      const descElement = document.querySelector(`#${this._getUniqueElement('-desc')}`);
      descElement.innerHTML = typeof descData === 'string' ? descData : '';
      Array.isArray(descData) && descData.forEach(item => {
        const descItemElement = document.createElement('div');
        descItemElement.innerHTML = !!item.a ? `<a href="${item.a}" target="_blank">${item.text}</a>` : item.text;
        descElement.appendChild(descItemElement);
      });
    }


    this._onChanged(this._activeData);
  }
}