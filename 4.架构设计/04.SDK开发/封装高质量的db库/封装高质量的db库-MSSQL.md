[TOC]

# 用c++封装高质量的mssql操作库

​	内部实现sql server的所有操作，对外隐藏关于操作sql server的具体实现细节。显然，只适合windows系统。

## 1.引入sql server库

### 1.1.安装sql server

```shell
本文忽略安装问题，详见[xxx]()。
```

### 1.2.导入sql server库

```c++
#import "..\..\..\bin\plugin\msado15.dll" no_namespace rename("EOF","adoEOF") 
```

略。



## 2.基本操作

Mssql的基本操作如下：

```c++
//0.数据结构
	_ConnectionPtr connection_(__uuidof(Connection));
	_RecordsetPtr rst_(__uuidof(Recordset));

//1.ado
  CoInitialize(NULL);
  CoUninitialize();

//2.连接数据库
//e.g: "Provider=SQLOLEDB; Server=.;Database=AIS2; uid=sa; pwd=;"
  connection_->Open(param->param, "", "", adModeUnknown);

//3.判断是否连接
	connection_->State
    
//4.执行sql
  connection_->Execute();

//5.获取记录集
  if (!rst_->adoEOF) {
    rst_->MoveFirst();
    rst_->MoveNext();
	}

//6.获取记录
	do {
      value.clear();
      if (!rst_) break;
      if (!rst_->Fields) break;
      if (!rst_->Fields->GetItem(_variant_t((long)idx))) break;
      if (!rst_->Fields->GetItem(_variant_t((long)idx))->Value) break;
      value = (const char*)(_bstr_t)(rst_->Fields->GetItem(_variant_t((long)idx))->Value);
    } while (0);
```



## 3.核心封装

### 3.1.结果集实现

```c++
class CMssqlResultSet : public IDBResultSet
{
public:
	CMssqlResultSet(void)
    : rst_(__uuidof(Recordset))
    , kernel_(NULL)
    , affect_Rows_(0)
    , record_count_(0) {
  }
	virtual ~CMssqlResultSet(void) { 
    try {
      rst_->Release();
    }
    catch (_com_error &e) {
      LOG_ERR("failed to release _RecordsetPtr! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
    }
    __clear();
  }

public:
  virtual int get_affect_rows() { return affect_row_; }

  virtual int get_record_count() { 
    return (!rst_->adoEOF) ? rst_->GetRecordCount() : 0;
  }

  virtual int get_field_count() {
    return (!rst_->adoEOF) ? rst_->GetCount() : 0;
  }

  virtual bool get_next_record() {
    try {
      if (!rst_)
        return false;

      if (record_count_++ == 0) {
        if (rst_->adoEOF)
          return false;

        rst_->MoveFirst();
      } else {
        rst_->MoveNext();
      }

      if (rst_->adoEOF)
      	return false;
    }
    catch (_com_error &e) {
      LOG_ERR("failed to net record! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
      return false;
    }

    return true;
  }

  virtual const char* get_field_name(int idx) {
    if (idx < 0 || idx >= get_field_count())
      return NULL;

    static char name[32] = { 0 };
    p_snprintf(name, sizeof(name), "%d", idx);
    return name;
  }

  virtual const char* get_field_value(int idx) {
    if (idx < 0 || idx >= get_field_count())
      return NULL;

    static std::string value;
    do {
      value.clear();
      if (!rst_) break;
      if (!rst_->Fields) break;
      if (!rst_->Fields->GetItem(_variant_t((long)idx))) break;
      if (!rst_->Fields->GetItem(_variant_t((long)idx))->Value) break;
      value = (const char*)(_bstr_t)(rst_->Fields->GetItem(_variant_t((long)idx))->Value);
    } while (0);

    return value.c_str();
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

  virtual void release() { __clear(); }

public:
	void set_result_set(int affect_rows) {
    affect_Rows_ = affect_Rows;
  }

protected:
	void __clear() {
    kernel_ = NULL;
    affect_Rows_ = 0;
    record_count_ = 0;

    try {
      if (rst_)
        rst_->Close();
    }
    catch (_com_error &e) {
      LOG_ERR("failed to close _RecordsetPtr! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
    }
  }

public:
	_RecordsetPtr rst_;

private:
	int affect_Rows_;
	int record_count_;
};
```



### 3.2.mssql封装

 ```c++
#include <comdef.h>

class CKernelMysql
{
public:
	CKernelMysql() : connection_(__uuidof(Connection)) {}
	virtual ~CKernelMysql() { __clear(); }

	static const char* escape_sql(const char* str) { return str;}

public:
	virtual bool connect(DBConnParam* param) {
    if (!__init() || !param)
      return false;

    try {
      LOG_DBG("connect sqlserver: '%s'", param->param);

      //e.g: "Provider=SQLOLEDB; Server=.;Database=AIS2; uid=sa; pwd=;"
      connection_->Open(param->param, "", "", adModeUnknown);
    }
    catch (_com_error &e) {
      LOG_ERR("failed to open sql server! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
      return false;
    }

    param_ = param;
    return true;
  }
  
	virtual bool is_connected(){
    try {
      //method1
      switch (connection_->State) {
      case adStateClosed:			return false;//Connection object is inactive and not connected to a database.
      case adStateOpen:				break;//Connection object is inactive, but connected to a database.
      case adStateConnecting:	break;//Connection object is in the process of connecting to a database.
      case adStateExecuting:	break;//Connection object is currently executing.
      case adStateFetching:		break;//Connection object is retrieving data from the database.
      default:
        break;
      }

      //method2: 执行任意SQL，抛出异常则未连接
      //***
    }
    catch (_com_error &e) {
      LOG_ERR("failed to connect sql server! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
      return false;
    }

    return true;
  }
  
	virtual bool re_connect(){
    if (!param_)
      return false;

    try {
      connection_->Close();

      char conn_str[256] = { 0 };
      p_snprintf(conn_str, sizeof(conn_str)
                 , "Provider=SQLOLEDB.1; Server=%s; Database=AIS2; uid=%s; pwd=%s;"
        , param->host, param->database, param->username, param->password);

      //e.g: "Provider=SQLOLEDB; Server=.;Database=AIS2; uid=sa; pwd=;"
      connection_->Open(conn_str, "", "", adModeUnknown);
    }
    catch (_com_error &e) {
      LOG_ERR("failed to reopen sql server! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
      return false;
    }

		return true;
  }
  
	virtual IDBResultSet* query(IDBQuerier* querier){
    CMsSqlResultSet* rst = new CMsSqlResultSet();
    assert(rst);

    try {
      _variant_t RecordsAffected;
      rst->rst_ = connection_->Execute(querier->get_sql_buffer(), &RecordsAffected, adCmdText);
      if (rst->rst_) {
        //_variant_t强制转换为int，需#include <comdef.h>
        rst->set_result_set((int)RecordsAffected);
      }
    }
    catch (_com_error &e) {
      LOG_ERR("failed to execute sql! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());

      rst->release();
      rst = NULL;
    }

    return rst;
  }
  
	virtual const char* get_error() { return NULL; }

protected:
	bool __init(){
    if (!ado_coinit__) {
      CoInitialize(NULL);
      ado_coinit__ = true;
    }

    connection_.CreateInstance("ADODB.Connection");
    return true;
  }
  
	void __clear() {
    try {
      connection_->Close();
      connection_->Release();
    }
    catch (_com_error &e) {
      LOG_ERR("failed to close sql server! err: %s, file: %s"
              , (LPCTSTR)e.Description(), (LPCTSTR)e.HelpFile());
    }

    if (ado_coinit__) {
      CoUninitialize();
      ado_coinit__ = false;
    }
  }

private:
	_ConnectionPtr connection_;
	static bool ado_coinit__ = false;
};
 ```