[TOC]

# 如何用C++封装出一个高质量的DB操作库？

## 1.需求目的

​	实现一个稳定的DB操作模块，提供给业务层使用。**业务层只关心sql语句的书写，以及执行sql之后返回的结果**。实际开发中，因需求的不确定性，使得业务开发变幻莫测，经常会有大量业务的扩展、修改和删除。疲于重复的代码操作或为了让业务层专注于业务开发，所以业务层非常不希望了解数据库以及操作数据库相关的任何具体实现。那么，就需要一个DB操作模块，封装好一切关于底层数据库（如mysql、mssql、sqlite）的操作功能，让业务层只需通过几个简单的调用即可得到想要的结果。

## 2.对外接口

### 2.1.连接参数

```c++
//1.连接参数
class DBConnParam
{
public:
    int port;
    char host[64];
    char username[64];
    char password[64];
    char database[64];
    char DSN[64];
    char param[256];//其它参数
};
```

### 2.2.结果集

```c++
//2.结果集
class IDBResultSet
{
public:
    virtual ~IDBResultSet(){}
    virtual int get_affect_rows() = 0;
    virtual int get_record_count() = 0;
    virtual int get_field_count() = 0;
    virtual bool get_next_record() = 0;
    virtual const char* get_field_name(int idx) = 0;
    virtual const char* get_field_value(int idx) = 0;
    virtual const char* get_str_field_value(int idx) = 0;
    virtual int get_int_field_value(int idx) = 0;
    virtual float get_float_field_value(int idx) = 0;
    virtual int get_field_length(int idx) = 0;
    virtual void release() = 0;
};
```

### 2.3.查询器

​	除了select操作外，也包括insert、delete等操作，只是后面这些操作，没有结果返回。

```c++
//3.查询器
class IDBQuerier
{
public:
    virtual ~IDBQuerier(){}
    virtual const char* get_sql_buffer() = 0;
    virtual int get_sql_length() = 0;
    virtual int get_db_hash_key() = 0;
    virtual void on_query_result(const IDBResultSet* rst_set, const char* err = 0) = 0;
    virtual bool is_in_queue() = 0;
    virtual void release() = 0;
};
```

### 2.4.操作模块

```c++
typedef std::function<void(const IDBResultSet, const char*)> SQLResultFunc;

//4.db操作模块
class IDBModule
{
public:
    virtual ~IDBModule(){}
    virtual bool init(int db_type, DBConnParam* params, int param_size) = 0;
    virtual bool exec_querier(IDBQuerier* querier, SQLResultFunc func) = 0;
    virtual const char* escape_sql(const char* str) = 0;
    virtual void release() = 0;
};

//也可以实现异步操作，如：
class IDBModule
{
public:
    virtual ~IDBModule(){}
    virtual bool init(int db_type, DBConnParam* params, int size) = 0;
    virtual int run(int limit = 1) = 0;//工作线程：消费队列中的查询器任务
    virtual bool push_querier(IDBQuerier* querier) = 0;//将查询器任务加入到队列
    virtual const char* escape_sql(const char* str) = 0;
    virtual void release() = 0;
};  
```



## 3.使用示例

​	演示同步执行sql语句的示例！

### 3.1.业务层的包装

#### 3.1.1.查询器实现

```c++
class QueryHandler;
class CDBQuerier : public IDBQuerier
{
	CDBQuerier();
public:
	CDBQuerier(CDBQueryResult* handler, int opcode, const std::string& sql)
    : handler_(handler) , opcode_(opcode) , sql_(sql) {}
	~CDBQuerier(void){}

public:
	virtual const char* get_sql_buffer() { return sql_.c_str(); }
	virtual int get_sql_length() { return (int)sql_.size(); }
	virtual void on_query_result(const IDBResultSet* rst, const char* err = 0) {
    //若IDBModule::exec_querier(IDBQuerier* querier, SQLResultFunc func)的func参数不为空，则该函数不会被调用，直接转到func执行
    if (handler_)
      handler_->on_query_result(opcode_, rst, err);
  }
	virtual void release() {}

private:
	int opcode_;
	std::string sql_;
	QueryHandler* handler_;
};
```

#### 3.1.2.查询处理

```c++
class QueryHandler
{
public:
    QueryHandler() { __init(); }
    ~QueryHandler() { }
  
public:
  	bool exec_sql(const std::string &sql, SQLResultFunc func) {
      int opcode = 0;//opcode和CDBQuerier进行绑定
      CDBQuerier querier(this, opcode, sql);
      return db_module_.exec_querier(&querier, func);
    }
      
  	void on_result(int opcode, const IDBResultSet* rst, const char* err = 0) {
      //此处根据opcode，操作不同的sql结果
      switch (opcode) {
        case 0:
          	break;
        default:
          break;
      }
    }
  
protected:
  	void __init() {
      	//TODO: 初始化db_params_
  			db_module_.init(DB_MYSQL, db_params_, db_params_.size());
    }
      
protected:
  	std::vector<DBConnParam> db_params_;//支持连接多个数据库
  	IDBModule db_module_;
}
```



### 3.2.业务层的调用

```c++
int main()
{
  QueryHandler handler;
  handler.exec_sql("select * from tb_student", [](const IDBResultSet *rst, const char*) {
    while (rst != NULL && rst->GetNextRecord()) {
      int i = 0;
      std::string field_name1 = rst->GetFieldName(i++);// 
      std::string field_name2 = rst->GetFieldName(i++);// 
      //--snip---
    }
  });
  handler.exec_sql("select * from tb_teacher", [](const IDBResultSet *rst, const char*) {
    while (rst != NULL && rst->GetNextRecord()) {
      int i = 0;
      std::string field_name1 = rst->GetFieldName(i++);// 
      std::string field_name2 = rst->GetFieldName(i++);//
      //--snip---
    }
  });
  
  return 0;
}
```

