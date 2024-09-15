
const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

class DBAccess {
  _db = null;

  constructor() {
    this._db = null;
  }

  connect(dbPath) {
    this._db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to database: ', err);
        return;
      }
      console.log('Connected to database successfully');
    });
  }

  close() {
    if (!this._db) {
      return;
    }
    this._db.close((err) => {
      if (err) {
        console.error('Error closing database: ', err);
        return;
      }
      console.log('Database closed successfully');
    });
  }

  execute(sql, params, callback) {
    if (!this._db) {
      console.error('Database not connected');
      return;
    }

    this._db.run(sql, params, (err) => {
      if (err) {
        console.error('Error executing SQL: ', err);
        callback(err);
      } else {
        callback(null, this._db.lastID);
      }
    });
  }

  query(sql, params, callback) {
    if (!this._db) {
      console.error('Database not connected');
      return;
    }

    this._db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error executing SQL: ', err);
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }
}

module.exports = DBAccess;