[TOC]

# 用c++封装高质量的mysql操作库

内部实现mysql的所有操作，对外隐藏关于操作mysql的具体实现细节。

## 1.引入mysql

### 1.1.安装mysql

​	完成不同操作系统（如linux、windows、mac等）的mysql安装。本文忽略安装问题，详见[xxx]()。

### 1.2.导入mysql

* 1.包含头文件

  ```c++
  #include <mysql.h>
  ```

* 2.导入库

  ```shell
  #1.linux下，编译时加入mysql库（具体略）:
  	LIBS	:= -L/usr/lib/mysql -lmysqlclient
  	
  #2.windows下，导入mysql（具体略）：
  	mysqlclient.lib或mysqlclient.dll
  ```

  

## 2.基本操作

​	mysql的基本操作函数如下：

```c++
//0.数据结构
	MYSQL_RES* mysql_res_;//记录集
	MYSQL_ROW mysql_row_;
	MYSQL_FIELD* mysql_fields_;

	MYSQL* mysql_;


//1.初始化mysql
	mysql_init()
    
//2.关闭mysql
  mysql_close()
  
//3.连接mysql
  mysql_options()
  mysql_real_connect()
    
//4.判断是否连接上mysql
  mysql_ping()
    
//5.执行sql
  mysql_real_query()
    
//6.判断是否出错
  mysql_errno()
    
//7.取记录集
  mysql_store_result()
  mysql_next_result()
    
//8.释放记录集资源
  mysql_free_result()
    
//9.获取记录集的行数和列数
  mysql_num_rows()
  mysql_num_fields()
    
//10.获取行数据：返回值指向下一行
    mysql_fetch_row()
    
//11.获取行信息
    mysql_fetch_lengths()
    mysql_fetch_fields()
```



## 3.核心封装

### 3.1.结果集实现

```c++
class CMysqlResultSet : public IDBResultSet
{
public:
	CMysqlResultSet(void)
  : mysql_res_(NULL)
  , mysql_row_(NULL)
  , mysql_fields_(NULL)
  , affect_row_(0)
  , field_lengths_(NULL) {
  }
	virtual ~CMysqlResultSet(void) { __clear(); }

public:
		virtual int get_affect_rows() { return affect_row_; }
  
		virtual int get_record_count() { 
      return mysql_res_ != NULL ? (int)mysql_num_rows(mysql_res_) : 0;
    }
  
		virtual int get_field_count() {
      return mysql_res_ != NULL ? (int)mysql_num_fields(mysql_res_) : 0;
    }
  
		virtual bool get_next_record() {
      if (mysql_res_ != NULL) {
        mysql_row_ = mysql_fetch_row(mysql_res_);
        if (mysql_row_ != NULL) {
          field_lengths_ = mysql_fetch_lengths(mysql_res_);
          mysql_fields_ = mysql_fetch_fields(mysql_res_);
          return true;
        }
      }
      return false;
    }
  
		virtual const char* get_field_name(int idx) {
      if (field_lengths_ != NULL  && (0 <= idx && idx < GetFieldCount())) {
        static char name[32] = {0};
        snprintf(name, sizeof(name), "%d", idx);
        return name;
      }
      return NULL;
    }
  
		virtual const char* get_field_value(int idx) {
      return (field_lengths_ != NULL && (0 <= idx && idx < GetFieldCount())) ?
         mysql_row_[idx] : NULL;
    }
  
		virtual const char* get_str_field_value(int idx) {
      const char* p = get_field_value(idx);
      return p == NULL ? "" : p;
    }
  
		virtual int get_int_field_value(int idx) {
      const char* p = get_field_value(idx);
      return p == NULL ? 0 : atoi(p);
    }
  
		virtual float get_float_field_value(int idx) {
      const char* p = get_field_value(idx);
      return p == NULL ? 0.0f : (float)atof(p);
    }
  
		virtual int get_field_length(int idx) {
      return (field_lengths_ != NULL  && idx < get_field_count() && idx >= 0)?
        field_lengths_[idx] : 0;
    }
  
		virtual void release() {}

public:
	void set_result_set(int affect_rows, MYSQL_RES* mysql_res) {
    __clear();
    mysql_res_ = mysql_res;
    affect_row_ = affect_rows;
  }

protected:
	void __clear() {
    if (mysql_res_ != NULL) {
      mysql_free_result(mysql_res_);
      mysql_res_ = NULL;
    }
    mysql_row_ = NULL;
    mysql_fields_ = NULL;

    affect_row_ = 0;
    field_lengths_ = NULL;
  }

private:
	MYSQL_RES* mysql_res_;//记录集
	MYSQL_ROW mysql_row_;
	MYSQL_FIELD* mysql_fields_;

	int affect_row_;
	unsigned long* field_lengths_;
};
```



### 3.2.mysql封装

 ```c++
class CKernelMysql
{
public:
	CKernelMysql() : mysql_(NULL){}
	virtual ~CKernelMysql() { __clear(); }

	static const char* escape_sql(const char* str) {
    static char buffer[MAX_SQL] = { 0 };
    memset(buffer, 0, sizeof(buffer));
    size_t len = strlen(str);
    long tolen = mysql_escape_string(buffer, str, len < MAX_SQL ? len : 0);
    buffer[tolen + 1] = '\0';
    return buffer;
  }

public:
	virtual bool connect(DBConnParam* param) {
    if (!__init() || !param)
      return false;

    LOG_DBG("connect mysql: '%s':'%s':'%s'", param->host, param->username, param->database);

    my_bool is_reconnect = true;
    mysql_options(mysql_, MYSQL_OPT_RECONNECT, &is_reconnect);
    if (!mysql_real_connect(mysql_, param->host, param->username, param->password, param->database, 0, NULL, CLIENT_MULTI_RESULTS)) {
      LOG_ERR("failed to connect mysql! err: %s", mysql_error(mysql_));
      return false;
    }

    param_ = param;
    return true;
  }
  
	virtual bool is_connected(){
    if (!mysql_)
      return false;
    return mysql_ping(mysql_) == 0;
  }
  
	virtual bool re_connect(){
    if (!mysql_ || !param_)
      return false;

    LOG_DBG("reconnnect mysql: '%s':'%s':'%s'", param->host, param->username, param->database);

    if (!mysql_real_connect(mysql_, param->host, param->username, param->password, param->database, 0, NULL, CLIENT_MULTI_RESULTS)) {
      LOG_ERR("failed to reconnect mysql! err: %s", mysql_error(mysql_));
      return false;
    }

    return true;
  }
  
	virtual IDBResultSet* query(IDBQuerier* querier){
    if (!mysql_)
      return NULL;

    LOG_DBG("mysql run sql: '%s'", querier->get_sql_buffer());

    mysql_real_query(mysql_, querier->get_sql_buffer(), querier->get_sql_length());
    if (mysql_errno(mysql_) != 0) {
      LOG_ERR("failed to reconnect mysql! err: %s", mysql_error(mysql_));
      return NULL;
    }

    CMysqlResultSet* result = new CMysqlResultSet();
    assert(result);

    //取最后一个记录集
    MYSQL_RES* mysql_res = mysql_store_result(mysql_);
    while (mysql_next_result(mysql_) == 0) {//有更多记录集
      MYSQL_RES* res = mysql_store_result(mysql_);
      if (res != NULL){//似乎每次后面都带了一个空的记录集, 故判断一下
        if (mysql_res != NULL)
          mysql_free_result(mysql_res);
        mysql_res = res;
      }
    }

    result->set_result_set(this, (int)mysql_affected_rows(mysql_), mysql_res);
    return result;
  }
  
	virtual const char* get_error() { return mysql_error(mysql_); }

protected:
	bool __init(){
    if (mysql_)
      mysql_close(mysql_);
    return (mysql_ = mysql_init(NULL)) ? true : false;
  }
  
	void __clear() {
    if (mysql_) {
      mysql_close(mysql_);
      mysql_ = NULL;
    }
  }

private:
	MYSQL* mysql_;
  DBConnParam *param_;
};
 ```

