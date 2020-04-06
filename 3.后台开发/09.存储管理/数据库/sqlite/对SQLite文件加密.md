[TOC]

# 对SQLite的数据库文件加密

​	虽然 sqlite 很好用，速度快、体积小巧，但是它保存的文件却是明文的。可用NotePad打开数据库文件瞧瞧，里面 insert 的内容几乎一览无余。这样赤裸裸的展现自己，可不是我们的初衷。当然，如果你在嵌入式系统、智能手机上使用 sqlite，最好是不加密，因为这些系统运算能力有限，你做为一个新功能提供者，不能把用户有限的运算能力全部花掉。

​	Sqlite为了速度而诞生，因此Sqlite本身不对数据库加密。要知道，如果你选择标准AES算法加密，那么一定有接近50%的时间消耗在加解密算法上，甚至更多（性能主要取决于你算法编写水平以及你是否能使用cpu提供的底层运算能力，比如MMX或sse系列指令可以大幅度提升运算速度）。

​	Sqlite免费版本是不提供加密功能的，当然你也可以选择他们的收费版本，那你得支付2000块钱，而且是USD。不是说支付钱不好，如果只为了数据库加密就去支付2000块，我觉得划不来。因为下面我将要告诉你如何为免费的Sqlite扩展出加密模块——自己动手扩展，这是Sqlite允许，也是它提倡的。那么，就让我们一起开始为 sqlite3.c 文件扩展出加密模块。

##  1.必要的宏

​	通过阅读 Sqlite 代码（当然没有全部阅读完，6万多行代码，没有一行是我习惯的风格，我可没那么多眼神去看），我搞清楚了两件事：

* 1.Sqlite是支持加密扩展的；

* 2.需要 #define 一个宏才能使用加密扩展。这个宏就是 SQLITE_HAS_CODEC。

  可以在代码最前面（也可以在 sqlite3.h 文件第一行）定义：

  ```c++
  #ifndef SQLITE_HAS_CODEC
  #define SQLITE_HAS_CODEC
  #endif
  ```

  如果你在代码里定义了此宏，但是还能够正常编译，那么应该是操作没有成功。因为你应该会被编译器提示有一些函数无法链接才对。如果你用的是 VC 2003，你可以在“解决方案”里右键点击你的工程，然后选“属性”，找到“C/C++”，再找到“命令行”，在里面手工添加“/D "SQLITE_HAS_CODEC"”。

定义了这个宏，一些被 Sqlite 故意屏蔽掉的代码就被使用了。这些代码就是加解密的接口。

尝试编译，vc会提示你有一些函数无法链接，因为找不到他们的实现。

如果你也用的是VC2003，那么会得到下面的提示：

error LNK2019: 无法解析的外部符号 _sqlite3CodecGetKey ，该符号在函数 _attachFunc 中被引用

error LNK2019: 无法解析的外部符号 _sqlite3CodecAttach ，该符号在函数 _attachFunc 中被引用

error LNK2019: 无法解析的外部符号 _sqlite3_activate_see ，该符号在函数 _sqlite3Pragma 中被引用

error LNK2019: 无法解析的外部符号 _sqlite3_key ，该符号在函数 _sqlite3Pragma 中被引用

fatal error LNK1120: 4 个无法解析的外部命令

 

这是正常的，因为Sqlite只留了接口而已，并没有给出实现。

下面就让我来实现这些接口。

 

2自己实现加解密接口函数

如果真要我从一份 [www.sqlite.org](http://www.sqlite.org/) 网上down下来的 sqlite3.c 文件，直接摸索出这些接口的实现，我认为我还没有这个能力。

好在网上还有一些代码已经实现了这个功能。通过参照他们的代码以及不断编译中vc给出的错误提示，最终我把整个接口整理出来。

实现这些预留接口不是那么容易，要重头说一次怎么回事很困难。我把代码都写好了，直接把他们按我下面的说明拷贝到 sqlite3.c 文件对应地方即可。我在下面也提供了sqlite3.c 文件，可以直接参考或取下来使用。

 

这里要说一点的是，我另外新建了两个文件：crypt.c和crypt.h。

其中crypt.h如此定义：

\#ifndef DCG_SQLITE_CRYPT_FUNC_

\#define DCG_SQLITE_CRYPT_FUNC_

/***********

董淳光写的 SQLITE 加密关键函数库

***********/

 

/***********

关键加密函数

***********/

int My_Encrypt_Func( unsigned char * pData, unsigned int data_len, const char * key, unsigned int len_of_key );

 

/***********

关键解密函数

***********/

int My_DeEncrypt_Func( unsigned char * pData, unsigned int data_len, const char * key, unsigned intlen_of_key );

 

\#endif

 

 

其中的 crypt.c 如此定义：

\#include "./crypt.h"

\#include "memory.h"

/***********

关键加密函数

***********/

int My_Encrypt_Func( unsigned char * pData, unsigned int data_len, const char * key, unsigned int len_of_key )

{

return 0;

}

 

/***********

关键解密函数

***********/

int My_DeEncrypt_Func( unsigned char * pData, unsigned int data_len, const char * key, unsigned intlen_of_key )

{

return 0;

}

 

这个文件很容易看，就两函数，一个加密一个解密。传进来的参数分别是待处理的数据、数据长度、密钥、密钥长度。

处理时直接把结果作用于 pData 指针指向的内容。

你需要定义自己的加解密过程，就改动这两个函数，其它部分不用动。扩展起来很简单。

这里有个特点，data_len 一般总是 1024 字节。正因为如此，你可以在你的算法里使用一些特定长度的加密算法，比如AES要求被加密数据一定是128位（16字节）长。这个1024不是碰巧，而是 Sqlite 的页定义是1024字节，在sqlite3.c文件里有定义:

\# define SQLITE_DEFAULT_PAGE_SIZE 1024

你可以改动这个值，不过还是建议没有必要不要去改它。

 

上面写了两个扩展函数，如何把扩展函数跟 Sqlite 挂接起来，这个过程说起来比较麻烦。我直接贴代码。

分3个步骤。

首先，在 sqlite3.c 文件顶部，添加下面内容：

 

\#ifdef SQLITE_HAS_CODEC

\#include "./crypt.h"

/***********

用于在 sqlite3 最后关闭时释放一些内存

***********/

void sqlite3pager_free_codecarg(void *pArg);

\#endif

这个函数之所以要在 sqlite3.c 开头声明，是因为下面在 sqlite3.c 里面某些函数里要插入这个函数调用。所以要提前声明。

 

其次，在sqlite3.c文件里搜索“sqlite3PagerClose”函数，要找到它的实现代码（而不是声明代码）。

实现代码里一开始是：

\#ifdef SQLITE_ENABLE_MEMORY_MANAGEMENT

 /* A malloc() cannot fail in sqlite3ThreadData() as one or more calls to

 ** malloc() must have already been made by this thread before it gets

 ** to this point. This means the ThreadData must have been allocated already

 ** so that ThreadData.nAlloc can be set.

 */

 ThreadData *pTsd = sqlite3ThreadData();

 assert( pPager );

 assert( pTsd && pTsd->nAlloc );

\#endif

 

需要在这部分后面紧接着插入：

 

\#ifdef SQLITE_HAS_CODEC

 sqlite3pager_free_codecarg(pPager->pCodecArg);

\#endif

 

这里要注意，sqlite3PagerClose 函数大概也是 3.3.17版本左右才改名的，以前版本里是叫 “sqlite3pager_close”。因此你在老版本sqlite代码里搜索“sqlite3PagerClose”是搜不到的。

类似的还有“sqlite3pager_get”、“sqlite3pager_unref”、“sqlite3pager_write”、“sqlite3pager_pagecount”等都是老版本函数，它们在 pager.h 文件里定义。新版本对应函数是在 sqlite3.h 里定义（因为都合并到 sqlite3.c和sqlite3.h两文件了）。所以，如果你在使用老版本的sqlite，先看看 pager.h 文件，这些函数不是消失了，也不是新蹦出来的，而是老版本函数改名得到的。

 

最后，往sqlite3.c 文件下找。找到最后一行：

 

/************** End of main.c ************************************************/

 

在这一行后面，接上本文最下面的代码段。

这些代码很长，我不再解释，直接接上去就得了。

唯一要提的是 DeriveKey 函数。这个函数是对密钥的扩展。比如，你要求密钥是128位，即是16字节，但是如果用户只输入 1个字节呢？2个字节呢？或输入50个字节呢？你得对密钥进行扩展，使之符合16字节的要求。

DeriveKey 函数就是做这个扩展的。有人把接收到的密钥求md5，这也是一个办法，因为md5运算结果固定16字节，不论你有多少字符，最后就是16字节。这是md5算法的特点。但是我不想用md5，因为还得为它添加包含一些 md5 的.c或.cpp文件。我不想这么做。我自己写了一个算法来扩展密钥，很简单的算法。当然，你也可以使用你的扩展方法，也而可以使用md5 算法。只要修改 DeriveKey 函数就可以了。

在 DeriveKey 函数里，只管申请空间构造所需要的密钥，不需要释放，因为在另一个函数里有释放过程，而那个函数会在数据库关闭时被调用。参考我的 DeriveKey 函数来申请内存。

 

这里我给出我已经修改好的 sqlite3.c 和 sqlite3.h 文件。

如果太懒，就直接使用这两个文件，编译肯定能通过，运行也正常。当然，你必须按我前面提的，新建 crypt.h 和crypt.c 文件，而且函数要按我前面定义的要求来做。

3 加密使用方法

现在，你代码已经有了加密功能。

你要把加密功能给用上，除了改 sqlite3.c 文件、给你工程添加 SQLITE_HAS_CODEC 宏，还得修改你的数据库调用函数。

前面提到过，要开始一个数据库操作，必须先 sqlite3_open 。

加解密过程就在 sqlite3_open 后面操作。

假设你已经 sqlite3_open 成功了，紧接着写下面的代码：

   int i;

//添加、使用密码    

   i = sqlite3_key( db, "dcg", 3 );

   //修改密码

   i = sqlite3_rekey( db, "dcg", 0 );

用 sqlite3_key 函数来提交密码。

第1个参数是 sqlite3 * 类型变量，代表着用 sqlite3_open 打开的数据库（或新建数据库）。

第2个参数是密钥。

第3个参数是密钥长度。

用 sqlite3_rekey 来修改密码。参数含义同 sqlite3_key。

 

实际上，你可以在sqlite3_open函数之后，到 sqlite3_close 函数之前任意位置调用 sqlite3_key 来设置密码。

但是如果你没有设置密码，而数据库之前是有密码的，那么你做任何操作都会得到一个返回值：SQLITE_NOTADB，并且得到错误提示：“file is encrypted or is not a database”。

只有当你用 sqlite3_key 设置了正确的密码，数据库才会正常工作。

如果你要修改密码，前提是你必须先 sqlite3_open 打开数据库成功，然后 sqlite3_key 设置密钥成功，之后才能用sqlite3_rekey 来修改密码。

如果数据库有密码，但你没有用 sqlite3_key 设置密码，那么当你尝试用 sqlite3_rekey 来修改密码时会得到SQLITE_NOTADB 返回值。

如果你需要清空密码，可以使用：

//修改密码

i = sqlite3_rekey( db, NULL, 0 );

来完成密码清空功能。

 

4 sqlite3.c 最后添加代码段

 

/***

董淳光定义的加密函数

***/

\#ifdef SQLITE_HAS_CODEC

 

/***

加密结构

***/

\#define CRYPT_OFFSET 8

typedef struct _CryptBlock

{

BYTE*   ReadKey;   // 读数据库和写入事务的密钥

BYTE*   WriteKey;  // 写入数据库的密钥

int    PageSize;  // 页的大小

BYTE*   Data;

} CryptBlock, *LPCryptBlock;

 

\#ifndef DB_KEY_LENGTH_BYTE     /*密钥长度*/

\#define DB_KEY_LENGTH_BYTE  16  /*密钥长度*/

\#endif

 

\#ifndef DB_KEY_PADDING       /*密钥位数不足时补充的字符*/

\#define DB_KEY_PADDING    0x33 /*密钥位数不足时补充的字符*/

\#endif

 

 

/*** 下面是编译时提示缺少的函数 ***/

 

/** 这个函数不需要做任何处理，获取密钥的部分在下面 DeriveKey 函数里实现 **/

void sqlite3CodecGetKey(sqlite3* db, int nDB, void** Key, int* nKey)

{

return ;

}

 

/*被sqlite 和 sqlite3_key_interop 调用, 附加密钥到数据库.*/

int sqlite3CodecAttach(sqlite3 *db, int nDb, const void *pKey, int nKeyLen);

 

/**

这个函数好像是 sqlite 3.3.17前不久才加的，以前版本的sqlite里没有看到这个函数

这个函数我还没有搞清楚是做什么的，它里面什么都不做直接返回，对加解密没有影响

**/

void sqlite3_activate_see(const char* right )

{  

return;

}

 

int sqlite3_key(sqlite3 *db, const void *pKey, int nKey);

 

int sqlite3_rekey(sqlite3 *db, const void *pKey, int nKey);

 

/***

下面是上面的函数的辅助处理函数

***/

 

// 从用户提供的缓冲区中得到一个加密密钥

// 用户提供的密钥可能位数上满足不了要求，使用这个函数来完成密钥扩展

static unsigned char * DeriveKey(const void *pKey, int nKeyLen);

//创建或更新一个页的加密算法索引.此函数会申请缓冲区.

static LPCryptBlock CreateCryptBlock(unsigned char* hKey, Pager *pager, LPCryptBlock pExisting);

//加密/解密函数, 被pager调用

void * sqlite3Codec(void *pArg, unsigned char *data, Pgno nPageNum, int nMode);

//设置密码函数

int __stdcall sqlite3_key_interop(sqlite3 *db, const void *pKey, int nKeySize);

// 修改密码函数

int __stdcall sqlite3_rekey_interop(sqlite3 *db, const void *pKey, int nKeySize);

//销毁一个加密块及相关的缓冲区,密钥.

static void DestroyCryptBlock(LPCryptBlock pBlock);

static void * sqlite3pager_get_codecarg(Pager *pPager);

void sqlite3pager_set_codec(Pager *pPager,void *(*xCodec)(void*,void*,Pgno,int),void *pCodecArg  );

 

//加密/解密函数, 被pager调用

void * sqlite3Codec(void *pArg, unsigned char *data, Pgno nPageNum, int nMode)

{

LPCryptBlock pBlock = (LPCryptBlock)pArg;

unsigned int dwPageSize = 0;

 

if (!pBlock) return data;

 

// 确保pager的页长度和加密块的页长度相等.如果改变,就需要调整.

if (nMode != 2)

{

   PgHdr *pageHeader;

   pageHeader = DATA_TO_PGHDR(data);

   if (pageHeader->pPager->pageSize != pBlock->PageSize)

   {

​     CreateCryptBlock(0, pageHeader->pPager, pBlock);

   }

}

 

switch(nMode)

{

case 0: // Undo a "case 7" journal file encryption

case 2: //重载一个页

case 3: //载入一个页

   if (!pBlock->ReadKey) break;

 

 

   dwPageSize = pBlock->PageSize;

   My_DeEncrypt_Func(data, dwPageSize, pBlock->ReadKey, DB_KEY_LENGTH_BYTE ); /*调用我的解密函数*/

 

   break;

case 6: //加密一个主数据库文件的页

   if (!pBlock->WriteKey) break;

 

   memcpy(pBlock->Data + CRYPT_OFFSET, data, pBlock->PageSize);

   data = pBlock->Data + CRYPT_OFFSET;

 

 

   dwPageSize = pBlock->PageSize;

   My_Encrypt_Func(data , dwPageSize, pBlock->WriteKey, DB_KEY_LENGTH_BYTE ); /*调用我的加密函数*/

   break;

case 7: //加密事务文件的页

   /*在正常环境下, 读密钥和写密钥相同. 当数据库是被重新加密的,读密钥和写密钥未必相同.

   回滚事务必要用数据库文件的原始密钥写入.因此,当一次回滚被写入,总是用数据库的读密钥,

   这是为了保证与读取原始数据的密钥相同.

   */

   if (!pBlock->ReadKey) break;

 

   memcpy(pBlock->Data + CRYPT_OFFSET, data, pBlock->PageSize);

   data = pBlock->Data + CRYPT_OFFSET;

 

 

   dwPageSize = pBlock->PageSize;

   My_Encrypt_Func( data, dwPageSize, pBlock->ReadKey, DB_KEY_LENGTH_BYTE ); /*调用我的加密函数*/

   break;

}

 

return data;

}

 

//销毁一个加密块及相关的缓冲区,密钥.

static void DestroyCryptBlock(LPCryptBlock pBlock)

{

//销毁读密钥.

if (pBlock->ReadKey){

   sqliteFree(pBlock->ReadKey);

}

 

//如果写密钥存在并且不等于读密钥,也销毁.

if (pBlock->WriteKey && pBlock->WriteKey != pBlock->ReadKey){

   sqliteFree(pBlock->WriteKey);

}

 

if(pBlock->Data){

   sqliteFree(pBlock->Data);

}

 

//释放加密块.

sqliteFree(pBlock);

}

 

static void * sqlite3pager_get_codecarg(Pager *pPager)

{

return (pPager->xCodec) ? pPager->pCodecArg: NULL;

}

// 从用户提供的缓冲区中得到一个加密密钥

static unsigned char * DeriveKey(const void *pKey, int nKeyLen)

{

unsigned char * hKey = NULL;

int j;

 

if( pKey == NULL || nKeyLen == 0 )

{

   return NULL;

}

 

hKey = sqliteMalloc( DB_KEY_LENGTH_BYTE + 1 );

if( hKey == NULL )

{

   return NULL;

}

hKey[ DB_KEY_LENGTH_BYTE ] = 0;

if( nKeyLen < DB_KEY_LENGTH_BYTE )

{

   memcpy( hKey, pKey, nKeyLen ); //先拷贝得到密钥前面的部分

   j = DB_KEY_LENGTH_BYTE - nKeyLen;

   //补充密钥后面的部分

   memset( hKey + nKeyLen, DB_KEY_PADDING, j );

}

else

{ //密钥位数已经足够,直接把密钥取过来

   memcpy( hKey, pKey, DB_KEY_LENGTH_BYTE );

}

 

return hKey;

}

 

 

 

//创建或更新一个页的加密算法索引.此函数会申请缓冲区.

static LPCryptBlock CreateCryptBlock(unsigned char* hKey, Pager *pager, LPCryptBlock pExisting)

{

LPCryptBlock pBlock;

 

if (!pExisting) //创建新加密块

{

   pBlock = sqliteMalloc(sizeof(CryptBlock));

   memset(pBlock, 0, sizeof(CryptBlock));

   pBlock->ReadKey = hKey;

   pBlock->WriteKey = hKey;

   pBlock->PageSize = pager->pageSize;

   pBlock->Data = (unsigned char*)sqliteMalloc(pBlock->PageSize + CRYPT_OFFSET);

}

else //更新存在的加密块

{

   pBlock = pExisting;

   if ( pBlock->PageSize != pager->pageSize && !pBlock->Data){

​     sqliteFree(pBlock->Data);

​     pBlock->PageSize = pager->pageSize;

​     pBlock->Data = (unsigned char*)sqliteMalloc(pBlock->PageSize + CRYPT_OFFSET);

   }

}

 

 

memset(pBlock->Data, 0, pBlock->PageSize + CRYPT_OFFSET);

 

return pBlock;

}

 

/*

** Set the codec for this pager

*/

void sqlite3pager_set_codec(

​               Pager *pPager,

​               void *(*xCodec)(void*,void*,Pgno,int),

​               void *pCodecArg

​               )

{

pPager->xCodec = xCodec;

pPager->pCodecArg = pCodecArg;

}

 

 

int sqlite3_key(sqlite3 *db, const void *pKey, int nKey)

{

return sqlite3_key_interop(db, pKey, nKey);

}

 

int sqlite3_rekey(sqlite3 *db, const void *pKey, int nKey)

{

return sqlite3_rekey_interop(db, pKey, nKey);

}

 

/*被sqlite 和 sqlite3_key_interop 调用, 附加密钥到数据库.*/

int sqlite3CodecAttach(sqlite3 *db, int nDb, const void *pKey, int nKeyLen)

{

  int rc = SQLITE_ERROR;

  unsigned char* hKey = 0;

 

  //如果没有指定密匙,可能标识用了主数据库的加密或没加密.

  if (!pKey || !nKeyLen)

  {

​    if (!nDb)

​    {

​      return SQLITE_OK; //主数据库, 没有指定密钥所以没有加密.

​    }

​    else //附加数据库,使用主数据库的密钥.

​    {

​      //获取主数据库的加密块并复制密钥给附加数据库使用

​      LPCryptBlock pBlock = (LPCryptBlock)sqlite3pager_get_codecarg(sqlite3BtreePager(db->aDb[0].pBt));

 

​      if (!pBlock) return SQLITE_OK; //主数据库没有加密

​      if (!pBlock->ReadKey) return SQLITE_OK; //没有加密

 

​      memcpy(pBlock->ReadKey, &hKey, 16);

​    }

  }

  else //用户提供了密码,从中创建密钥.

  {

​    hKey = DeriveKey(pKey, nKeyLen);

  }

 

  //创建一个新的加密块,并将解码器指向新的附加数据库.

  if (hKey)

  {

​    LPCryptBlock pBlock = CreateCryptBlock(hKey, sqlite3BtreePager(db->aDb[nDb].pBt), NULL);

​    sqlite3pager_set_codec(sqlite3BtreePager(db->aDb[nDb].pBt), sqlite3Codec, pBlock);

​    rc = SQLITE_OK;

  }

  return rc;

}

 

// Changes the encryption key for an existing database.

int __stdcall sqlite3_rekey_interop(sqlite3 *db, const void *pKey, int nKeySize)

{

Btree *pbt = db->aDb[0].pBt;

Pager *p = sqlite3BtreePager(pbt);

LPCryptBlock pBlock = (LPCryptBlock)sqlite3pager_get_codecarg(p);

unsigned char * hKey = DeriveKey(pKey, nKeySize);

int rc = SQLITE_ERROR;

 

 

if (!pBlock && !hKey) return SQLITE_OK;

 

//重新加密一个数据库,改变pager的写密钥, 读密钥依旧保留.

if (!pBlock) //加密一个未加密的数据库

{

   pBlock = CreateCryptBlock(hKey, p, NULL);

   pBlock->ReadKey = 0; // 原始数据库未加密

   sqlite3pager_set_codec(sqlite3BtreePager(pbt), sqlite3Codec, pBlock);

}

else // 改变已加密数据库的写密钥

{

   pBlock->WriteKey = hKey;

}

 

// 开始一个事务

rc = sqlite3BtreeBeginTrans(pbt, 1);

 

if (!rc)

{

   // 用新密钥重写所有的页到数据库。

   Pgno nPage = sqlite3PagerPagecount(p);

   Pgno nSkip = PAGER_MJ_PGNO(p);

   void *pPage;

   Pgno n;

 

   for(n = 1; rc == SQLITE_OK && n <= nPage; n ++)

   {

​     if (n == nSkip) continue;

​     rc = sqlite3PagerGet(p, n, &pPage);

​     if(!rc)

​     {

​        rc = sqlite3PagerWrite(pPage);

​        sqlite3PagerUnref(pPage);

​     }

   }

}

 

// 如果成功，提交事务。

if (!rc)

{

   rc = sqlite3BtreeCommit(pbt);

}

 

// 如果失败，回滚。

if (rc)

{

   sqlite3BtreeRollback(pbt);

}

 

// 如果成功，销毁先前的读密钥。并使读密钥等于当前的写密钥。

if (!rc)

{

   if (pBlock->ReadKey)

   {

​     sqliteFree(pBlock->ReadKey);

   }

   pBlock->ReadKey = pBlock->WriteKey;

}

else// 如果失败，销毁当前的写密钥，并恢复为当前的读密钥。

{

   if (pBlock->WriteKey)

   {

​     sqliteFree(pBlock->WriteKey);

   }

   pBlock->WriteKey = pBlock->ReadKey;

}

 

// 如果读密钥和写密钥皆为空，就不需要再对页进行编解码。

// 销毁加密块并移除页的编解码器

if (!pBlock->ReadKey && !pBlock->WriteKey)

{

   sqlite3pager_set_codec(p, NULL, NULL);

   DestroyCryptBlock(pBlock);

}

 

return rc;

}

 

/***

下面是加密函数的主体

***/

int __stdcall sqlite3_key_interop(sqlite3 *db, const void *pKey, int nKeySize)

{

 return sqlite3CodecAttach(db, 0, pKey, nKeySize);

}

 

// 释放与一个页相关的加密块

void sqlite3pager_free_codecarg(void *pArg)

{

if (pArg)

   DestroyCryptBlock((LPCryptBlock)pArg);

}

 

\#endif //#ifdef SQLITE_HAS_CODEC

> 参考：
> [SQLITE3 使用总结（直接使用C函数）](https://www.cnblogs.com/findumars/p/9048286.html)