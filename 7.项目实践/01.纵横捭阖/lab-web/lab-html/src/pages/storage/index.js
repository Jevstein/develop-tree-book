
const TBStorageType = JvtUtils.enum({
	cookie: 'Cookie',
	window: 'window',
  localStorage: 'localStorage',
  sessionStorage:'sessionStorage',
  indexedDb: 'IndexedDB',
	sqlite: 'SQLite',
});

class TBOperBase {
	_colums = [];
	_datas = [];
	_storeType = TBStorageType.indexedDb;

	static create(props = {
		colums: [],
		datas: [],
		storeType: TBStorageType.indexedDb
	}) {
		switch (props.storeType) {
			case TBStorageType.indexedDb:
				return new TBOperIndexedDB(props);
			default:
				return new TBOperBase(props);
		}
	}

  constructor(props = {
		colums: [],
		datas: [],
		storeType: TBStorageType.indexedDb
	}) {
    this._colums = [...props.colums];
    this._datas = [...props.datas];
		this._storeType = props.storeType;
  }

	get colums() {
		return this._colums;
	}

	get datas() {
		return this._datas;
	}

	get storeType() {
		return this._storeType;
	}

	// 新增数据
	add(data) {
		this._datas.push(data);
	}

	// 删除数据
	delete(data) {
		const index = this._datas.indexOf(data);
		if (index > -1) {
			this._datas.splice(index, 1);
		}
	}

	// 更新数据
	update(data) {
		const index = this._datas.indexOf(data);
		if (index > -1) {
			this._datas[index] = data;
		}
	}

	// 清空数据
	clear() {
		this._datas = [];
	}

}

// IndexedDB 操作基类
class TBOperIndexedDB extends TBOperBase {
	_indexedDB = null;

	constructor(props = {
		colums: [],
		datas: [],
		storeType: StoreType.indexedDb
	}) {
		super(props);

		this._indexedDB = JvtIndexDB.create({
			dbName: "jvt-cache-db", // 数据库名
			tableName: "tb_user", // 表名
			keyPath: "id",  // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
			indexs: [{ name: "name", unique: false }], // 设置索引
		});

		this.init();
	}

	async init() {
		try {
			this._indexedDB.close();
			await this._indexedDB.open();

			if (this._indexedDB.hasTable()) {
				await this._indexedDB.read();


				this._datas.forEach(async (data) => {
					await this._indexedDB.add({data});
				});
				
			} else {
				// await this._indexedDB.createTable();

				this._datas.forEach(async (data) => {
					await this._indexedDB.add({data});
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
}