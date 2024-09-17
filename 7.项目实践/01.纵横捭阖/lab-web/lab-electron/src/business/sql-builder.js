
const { JvtSql } = require( '../base/sqlite/sql');


class SqlBuilder extends JvtSql {
  static create(props) {
    return new SqlBuilder(props);
  }

  constructor(props) {
    super(props);
  }

  async debugger(data) {
    const { sqls } = data;
    const sqlResults = [];
    return new Promise(async (resolve) => {
      for (let sql of sqls) {
        sql = sql?.trim()?.toUpperCase();
  
        if (sql.indexOf('SELECT') === 0) {
          const result = await this.query(sql);
          sqlResults.push({
            sqlCmd: sql,
            sqlRes: {
              data: result?.ret?.code === 0 ? result.data : result.ret.msg,
              errMsg: result?.ret?.code === 0 ? '' : result.ret.msg
            },
          });
          continue;
        }
  
        const result = await this.execute(sql);
        sqlResults.push({
          sqlCmd: sql,
          sqlRes: {
            data: result?.ret?.code === 0 ? result.data || '执行成功!' : '',
            errMsg: result?.ret?.code === 0 ? '' : result.ret.msg
          }
        });
      }

      resolve(sqlResults);
    });
  }

}

module.exports = {
  SqlBuilder,
};