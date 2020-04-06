[TOC]

# C++操作SQLite

## 0.前言

​	地址：
​		1.[SQLite官网](http://www.sqlite.org/)
​		2.[cppsqlite下载地址](https://github.com/lmmir/CppSQLite3)
​		3.[SQLite 教程.RUNOOB.com](https://www.runoob.com/sqlite/sqlite-tutorial.html)

​	Sqlite3 小巧、速度快。跟MS的access一样是文件型数据库，也就是说，一个数据库就是一个文件，此数据库里可以建立很多的表，可以建立索引、触发器等等。但是，它实际上就是一个文件，备份这个文件就备份了整个数据库。同时不需要任何数据库引擎，这意味着如果你需要 sqlite 来保存一些用户数据，甚至都不需要安装数据库（如果你做个小软件还要求人家必须装了sqlserver 才能运行，那也太黑心了）。



## 1.SQLite的基本操作

### 1.1.常用函数

#### 1.1.1.基本操作

```c++
//1.关键数据结构
	sqlite3 *
  
//2.打开数据库
//若文件存在，尝试把它当数据库文件来打开；否则，sqlite会自动建立
	int sqlite3_open(filename, sqlite3 ** );//文件名需UTF-8，否则中文可能乱码

//3.关闭数据库
	int sqlite3_close(sqlite3 *);
```

#### 1.1.2.SQL语句操作

```c++
//1.执行sql语句：select时需要用到回到sqlite3_callback
	int sqlite3_exec(sqlite3*, const char *sql, sqlite3_callback, void *param,  char **errmsg );

//2.sqlite3_exec的回调
  typedef int (*sqlite3_callback)(void*, int, char**, char**);
  int LoadDBInfo( void *param, int n_column, char **column_value, char **column_name )
  {
      //char** column_value是个关键值，查出来的数据都保存在这里，它实际上是个1维数组，
      //每一个元素都是一个 char* 值，是一个字段内容（用字符串来表示，以/0结尾）

      int i;
      printf("记录包含 %d 个字段/n", n_column );

      for ( i = 0 ; i < n_column; i ++ )
      {
          printf("字段名:%s > 字段值:%s/n", column_name[i], column_value[i] );
      }

      return 0;
  }

//3.不使用回调查询数据库
	int sqlite3_get_table(sqlite3*, const char *sql, char ***resultp, int *nrow, int *ncolumn, char **errmsg );
```

#### 1.1.3.操作二进制Blob

```c++
//1.辅助的数据类型:
	sqlite3_stmt *
	这个数据类型记录了一个"sql语句"。为你可以把 sqlite3_stmt * 所表示的内容看成是"sql语句"，但是实际上它不是我们所熟知的sql语句。它是一个已经把sql语句解析了的，用sqlite自己标记记录的内部数据结构。正因为这个结构已经被解析了，所以你可以往这个语句里插入二进制数据（当然，把二进制数据插到sqlite3_stmt结构里可不能直接memcpy，也不能像 std::string那样用 + 号，必须用 sqlite 提供的函数来插入）。

//2.写入二进制blob数据的步骤:
//1）假如存在表：create table Tbl_2( ID integer, file_content  blob )
	sqlite3_stmt *stat;
	sqlite3_prepare(db, "insert into Tbl_2( ID, file_content) values( 10, ? )", -1, &stat, 0);
  //[注]:第三个参数的含义表示前面sql语句的长度。若小于0，sqlite会自动计算长度(把sql语句当成以/0结尾的字符串)
//2）插入二进制数据：当前面函数返回SQLITE_OK && stat != NULL
	sqlite3_bind_blob(stat, 1, pdata, (int)(length_of_data_in_bytes), NULL ); 
	//[注]:pdata为数据缓冲区，length_of_data_in_bytes为数据大小，以字节为单位
//3) 保存二进制
	int result = sqlite3_step( stat );
//4）释放资源
	sqlite3_finalize( stat ); 

//3.读出二进制blob数据的步骤:
//1）
	sqlite3_stmt * stat;
	sqlite3_prepare( db, "select * from Tbl_2", -1, &stat, 0 );
//2）可以循环执行sqlite3_step 函数，一次step查询出一条记录。直到返回值不为 SQLITE_ROW 时表示查询结束
	int result = sqlite3_step( stat );//返回SQLITE_ROW表示成功（非SQLITE_OK）
//3）取字段值
	int id = sqlite3_column_int( stat, 0 ); //第2个参数表示获取第几个字段内容，从0开始计算
//4）获取 file_content 的值（因file_content是二进制数据，故需得到它的指针和长度）：
		const void * pFileContent = sqlite3_column_blob( stat, 1 );
		int len = sqlite3_column_bytes( stat, 1 );
//5）释放资源
	sqlite3_finalize( stat );

//4.重复使用 sqlite3_stmt 结构
	result = sqlite3_reset(stat);
	//此时，stat结构又成为sqlite3_prepare完成时的状态，你可以重新为它bind内容。
```

#### 1.1.4.事务处理

​	sqlite 是支持事务处理的。如果你知道你要同步删除很多数据，不仿把它们做成一个统一的事务。

​	通常一次 sqlite3_exec 就是一次事务，如果你要删除1万条数据，sqlite就做了1万次：开始新事务->删除一条数据->提交事务->开始新事务->… 的过程。这个操作是很慢的。因为时间都花在了开始事务、提交事务上。

​	你可以把这些同类操作做成一个事务，这样如果操作错误，还能够回滚事务。事务的操作没有特别的接口函数，它就是一个普通的 sql 语句而已。分别如下：

分别如下：

```C++
int result; 
result = sqlite3_exec( db, "begin transaction", 0, 0, &zErrorMsg ); 		//开始一个事务
result = sqlite3_exec( db, "commit transaction", 0, 0, &zErrorMsg ); 		//提交事务
result = sqlite3_exec( db, "rollback transaction", 0, 0, &zErrorMsg ); 	//回滚事务
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

    result = sqlite3_exec(db, "insert into MyTable_1(name) values (‘骑单车’)", 0, 0, errmsg );
    if (result != SQLITE_OK )
    {
  			printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
      	return -1;
    }

    result = sqlite3_exec(db, "insert into MyTable_1(name) values (‘坐汽车’)", 0, 0, errmsg );
    if (result != SQLITE_OK )
    {
    		printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
      	return -1;
    }
 }

	//4.查询数据库
	result = sqlite3_exec( db, "select * from MyTable_1", LoadDBInfo, NULL, errmsg );
  if (result != SQLITE_OK )
  {
    	printf( “插入记录失败，错误码:%d，错误原因:%s/n”, result, errmsg );
    	return -1;
  }

  //5.不使用回调进行查询
  result = sqlite3_get_table( db, "select * from MyTable_1", &dbResult, &nRow, &nColumn, &errmsg );
 if ( SQLITE_OK == result )
 {
     index = nColumn; //dbResult前面第一行数据是字段名称，从nColumn索引开始才是真正的数据
     printf("查到%d条记录/n", nRow );
     for (  i = 0; i < nRow ; i++ )
     {
         printf("第 %d 条记录/n", i+1);
         for ( j = 0 ; j < nColumn; j++ )
         {
           printf( "字段名:%s  > 字段值:%s/n",  dbResult[j], dbResult[index] );
           ++index; // dbResult的字段值是连续的，从第0索引到第nColumn - 1索引都是字段名称，从第nColumn 索引开始，后面都是字段值，它把一个二维的表（传统的行列表示法）用一个扁平的形式来表示
         }
         printf("-------/n");
     }

 }
   sqlite3_free_table( dbResult );

	//关闭数据库
	sqlite3_close( db );

	return 0;
}
```



## 2.CppSQLite的基本操作

​	CppSQLite是封装了sqlite3（C库）的C++库

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

