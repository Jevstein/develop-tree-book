[TOC]

# c++操作sqlite

## 0.前言

​	代码下载：

​		1. [SQLite官网](http://www.sqlite.org/)

​		2.[cppsqlite下载地址](https://github.com/lmmir/CppSQLite3)

​	Sqlite3 小巧、速度快，不需要任何数据库引擎，这意味着如果你需要 sqlite 来保存一些用户数据，甚至都不需要安装数据库（如果你做个小软件还要求人家必须装了sqlserver 才能运行，那也太黑心了）。



## 1.SQLite的基本操作

### 1.1.常用函数

```c++
//------------------ 1.基本操作 ------------------
//1.关键数据结构
sqlite3 *
  
//2.打开数据库
int sqlite3_open(filename, sqlite3 ** );//文件名需UTF-8，否则中文可能乱码

//3.关闭数据库
int sqlite3_close(sqlite3 *);

//------------------ 2.SQL语句操作 ------------------
//4.执行sql语句
int sqlite3_exec(sqlite3*, const char *sql, sqlite3_callback, void *,  char **errmsg );

//5.exec的回调
typedef int (*sqlite3_callback)(void*,int,char**, char**);
int LoadMyInfo(void *para, int n_column, char **column_value, char **column_name )
{
    int i;
		printf("记录包含 %d 个字段/n", n_column );

		for( i = 0 ; i < n_column; i ++ )
		{
    		printf("字段名:%s  ß> 字段值:%s/n", column_name[i], column_value[i] );
		}
      
		return 0;
}

//6.不使用回调查询数据库
int sqlite3_get_table(sqlite3*, const char *sql, char ***resultp, int *nrow, int *ncolumn, char **errmsg );
```



### 1.2.demo演示

```c++
extern "C"
{
	#include "./sqlite3.h"
};

int main( int , char** )
{
   sqlite3 * db = NULL; //声明sqlite关键结构指针
   int result;
   char * errmsg = NULL;
   char **dbResult;
   int nRow, nColumn;
   int i , j;
   int index

  //1.打开数据库:
  //需要传入 db 这个指针的指针，因为 sqlite3_open 函数要为这个指针分配内存，还要让db指针指向这个内存区
   result = sqlite3_open( "./database.db", &db );
   if ( result != SQLITE_OK )
   {
			//数据库打开失败
			return -1;
		}

	//2.数据库操作代码
	//创建一个测试表，表名叫 MyTable_1，有2个字段： ID 和 name。
  //其中ID是一个自动增加的类型，以后insert时可以不去指定这个字段，它会自己从0开始增加
	result = sqlite3_exec(db, "create table MyTable_1(ID integer primary key autoincrement, name nvarchar(32)), NULL, NULL, errmsg );
	if (result != SQLITE_OK )
  {
    	printf( “创建表失败，错误码:%d，错误原因:%s/n”, result, errmsg );
			return -1;
	}

	//3.插入一些记录
 {
    result = sqlite3_exec(db, "insert into MyTable_1(name) values (‘走路’)", 0, 0, errmsg );
    if (result != SQLITE_OK )
    {
      printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
      return -1;
    }

    result = sqlite3_exec(db, "insert into MyTable_1(name) values (‘骑单车’)”, 0, 0, errmsg );
    if (result != SQLITE_OK )
    {
        printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
        return -1;
    }

    result = sqlite3_exec(db, "insert into MyTable_1(name) values (‘坐汽车’)”, 0, 0, errmsg );
    if (result != SQLITE_OK )
    {
        printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
        return -1;
    }
 }

	//4.查询数据库
	result = sqlite3_exec( db, "select * from MyTable_1", LoadMyInfo, NULL, errmsg );
  if (result != SQLITE_OK )
  {
    	printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
    	return -1;
  }

  //5.不使用回调进行查询
  result = sqlite3_get_table( db, "select * from MyTable_1", &dbResult, &nRow, &nColumn, &errmsg );
 if ( SQLITE_OK == result )
 {
     index = nColumn; //dbResult前面第一行数据是字段名称，从nColumn 索引开始才是真正的数据
     printf("查到%d条记录/n", nRow );
     for (  i = 0; i < nRow ; i++ )
     {
         printf("第 %d 条记录/n", i+1 );
         for ( j = 0 ; j < nColumn; j++ )
         {
           printf( "字段名:%s  > 字段值:%s/n",  dbResult[j], dbResult [index] );
           ++index; // dbResult 的字段值是连续的，从第0索引到第 nColumn - 1索引都是字段名称，从第 nColumn 索引开始，后面都是字段值，它把一个二维的表（传统的行列表示法）用一个扁平的形式来表示
         }
         printf( “-------/n” );
     }

 }
   sqlite3_free_table( dbResult );

	//关闭数据库
	sqlite3_close( db );

	return 0;
}
```



## 2.CppSQLite的基本操作

### 2.1.打开与关闭数据库

```c++
CppSQLite3DB db;  
db.open("data.db"); 
//db.execDML("PRAGMA synchronous = 0;");
//db.execDML("PRAGMA case_sensitive_like = 1;");
//db.execDML("PRAGMA temp_store = MEMORY;"); 
//db.execDML("PRAGMA cache_size = 8000;");
//db.execDML("PRAGMA journal_mode = WAL;");
db.close();
```

### 2.2.查询：返回结果

```c++
const char *sRoute = "x://...";  //设置sqlite数据库文件的路径
CppSQLite3DB db;
try
{
    db.open(sRoute);  //打开数据库
    CppSQLite3Query q = db.execQuery("select * from t_table");  //执行查询
  	//1.遍历并打印表头
    for(int i = 0; i <= q.numFields() - 1; i++)	
    {
        printf("%s\t", q.fieldName(i));
    }
    printf("\n");
  
  	//2.遍历所有行
    while(!q.eof())		
    {
         for(int i = 0; i<=q.numFields()-1; i++)
         {
              printf("%s\t", q.getStringField(i));
         }
         printf("\n");
         q.nextRow();
    }
    q.finalize();//结束查询,释放内存
}
catch(CppSQLite3Exception& e)
{
    printf("%s",e.errorMessage());
}
db.close()
```

### 2.3.更改：增、删、改

```c++
db.execDML("insert into t_table(name,age) values('xiaomi',25)");  
db.execDML("update t_table set age = 21 where name = 'xiaomi'");  
db.execDML("delete from t_table where name = 'xiaomi'");  
```

### 2.4.statement对象

```c++
CppSQLite3Statement smt = db.compileStatement("insert into t_table(name,age) values(?,?)");  
for (int i = 0 ; i < 10; ++i)  
{   
  smt.bind(1,"test_");  
  smt.bind(2,i);  
  smt.execDML();  
}  
smt.finalize();  
```

### 2.5.批量插入

​	**SQLite不支持标准SQL语法进行批量插入**，以下为网络推荐写法：

```sql
-- 复合SQL语句: 先把两个SELECT的结果集进行无删减联合，再把联合结果插入到TABLE中
INSERT INTO TABLE(col1, col2) SELECT val11, val12 UNION ALL SELECT val21, val22 ;
```

### 2.6.注意事项

* 1）执行select用execQuery；执行delete，update，insert用execDML。 

* 2）数据库文件名传入utf-8格式字符串，否则库文件名包含中文时会打开失败。

  

## 3.SQLite 插入大量数据慢的解决方法

​	sqlite 插入数据很慢的原因：sqlite在没有显式使用事务的时候会为每条insert都使用事务操作，而sqlite数据库是以文件的形式存在磁盘中，就相当于每次访问时都要打开一次文件，如果对数据进行大量的操作，时间都耗费在I/O操作上，所以很慢。
​	解决方法是显式使用事务的形式提交：因为我们开始事务后，进行的大量操作的语句都保存在内存中，当提交时才全部写入数据库，此时，数据库文件也就只用打开一次。
​	我在没有显式使用事务形式插入100条数据时用了12.226s；用显式事务形式，插入100条只用了0.172s，插入1000000条也才34.891s，相关很大吧。
**显式使用事务的例子：**

```c++
#include <iostream>
#include <windows.h>
using namespace std;
#include "sqlite/sqlite3.h"
int main()
{
    sqlite3* db;
    int nResult = sqlite3_open("test.db",&db);
    if (nResult != SQLITE_OK)
    {
        cout<<"打开数据库失败："<<sqlite3_errmsg(db)<<endl;
        return 0;
    }
    else
    {
        cout<<"数据库打开成功"<<endl;
    }

    char* errmsg;

    nResult = sqlite3_exec(db,"create table fuck(id integer primary key autoincrement,name varchar(100))",NULL,NULL,&errmsg);
    if (nResult != SQLITE_OK)
    {
         sqlite3_close(db);
         cout<<errmsg;
         sqlite3_free(errmsg);
        return 0;
    }

    string strSql;
    strSql+="begin;\n";
    for (int i=0;i<100;i++)
    {
        strSql+="insert into fuck values(null,'heh');\n";
    }
    strSql+="commit;";
    //cout<<strSql<<endl;

    SYSTEMTIME tm_s;
    GetLocalTime(&tm_s);

    nResult = sqlite3_exec(db,strSql.c_str(),NULL,NULL,&errmsg);

    SYSTEMTIME tm_e;
    GetLocalTime(&tm_e);

    if (nResult != SQLITE_OK)
    {
        sqlite3_close(db);
        cout<<errmsg<<endl;
        sqlite3_free(errmsg);
        return 0;
    }

    cout<<"start:"<<tm_s.wMinute<<":"<<tm_s.wSecond<<":"<<tm_s.wMilliseconds<<endl;
    cout<<"end  :"<<tm_e.wMinute<<":"<<tm_e.wSecond<<":"<<tm_e.wMilliseconds<<endl;

    return 0;
} 
```

> 参考：
> [SQLITE3 使用总结（直接使用C函数）](https://www.cnblogs.com/findumars/p/9048286.html)
> [SQLite之C++封装库CppSQLite使用方法](https://blog.csdn.net/byxdaz/article/details/80555026)
> [SQLite 插入大量数据慢的解决方法](https://www.cnblogs.com/likebeta/archive/2012/06/15/2551466.html)