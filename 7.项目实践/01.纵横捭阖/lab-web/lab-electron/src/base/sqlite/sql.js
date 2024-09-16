const { JvtDBAccess } = require( './db');

class JvtSql {
  _dbAccess = new JvtDBAccess();

  async connect(dbPath) {
    return this._dbAccess.connect(dbPath);
  }

  async close() {
    return this._dbAccess.close();
  }

  async execute(sql) {
    return this._dbAccess.execute(sql);
  }

  async query(sql) {
    return this._dbAccess.query(sql);
  }

}

module.exports = {
  JvtSql
};