class JvtDbTable extends JvtHTMLComponent {
  _colums = [
    // {name: '编号', key: 'id', width: '100px', type: 'text'},
    // {name: '姓名', key: 'username', width: '100px', type: 'text'},
    // {name: '密码', key: 'pwd', width: '100px', type: 'password'},
    // {name: '生日', key: 'birth', width: '100px', type: 'date'},
    // {name: '地址', key: 'addre', width: '200px', type: 'text'},
    // // {name: '操作', key: 'operate', width: '100px', type: 'operate'}
  ];
  _datas = [
    // {id: '101', username: '张小三', pwd: '123456', birth: '1949-10-01', addre: '上海市第九区红色玫瑰'},
    // {id: '110', username: '李某四', pwd: '654321', birth: '1997-07-01', addre: '北京市朝阳区艾欧尼亚'},
    // {id: '001', username: '王老五', pwd: '234561', birth: '2008-08-08', addre: '广东省深圳市黑色玫瑰'},
    // {id: '100', username: '陈阿六', pwd: '345612', birth: '2024-09-25', addre: '广东省广州市白色玫瑰'},
  ];
  _onChanged = (data) => undefined;

  static create(props) {
    return new JvtDbTable(props);
  }

  constructor(props) {
    super({ prefix: 'db-table' });

    const {
      rootId,
      colums = this._colums, 
      datas = this._datas,
      editId = '101',
      onChanged
    } = props || {};

    this._colums = colums;
    onChanged && (this._onChanged = onChanged);

    const editData = datas.find(data => data.id === editId);

    this._init({rootId, colums, datas, editData});
  }

  _init = (props) => {

    const {
      rootId,
      colums, 
      datas,
      editData
    } = props || {};

    const root = document.getElementById(rootId);

    // <div class="ui-db-table" id="id-ui-db-table"></div>
    const dbTable = document.createElement('div');
    dbTable.setAttribute('class', this._getUniqueElement('', 'class'));

    {// <table class="table table-hover table-bordered" id="mytable"></table>
      const table = document.createElement('table');
      table.setAttribute('class', 'table table-hover table-bordered');

      {// <thead>
        const thead = document.createElement('thead');
        {// <tr>
          const tr1 = document.createElement('tr');
          [
            ...[{name: '选中', key: 'check', width: '100px'}],
            ...colums, 
            ...[{name: '操作', key: 'operate', width: '100px'}]
          ].forEach(colum => {// th
            const th = document.createElement('th');
            th.innerText = colum.name;
            // th.style.width = colum.width;
            tr1.appendChild(th);
          });
          thead.appendChild(tr1);

          const tr2 = document.createElement('tr');
          {// th
            const td1 = document.createElement('td');
            const input1 = document.createElement('input');
            input1.setAttribute('type', 'checkbox');
            input1.setAttribute('id', this._getUniqueElement(`-checkall`, 'id'));
            input1.onclick = (event) => this.handleClickCheckAll(event);
            td1.appendChild(input1);
            tr2.appendChild(td1);

            const td2 = document.createElement('td');
            td2.setAttribute('colspan', '6');
            const input2 = document.createElement('input');
            input2.setAttribute('class', 'btn btn-danger');
            input2.setAttribute('type', 'button');
            input2.setAttribute('value', '批量删除');
            input2.onclick = (event) => this.handleClickDelAll(event);
            td2.appendChild(input2);
            tr2.appendChild(td2);
          }
          thead.appendChild(tr2);
        }

        table.appendChild(thead);
      }

      {// <tbody>
        const tbody = document.createElement('tbody');
        tbody.setAttribute('id', this._getUniqueElement('-listTable', 'id'));

        datas.forEach((data, index) => {// tr
          const tr = document.createElement('tr');
          tr.setAttribute('id', this._getUniqueElement(`-tr-id-${data.id?? index}`, 'id'));
          {// td
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.setAttribute('class', this._getUniqueElement(`-checkbox`, 'class'));
            input.setAttribute('id', this._getUniqueElement(`-check-${data.id}`, 'id'));
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', this._getUniqueElement('-item', 'name'));
            // input.onclick = (event) => this.handleClickCheck(event, data);
            td.appendChild(input);

            tr.appendChild(td);
          }

          colums.forEach(colum => {// td
            const td = document.createElement('td');
            td.setAttribute('key', colum.key);
            td.innerText = data[colum.key];
            tr.appendChild(td);
          });

          {// td
            const td = document.createElement('td');
            {// input
              const input = document.createElement('input');
              input.setAttribute('class', 'btn btn-danger');
              input.setAttribute('type', 'button');
              input.setAttribute('value', '删除');
              input.onclick = (event) => this.handleClickDel(event, data);
              td.appendChild(input);
            }

            {// input
              const input = document.createElement('input');
              input.setAttribute('class', 'btn btn-info');
              input.setAttribute('type', 'button');
              input.setAttribute('value', '修改');
              input.onclick = (event) => this.handleClickModify(event, data);
              td.appendChild(input);
            }

            tr.appendChild(td);
          }

          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
      }

      dbTable.appendChild(table);
    }

    {// <h3>新增或编辑数据</h3>
      const h = document.createElement('h3');
      h.innerText = '新增或编辑数据';
      dbTable.appendChild(h);
    }

    { // <form>
      const form = document.createElement('form');
      {// <table class="table table-hover table-bordered">
        const table = document.createElement('table');
        table.setAttribute('class', 'table table-hover table-bordered');

        colums.forEach(colum => {// tr
          const tr = document.createElement('tr');
          {// th
            const th = document.createElement('th');
            th.innerText = colum.name;
            tr.appendChild(th);
          }
          {// td
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.setAttribute('class', `form-control ${this._getUniqueElement('-form-control', 'class')}`);
            input.setAttribute('id', this._getUniqueElement(`-${colum.key}`, 'id'));
            input.setAttribute('type', colum.type);
            input.setAttribute('key', colum.key);
            input.value = editData[colum.key];
            td.appendChild(input);
            tr.appendChild(td);
          }
          table.appendChild(tr);
        });

        { // tr
          const tr = document.createElement('tr');
          {// td
            const td = document.createElement('td');
            td.setAttribute('colspan', '2');
            {// input
              const input = document.createElement('input');
              input.setAttribute('type', 'button');
              input.setAttribute('value', '重置');
              input.setAttribute('class', 'btn btn-primary');
              input.setAttribute('id', 'reset');
              input.onclick = (event) => this.handleClickReset(event);
              td.appendChild(input);
            }
            {// input
              const input = document.createElement('input');
              input.setAttribute('type', 'button');
              input.setAttribute('value', '添加');
              input.setAttribute('class', 'btn btn-success');
              input.setAttribute('id', 'add');
              input.onclick = (event) => this.handleClickAdd(event);
              td.appendChild(input);
            }
            {// input
              const input = document.createElement('input');
              input.setAttribute('type', 'button');
              input.setAttribute('value', '更新');
              input.setAttribute('class', 'btn btn-info');
              input.setAttribute('id', 'update');
              input.onclick = (event) => this.handleClickUpdate(event);
              td.appendChild(input);
            }
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }

        form.appendChild(table);
      }
      dbTable.appendChild(form);
    }

    root.appendChild(dbTable);
  }

  _getEditData = () => {
    const editData = {};
    const formItems = document.querySelectorAll(`.${this._getUniqueElement('-form-control', 'class')}`);
    for (const item of formItems) {
      const key = item.getAttribute('key');
      editData[key] = item.value;
    }
    return editData;
  }

  handleChanged = (data = {
    type: '1', // 1:新增 2:修改 3:删除
    data: undefined, // 新增、修改或删除的数据
    event: undefined // 事件对象
  } ) => {
    if (this._onChanged === undefined) {
      return true;
    }

    return this._onChanged(data);
  }

  handleClickCheckAll = (event) => {
    const items = document.getElementsByName(this._getUniqueElement('-item', 'name'));
    for (let j=0; j<items.length; j++){    
      items[j].checked = event.target.checked;
    }
  }
  
  handleClickDelAll = (event) => {
    const listNode = document.getElementById(this._getUniqueElement('-listTable'));
    const items = document.getElementsByName(this._getUniqueElement('-item', 'name'));

    const datas = [];
    const nodes = [];

    for (const item of items){    
      if (!item.checked) {
        continue;
      }

      const node = item.parentNode.parentNode;
      nodes.push(node);

      const data = {};
      const children = node.children;
      for (const child of children) {
        const key = child.getAttribute('key');
        key && (data[key] = child.innerText);
      }
      datas.push(data);
    }

    this.handleChanged({
      type: '3',
      data: datas,
      event: event
    });

    for (let i=nodes.length-1; i>=0; i--){
      listNode.removeChild(nodes[i]);
    }


    const node = document.getElementById(this._getUniqueElement(`-checkall`, 'id'));
    node.checked = false;
  }

  handleClickDel = (event, data) => {

    this.handleChanged({
      type: '3',
      data: [data],
      event: event
    });

    var node = event.target.parentNode.parentNode;
    var listNode = document.getElementById(this._getUniqueElement('-listTable', 'id'));
    listNode.removeChild(node);
  }

  handleClickModify = (event, data) => {
    this._colums.forEach(colum => {
      const input = document.getElementById(this._getUniqueElement(`-${colum.key}`, 'id'));
      input && (input.value = data[colum.key] || '');
    });
  }

  handleClickReset = (event) => {
    this.handleClickModify(event, {});
  }

  handleClickAdd = (event) => {

    const editData= this._getEditData();

    this.handleChanged({
      type: '1',
      data: editData,
      event: event
    });

    const listNode = document.getElementById(this._getUniqueElement('-listTable', 'id'));
    const tr = document.createElement('tr');
    tr.setAttribute('id', this._getUniqueElement(`-tr-id-${editData.id?? index}`, 'id'));
    {// td
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.setAttribute('class', this._getUniqueElement(`-checkbox`, 'class'));
      input.setAttribute('id', this._getUniqueElement(`-check-${editData.id}`, 'id'));
      input.setAttribute('type', 'checkbox');
      input.setAttribute('name', this._getUniqueElement('-item', 'name'));
      // input.onclick = (event) => this.handleClickCheck(event, data);
      td.appendChild(input);

      tr.appendChild(td);
    }

    this._colums.forEach(colum => {// td
      const td = document.createElement('td');
      td.setAttribute('key', colum.key);
      td.innerText = editData[colum.key];
      tr.appendChild(td);
    });

    {// td
      const td = document.createElement('td');
      {// input
        const input = document.createElement('input');
        input.setAttribute('class', 'btn btn-danger');
        input.setAttribute('type', 'button');
        input.setAttribute('value', '删除');
        input.onclick = (event) => this.handleClickDel(event, editData);
        td.appendChild(input);
      }

      {// input
        const input = document.createElement('input');
        input.setAttribute('class', 'btn btn-info');
        input.setAttribute('type', 'button');
        input.setAttribute('value', '修改');
        input.onclick = (event) => this.handleClickModify(event, editData);
        td.appendChild(input);
      }

      tr.appendChild(td);
    }

    listNode.appendChild(tr);
  }

  handleClickUpdate = (event) => {
    const editData = {};
    const formItems = document.querySelectorAll(`.${this._getUniqueElement('-form-control', 'class')}`);
    for (const item of formItems) {
      const key = item.getAttribute('key');
      editData[key] = item.value;
    }

    const node = document.getElementById(this._getUniqueElement(`-tr-id-${editData.id}`, 'id'));
    if (!node) {
      alert('数据不存在，不允许更新');
      return;
    }

    this.handleChanged({
      type: '2',
      data: editData,
      event: event
    });

    const children = node.children;
    for (const child of children) {
      const key = child.getAttribute('key');
      (typeof editData[key] !== 'undefined') && (child.innerText = editData[key]);
    }

  }
}