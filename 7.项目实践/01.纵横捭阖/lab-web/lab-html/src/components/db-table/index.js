class JvtDbTable extends JvtHTMLComponent {
  _colums = [
    {name: '编号', key: 'id', width: '100px', type: 'text'},
    {name: '姓名', key: 'username', width: '100px', type: 'text'},
    {name: '密码', key: 'pwd', width: '100px', type: 'password'},
    {name: '生日', key: 'birth', width: '100px', type: 'date'},
    {name: '地址', key: 'addre', width: '200px', type: 'text'},
    // {name: '操作', key: 'operate', width: '100px', type: 'operate'}
  ];
  _datas = [
    {id: '101', username: '张小三', pwd: '123456', birth: '1995-08-07', addre: '上海市第九区黑色玫瑰'},
    {id: '110', username: '李某四', pwd: '123456', birth: '1995-08-07', addre: '北京市朝阳区艾欧尼亚'},
    {id: '001', username: '王老五', pwd: '123456', birth: '1995-08-07', addre: '广东省深圳市南山区'},
  ];
  _editData = {id: '101', username: '张老三', pwd: '123456', birth: '1995-08-07', addre: '上海市第九区黑色玫瑰'};
  _onChanged = (data) => undefined;

  static create(props) {
    return new JvtDbTable(props);
  }

  constructor(props) {
    super({ prefix: 'db-table' });

    const {
      rootId,
      colums, 
      datas,
      onChanged
    } = props || {};

    colums && (this._colums = colums);
    datas && (this._datas = datas);
    onChanged && (this._onChanged = onChanged);

    this._init(rootId);
  }

  _init = (rootId) => {
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
            ...this._colums, 
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

        this._datas.forEach(data => {// tr
          const tr = document.createElement('tr');
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

          this._colums.forEach(colum => {// td
            const td = document.createElement('td');
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

    {// <h3>新增数据</h3>
      const h = document.createElement('h3');
      h.innerText = '新增数据';
      dbTable.appendChild(h);
    }

    { // <form>
      const form = document.createElement('form');
      {// <table class="table table-hover table-bordered">
        const table = document.createElement('table');
        table.setAttribute('class', 'table table-hover table-bordered');

        this._colums.forEach(colum => {// tr
          const tr = document.createElement('tr');
          {// th
            const th = document.createElement('th');
            th.innerText = colum.name;
            tr.appendChild(th);
          }
          {// td
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.setAttribute('class', 'form-control');
            input.setAttribute('type', colum.type);
            input.setAttribute('id', this._getUniqueElement(`-${colum.key}`, 'id'));
            input.value = this._editData[colum.key];
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
    for (let j=0; j<items.length; j++){    
      if (!items[j].checked) {
        continue;
      }

      const node = items[j].parentNode.parentNode;
      listNode.removeChild(node);
      j--;
    }
  }

  handleClickDel = (event, data) => {

    this.handleChanged({
      type: '3',
      data: data,
      event: event
    });

    var node = event.target.parentNode.parentNode;
    var listNode = document.getElementById(this._getUniqueElement('-listTable', 'id'));
    listNode.removeChild(node);
  }

  handleClickModify = (event, data) => {
    this._editData = data;

    this._colums.forEach(colum => {
      const input = document.getElementById(this._getUniqueElement(`-${colum.key}`, 'id'));
      input && (input.value = this._editData[colum.key] || '');
    });
  }

  handleClickReset = (event) => {
    this.handleClickModify(event, {});
  }

  handleClickAdd = (event) => {
    alert("添加");
  }

  handleClickUpdate = (event) => {
    alert("更新");
  }
}