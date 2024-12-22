/*
 * @Author: Jevstein
 * @Date: 2021-08-19 14:52:29
 * @LastEditTime: 2021-08-19 14:52:29
 * @LastEditors: Jevstein
 * @Description: 用于显示各种url导航的组件
 */

class JvtUrlNavi extends JvtHTMLComponent {
  _data = {
    // 左侧栏
    left: [
      {
        title: '高频网站', show: 12,
        items: [
          { name: 'github-Jevstein', url: 'https://github.com/jevstein' },
          { name: 'gitlab-emessage', url: 'http://10.12.101.12/EM/weapp-emmessage' },
          { name: 'Jenkins-emessage', url: 'http://10.12.101.25:8080/job/weapp-emmessage' },
        ],
      },
    ],
    // 中间栏
    center: [
      {
        title: '在线工具', show: 20,
        items: [
          { name: 'sojson-home', url: 'https://www.sojson.com/simple_json.html', icon: 'https://cdn.sojson.com/sojson/favicon16.png' },
          { name: 'sojson-yasuo', url: 'https://www.sojson.com/yasuo.html', icon: 'https://cdn.sojson.com/sojson/favicon16.png' },
          { name: 'c++ 在线运行', url: 'https://cpp.sh' },
        ],
      },
    ],
  }

  static create(props) {
    return new JvtUrlNavi(props);
  }

  constructor(props) {
    super({ prefix: 'url-navi' });   
    
    const {
      rootId,
      data,
    } = props || {};

    data && (this._data = data);

    this._init(rootId ? document.getElementById(rootId) : document);
  }

  _init(root) {
    const urlNaviElement = document.createElement('div');
    urlNaviElement.setAttribute('class', 'weblab-urlnavi');
    {
      const leftElement = document.createElement('div');
      leftElement.setAttribute('class', 'weblab-urlnavi-left');
      urlNaviElement.appendChild(leftElement);

      const centerElement = document.createElement('div');
      centerElement.setAttribute('class', 'weblab-urlnavi-center');
      urlNaviElement.appendChild(centerElement);

      const rightElement = document.createElement('div');
      rightElement.setAttribute('class', 'weblab-urlnavi-right');
      urlNaviElement.appendChild(rightElement);
    }
    root.appendChild(urlNaviElement);

    const urlNaviMaskElement = document.createElement('div');
    urlNaviMaskElement.setAttribute('class', 'weblab-urlnavi-mask');
    urlNaviMaskElement.onclick = (event) => this.handleClickMask(event);
    root.appendChild(urlNaviMaskElement);

    this._update();
  }

  _update() {
    Object.keys(this._data).forEach(key => {
      const parentElement = document.querySelector(`.weblab-urlnavi-${key}`);
      parentElement.innerHTML = '';

      this._data[key].forEach((box, boxIndex) => {
        const id = `${key}-${boxIndex}`;
        const boxElement = document.createElement('div');
        boxElement.setAttribute('class', 'box');

        const titleElement = document.createElement('div');
        titleElement.innerHTML = box.title;
        titleElement.setAttribute('class', 'title');
        boxElement.appendChild(titleElement);

        const isMore = (box.show > 0) && (box.items.length > box.show);
        const showItems = isMore ? box.items.slice(0, box.show) : box.items;
        const moreItems = isMore ? box.items.slice(box.show) : [];

        // 1、面板显示
        const areaElement = document.createElement('div');
        areaElement.setAttribute('class', 'area');
        showItems.forEach(item => {
          const subname = item.subname ? `\n\n${item.subname}` : '';
          const itemElement = document.createElement('div');
          itemElement.title = `${item.name}:\n\n${item.url}${subname}`
          itemElement.setAttribute('class', 'item');

          // logo
          if (item.url && item.url.indexOf('http') === 0) {
            const urlObj = new URL(item.url);
            const img = new Image();
            img.className = "icon";
            img.src = item.icon || `${urlObj.origin}/favicon.ico`;
            img.width = '16';
            img.height = '16';
            itemElement.appendChild(img);
          }

          // a标签
          const aElement = document.createElement('a');
          aElement.innerHTML = item.name;
          aElement.setAttribute('href', item.url);
          aElement.setAttribute('target', '_blank');
          itemElement.appendChild(aElement);

          areaElement.appendChild(itemElement);

          boxElement.appendChild(areaElement);
        });

        // 2、更多显示
        if (moreItems.length > 0) {
          const menuId = `menu-${id}`;
          // 更多
          const moreElement = document.createElement('div');
          moreElement.innerHTML = '...';
          moreElement.setAttribute('class', 'more');
          moreElement.setAttribute('title', '更多');
          moreElement.setAttribute('data-id', menuId);
          moreElement.onclick = (event) => this.handleClickMore(event);
          boxElement.appendChild(moreElement);
          // 菜单
          const areaElement = document.createElement('div');
          areaElement.setAttribute('class', 'weblab-urlnavi-menu');
          areaElement.setAttribute('id', menuId);
          moreItems.forEach(item => {
            const subname = item.subname ? `${item.subname}` : '';
            const itemElement = document.createElement('div');
            itemElement.title = `${item.name}:\n${item.url}\n${item.subname}`
            itemElement.setAttribute('class', 'item');

            // logo
            const urlObj = new URL(item.url);
            const img = new Image();
            img.className = "icon";
            img.src = item.icon || `${urlObj.origin}/favicon.ico`;
            img.width = '16';
            img.height = '16';
            itemElement.appendChild(img);

            // a标签
            const aElement = document.createElement('div');
            aElement.innerHTML = item.name;
            aElement.setAttribute('class', 'a');
            aElement.setAttribute('data-url', item.url);
            aElement.onclick = (event) => this.handleClickUrl(event);
            itemElement.appendChild(aElement);

            areaElement.appendChild(itemElement);

            boxElement.appendChild(areaElement);
          });
        }

        parentElement.appendChild(boxElement);
      })
    });
  }

  hideMenu() {
    const maskElement = document.querySelector('.weblab-urlnavi-mask');
    maskElement.classList.remove('is-mask');

    const elements = document.getElementsByClassName('weblab-urlnavi-menu');
    for (const element of elements) {
      if (element.getAttributeNode('class').value.indexOf('is-menu') > -1) {
        element.classList.remove('is-menu');
        return;
      }
    }
  }

  handleClickMore(event) {
    const maskElement = document.querySelector('.weblab-urlnavi-mask');

    const id = event.target.getAttributeNode('data-id').value;
    const menuElement = document.getElementById(id);

    const isMenu = menuElement.getAttributeNode('class').value.indexOf('is-menu') > -1;
    if (isMenu) {
      menuElement.classList.remove('is-menu');
      maskElement.classList.remove('is-mask');
    } else {
      menuElement.classList.add('is-menu');
      maskElement.classList.add(`is-mask`);
    }
  }

  handleClickMask(event) {
    this.hideMenu();
  }

  handleClickUrl(event) {
    const url = event.target.getAttributeNode('data-url').value;
    window.open(url, "_blank", "noopener=yes,noreferrer=yes");

    this.hideMenu();
  }
}