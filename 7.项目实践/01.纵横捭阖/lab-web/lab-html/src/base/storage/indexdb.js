/**
 * @created : 2024/10/01
 * @author  : Jevstein
 * @desc    : indexedDB
 */

const indexDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

class JvtIndexDB {
	static create(props) {
		return new JvtIndexDB(props);
	}

	constructor(props = {
		dbName: "jvt-cache-db", // 数据库名
		tableName: "tb_user", // 表名
		keyPath: "id",  // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
		indexs: [], // 设置索引
	}) {
		this._db = null; // 数据库: IDBOpenDBRequest 对象
		this._transaction = null; // 事务
		this._dbName = props.dbName; // 数据库名
		this._tableName = props.tableName; // 表名
		this._dbVersion = '1.0'; // 数据库版本: 指定数据库版本（整数）。如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为 1。当你想要更改数据库格式（比如增加对象存储，非增加记录），必须指定更高版本
		this._keyPath = props.keyPath; // 设置主键
		this._indexs = props.indexs; // 设置索引
	}
	
	/**
	 * 打开数据库
	 * @param {Object} option 参数
	 * {
	 *	name: "jvt-cache-db", // 数据库名
	 *	version: 1,	// 数据库版本: 指定数据库版本（整数）。如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为 1。当你想要更改数据库格式（比如增加对象存储，非增加记录），必须指定更高版本
	 * }
	 * @returns {Promise}
	 */
	async open(option = {
		name: "jvt-cache-db",
		version: '1.0',
	}) {
		option?.name && (this._dbName = option.name);
		option?.version && (this._dbVersion = option.version);

		return new Promise((resolve, reject) => {
			if (!indexDB) {
				console.error("浏览器不支持indexedDB");
				reject("浏览器不支持indexedDB");
			}

			// 打开数据库
			const request = indexDB.open(this._dbName, this._dbVersion);
			if (!request) {
				console.error("无法打开数据库");
				reject("无法打开数据库");
			}

			// 数据库初始化成功
			request.onsuccess = (event) => {
				console.log("数据库初始化成功", event);
				this._db = request.result;
				resolve(event);
			};

			// 数据库初始化失败
			request.onerror = (event) => {
				console.error("数据库初始化失败", event);
				reject(event);
			};

			// 数据库初次创建或更新时（若本地数据库版本低于 open 方法中指定的版本，则代表版本过时）会触发
			request.onupgradeneeded = (event) => {
				console.log("数据库版本过时，已更新...", event);

				// 这时通过事件对象的target.result属性，拿到数据库实例。
				this._db = event.target.result;
				if (!!this._tableName) {
					this.createTable({
						tableName: this._tableName,
						keyPath: this._keyPath,
						autoIncrement: false,
						indexs: this._indexs,
					});
				}
				// resolve(event);
			};
		});
	}

	/**
	 * 关闭数据库
	 */
	close() {
		if (!this._db) {
			return;
		}
		
		this._db.close();
		this._db = null;
		console.log("数据库关闭成功！");
	}

	/**
	 * 删除数据库
	 * @param {string} dbName 数据库名
	 * @returns {Promise}
	 */
	async delete(dbName) {
		return new Promise((resolve, reject) => {
			// 删除数据库
			const request = indexDB.deleteDatabase(dbName ||this._dbName);
			if (!request) {
				reject("无法删除数据库");
			}

			// 数据库删除成功
			request.onsuccess = (event) => {
				resolve(event);
			};

			// 数据库删除失败
			request.onerror = (event) => {
				reject(event);
			};
		});
	}

	/**
	 * 判断数据库表是否存在
	 * @param {string} dbName 数据库名
	 * @returns {boolean}
	 */
	hasTable(tableName) {
		tableName = tableName || this._tableName;
		return !!this._db?.objectStoreNames?.contains?.(tableName);
	}

	/**
	 * 判断表是否为空
	 * @param {string} tableName 表名
	 * @returns {boolean}
	 */
	isTableEmpty(tableName) {
		tableName = tableName || this._tableName;
		const transaction = this._db.transaction([tableName], "readwrite");
		const objectStore = transaction.objectStore(tableName);
		return objectStore.count() === 0;
	}

	/**
	 * 创建表: 新建对象仓库
	 * @param {Object} option 参数
	 * {
	 *	tableName: "tb_user", // 表名
	 *	keyPath: "id",  // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
	 *	autoIncrement?: false, // 是否使用自动递增的整数作为主键，默认为 false
	 *	indexs?: [{// 设置索引
	 *		name: "name",		// 索引名称
	 *		unique: false, // 是否唯一索引
	 * 	}], 
	 * }
	 * @returns {Promise}
	 */
	createTable(option) {
		const { 
			tableName = this._tableName, 
			keyPath = this._keyPath, 
			indexs = this._indexs, 
			autoIncrement = false 
		} = option || {};

		const param = (!keyPath && !autoIncrement) ? undefined : {
			keyPath,
			autoIncrement
		};

		if (!this._db) {
			console.error("数据库未打开");
			return;
		}

		if (this.hasTable(tableName)) {
			console.error("对象仓库已存在");
			return;
		}

		const objectStore = !!param ? this._db.createObjectStore(tableName, param) : this._db.createObjectStore(tableName);
		indexs?.forEach(element => {
			// 三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
			objectStore.createIndex(element.name, element.name, { unique: element.unique });
		});
		return objectStore;
	}

	/**
	 * @description : 新增数据
	 * @param        {Object} option 参数
	 * {
	 *	tableName: "tb_user", // 表名
	 *	data: {id: 1, name: ‘文件名’, age: 18, sex: '女'} // 添加到数据库中的数据
	 * }
	 * @returns {Promise}
	 */
	async add(option) {
		const { 
			tableName = this._tableName, 
			data 
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			const transaction = this._db.transaction(tableName, "readwrite");
			const store = transaction.objectStore(tableName);
			const response = store.add(data);
			response.onsuccess = (event) => {
				resolve(event);
			};
			response.onerror = (event) => {
				reject(event);
			};
		});
	}

	/**
	 * @description : 更新数据
	 * @param        {Object} option 参数
	 * {
	 *	tableName: "tb_user", // 表名
	 *	data: {id: 1, name: ‘文件名’, age: 18, sex: '女'} // 添加到数据库中的数据
	 * }
	 * @returns {Promise}
	 */
	async update(option) {
		const { 
			tableName = this._tableName, 
			data 
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			const transaction = this._db.transaction([tableName], "readwrite");
			const store = transaction.objectStore(tableName);
			const response = store.put(data);
			response.onsuccess = (event) => {
				resolve(event);
			};
			response.onerror = (event) => {
				reject(event);
			};
		});
	}

	/**
	 * @description : 读取数据
	 * @param        {Object} option 参数
	 * {
	 *	tableName: "tb_user", // 表名
	 *	onResult: (data)=>{} // 读取成功回调函数
	 * }
	 * @returns {Promise}
	 */
	async read(option) {
		const { 
			tableName = this._tableName, 
			onResult
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			// 创建一个读写事务
			const transaction = this._db.transaction([tableName]);
			// 获取对象存储区
			const objectStore = transaction.objectStore(tableName);
			// 读取数据
			objectStore.openCursor().onsuccess = (event) => {
				const cursor = event.target.result; // 数据对象
				if (!cursor) {
					console.log('数据读取完毕');
					onResult?.(null);
					resolve(event);
					return;
				}

				console.log('key: ', cursor.key);
				console.log('Value: ', cursor.value);
				onResult?.({
					key: cursor.key,
					value: cursor.value
				});

				// 游标没有遍历完则继续遍历
				cursor.continue();
			}
		});
	}

	/**
	 * @description : 通过主键读取数据
	 * @param        {Object} option 参数
	 * {
	 * 		tableName: "tb_user", // 表名
	 *		key: 1 // 主键值
	 * }
	 * @returns {Promise}
	 */
	async getDataByKey(option) {
		const { 
			tableName = this._tableName, 
			key
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			const transaction = this._db.transaction([tableName]);
			const objectStore = transaction.objectStore(tableName);
			// 通过主键读取数据
			// const request = objectStore.get(key);
			// getAll(key)同get(key)获取指定key对应数据，如果getAll不传参或者传null即返回所有数据
			const request = objectStore.getAll(key);
			request.onsuccess = () => {
				console.log('getDataByKey', request.result);
				resolve(request.result);
			};
			request.onerror = (event) => {
				console.error('getDataByKey', event);
				reject(event);
			};
		});
	}

	/**
	 * @description : 通过索引读取数据
	 * @param        {Object} option 参数
	 * {
	 * 		tableName: "tb_user", // 表名
	 *		index: 'name', // 索引名称
	 *		value: '文件名' // 索引值
	 * }
	 * @returns {Promise}
	 */
	async getDataByIndex(option) {
		const { 
			tableName = this._tableName, 
			index,
			value
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			const transaction = this._db.transaction([tableName], 'readonly');
			const store = transaction.objectStore(tableName);
			const request = store.index(index)?.get(value);

			request.onsuccess = function (event) {
				const result = event.target.result;
				console.log('getDataByIndex', result);
				resolve(result);
			}

			request.onerror = (event) => {
				console.error('failed getDataByKey', event);
				reject(event);
			};
		});
	}

	/**
	 * @description : 删除数据
	 * @param        {Object} option 参数
	 * {
	 * 		tableName: "tb_user", // 表名
	 *		key: 1 // 主键值
	 * }
	 * @returns {Promise}	
	 */
	async remove(option) {
		const { 
			tableName = this._tableName, 
			key
		} = option || {};

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

		  const transaction = this._db.transaction([tableName], 'readwrite');
			const store = transaction.objectStore(tableName);
			const	request = store.delete(key);

			request.onsuccess = function (event) {
				console.log('数据删除成功');
				resolve(event);
			};

			request.onerror = (event) => {
				console.error('数据删除失败', event);
				reject(event);
			};
		});
	}

	// 清空数据库数据
	async clear(tableName) {
		tableName = tableName || this._tableName;

		return new Promise((resolve, reject) => {
			if (!this._db) {
				console.error("数据库未打开");
				reject("数据库未打开");
			}

			const transaction = this._db.transaction([tableName], "readwrite");
			const store = transaction.objectStore(tableName);
			const request = store.clear();

			request.onsuccss = (event) => {
				console.log("数据已清空", event);
				resolve(event);
			};
			request.onerror = (event) => {
					console.error("数据清空失败", event);
				reject(event);
			};
		});
	}
}