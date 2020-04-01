[TOC]

# c++操作sqlite

SQLite官网：http://www.sqlite.org/

cppsqlite下载地址：https://github.com/lmmir/CppSQLite3



https://blog.csdn.net/byxdaz/article/details/80555026

## 1.SQLite的基本操作

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

2.1.查询

```c++
const char *sRoute = "x://...";  //设置sqlite数据库文件的路径
CppSQLite3DB db;
try
{
    db.open(sRoute);  //打开数据库
    CppSQLite3Query q = db.execQuery("select * from t_table");  //执行查询
    for(int i = 0; i <= q.numFields() - 1; i++)	//遍历并打印表头
    {
        printf("%s\t", q.fieldName(i));
    }
    printf("\n");
    while(!q.eof())		//遍历所有行
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

