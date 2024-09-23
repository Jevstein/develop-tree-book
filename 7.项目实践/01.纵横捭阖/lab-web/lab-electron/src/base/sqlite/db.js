
const sqlite3 = require('sqlite3').verbose();

class JvtDBAccess {
  _db = null;

  constructor() {
    this._db = null;
  }

  /**
   * 连接数据库
   * @param {*} dbPath 
   * @returns promise {
   *  data: {},
   *  ret: {
   *    code: 0,
   *    msg: 'success'
   *  }
   * }
   */
  async connect(dbPath) {
    return new Promise((resolve, reject) => {
      this._db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('failed to connect database: ', err);
          this._db = null;
          resolve({ret: { code: -1,  msg: err }});
          return;
        }

        console.log('Connected to database successfully');
        resolve({ret: { code: 0, msg: 'success' }});
      });
    });
  }

  /**
   * 关闭数据库连接
   * @returns promise {
   *  data: {},
   *  ret: {
   *    code: 0,
   *    msg: 'success'
   *  }
   * }
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        resolve({ret: { code: -1,  msg: 'Database is not connected' }});
        return;
      }

      this._db.close((err) => {
        if (err) {
          console.error('failed to close database: ', err);
          resolve({ret: { code: -2,  msg: err }});
          return;
        }
        console.log('Database closed successfully');
        resolve({ret: { code: 0, msg: 'success' }});
      });
    });
  }

  /**
   * 执行SQL语句
   * @param {*} sql 
   * @param {*} params 
   * @returns promise {
   *  data: {
   *    lastID: number,
   *    changes: number
   *  },
   *  ret: {
   *    code: 0,
   *    msg: 'success'
   *  }
   * }
   */
  async execute(sql) {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        resolve({ret: { code: -1,  msg: 'Database is not connected', sql }});
        return;
      }

      this._db.run(sql, (err) => {
        if (err) {
          console.error('failed to execute SQL: ', err);
          resolve({ret: { code: -2,  msg: err, sql }});
          return;
        }

        resolve({
          ret: { code: 0, msg: 'success', sql }
        });
      });
    });
  }

  /**
   * 查询SQL语句
   * @param {*} sql 
   * @param {*} params 
   * @returns promise {
   *  data: {
   *    rows: []
   *  },
   *  ret: {
   *    code: 0,
   *    msg: 'success'
   *  }
   * }
   */
  async query(sql) {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        resolve({ret: { code: -1,  msg: 'Database is not connected', sql }});
        return;
      }

      this._db.all(sql, (err, rows) => {
        if (err) {
          console.error('failed to query SQL: ', err);
          resolve({ret: { code: -2,  msg: err, sql }});
          return;
        }

        resolve({
          data: {
            rows: rows
          },
          ret: { code: 0, msg: 'success', sql }
        });
      });
    });
  }

  /**
   * 批量执行SQL语句
   * @param {*} funcs 
   * @returns promise {
   *  data: {},
   *  ret: {
   *    code: 0,
   *    msg: 'success'
   *  }
   * }
   */
  async serialize(funcs) {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        resolve({ret: { code: -1,  msg: 'Database is not connected' }});
        return;
      }

      this._db.serialize(async () => {
        const datas = [];
        for (let func of funcs) {
          const result = await func();
          datas.push(result);
        }

        resolve({
          datas,
          ret: { code: 0, msg: 'success' }}
        );
      });
    });
  }
}

module.exports = {
  JvtDBAccess
};