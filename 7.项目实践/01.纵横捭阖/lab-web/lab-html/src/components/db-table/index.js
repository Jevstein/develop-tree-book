class JvtDbTable extends JvtHTMLComponent {
  _colums = [
    {name: '编号', key: 'num', width: '100px', type: 'text'},
    {name: '姓名', key: 'username', width: '100px', type: 'text'},
    {name: '密码', key: 'pwd', width: '100px', type: 'password'},
    {name: '生日', key: 'birth', width: '100px', type: 'date'},
    {name: '地址', key: 'addre', width: '200px', type: 'text'},
    // {name: '操作', key: 'operate', width: '100px', type: 'operate'}
  ];
  _datas = [
    {num: '100806131234', username: '张三', pwd: '123456', birth: '1995-08-07', addre: '上海市黄浦区老西门'},
    {num: '100806131235', username: '李四', pwd: '123456', birth: '1995-08-07', addre: '北京市朝阳区艾欧尼亚'},
    {num: '100806131236', username: '王五', pwd: '123456', birth: '1995-08-07', addre: '广东省深圳市南山区'},
  ];
  _editData = {num: '100806131234', username: '张三', pwd: '123456', birth: '1995-08-07', addre: '上海市黄浦区老西门'};
  _onChanged = (data) => {};
  _checkedDatas = [];

  static create(props) {
    return new JvtDbTable(props);
  }

  constructor(props) {
    super();

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

    // <div class="db-table" id="id-db-table"></div>
    const dbTable = document.createElement('div');
    dbTable.setAttribute('class', 'db-table');
    // dbTable.onclick = (event) => this.handleClickDirectroy(event, node);
    // dbTable.ondblclick = (event) => this.handleDblClickDirectroy(event, node);

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
        tbody.setAttribute('id', 'listTable');

        this._datas.forEach(data => {// tr
          const tr = document.createElement('tr');
          {// td
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', 'item');
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
            input.setAttribute('id', colum.key);
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

  handleChanged = (data) => {
    this._onChanged(data);
  }

  handleClickCheckAll = (event) => {
    alert("handleClickCheckAll");
  }
  
  handleClickDelAll = (event) => {
    alert("删除全部");
  }

  handleClickDel = (event, data) => {
    // alert("删除");

    var oParentnode = event.parentNode.parentNode;
    var olistTable = document.getElementById('listTable');
    olistTable.removeChild(oParentnode);
  }

  handleClickModify = (event, data) => {
    this._editData = data;

    this._colums.forEach(colum => {
      const input = document.getElementById(colum.key);
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