[TOC]

# proto文档批量转成json文档的python脚本实现

## 1.背景需求

​	根据imsdk2.0接口与业务彻底解耦的最新设计 -- 所有的业务数据都通过一个异步接口和一个异步结果回调完成app与sdk间的传递，业务数据统一采用json格式进行序列化；但sdk用c++开发，内部数据采用protobuf进行定义和序列化，于是需要将定义proto的文档转成json的文档，提供给app开发人员阅读。即app开发人员不关心protobuf的定义，只关心sdk提供的业务操作和json格式定义。如下目录结构：

```shell
#一、呈现给APP开发人员目录结构：
`-- pbjson
	|-- json_doc #带详细注释的json格式的协议定义
	|   |-- sdk_ai.json
	|   |-- sdk_chat_msg.json
	|   |-- sdk_common.json
	|   |-- sdk_group.json
	|   |-- sdk_group_msg.json
	|   |-- sdk_login.json
	|   |-- sdk_office.json
	|   |-- sdk_other.json
	|   |-- sdk_ppchat_msg.json
	|   |-- sdk_remind.json
	|   |-- sdk_rss.json
	|   |-- sdk_session.json
	|   |-- sdk_sysmsg.json
	|   |-- sdk_topic.json
	|   |-- sdk_user.json
	|   |-- sdk_user_relation.json
	|   `-- sdk_user_sound.json
	`-- opcode.h #imsdk提供的业务操作(与json数据一一对应)
	
#二、呈现给APP开发人员的部分文件内容：
    #------------------ 1.业务操作opcode.h ------------------
    #ifndef _IMSDK_OPCODE_
    #define _IMSDK_OPCODE_
    enum IMSdkNotice //通知
    {
        kNotiExitCorp						= 100, //退出团队logout 通知
        kNotiBeForceLogout					= 101, //被强制退出logout 通知
        -- 其它略 --
    };
    enum IMSdkOpcode //操作码
    {
        kOPLoginParams						= 1001,	//设置登录参数
        kOPLogin							= 1002,	//登录
        kOPLogout							= 1003,	//登出
        -- 其它略 --
    };
    #endif//_IMSDK_OPCODE_

    #------------------ 2.json格式举例 ------------------ 
    {
        "ConnectLoginStatusReportNoti-650": {
            "type":0,//上报类型(1:连接登陆执行中; 2:连接登陆成功; 3:连接登陆失败; 4:连接断开)
            "failed_code":0,//连接登陆失败时的错误码(type==3时使用)
            "disconnect_code":0,//断开时的错误码(type==4时使用)
            "msg":""//附加描述信息
        },
        "SetLoginParamsReq-1001": {
            "corp_account":"",//eteams团队标识
            "user_account":"",//eteams用户账号
            "gcid":0,//eteams编号
            -- 其它略 -- 
        },
        "SetLoginParamsAck-1001": {
            "ret":{
                "ret": 0,
                "ret_msg": ""
            }
        }
        -- 其它略 --
    }
```

​	而sdk相关protobuf定义的目录结构，和需要转成json文档的目录结构如下：

```shell
.
|-- common
|   `-- proto
|       |-- base.proto
|       `-- status_data.proto
|-- data
|   `-- proto
|       |-- user.proto
|       |-- user_relation.proto
|       `-- user_sound.proto
|-- helper
|   `-- proto
|       |-- helper.proto
|       |-- rss.proto
|       `-- topic.proto
`-- sdk
|    `-- pbjson
|        |-- opcode.h
|        |-- json_dbg #不带注释的json数据，供调试
|        |   |-- （中间略）
|        |   `-- sdk_user_sound.json
|        |-- json_doc #带注释的json格式文档
|        |   |-- （中间略）
|        |   `-- sdk_user_sound.json
|        `-- proto
|		     |-- sdk_ai.proto
|		     |-- sdk_chat_msg.proto
|		     |-- sdk_common.proto
|		     |-- sdk_group.proto
|		     |-- sdk_group_msg.proto
|		     |-- sdk_helper.proto
|		     |-- sdk_login.proto
|		     |-- sdk_office.proto
|		     |-- sdk_other.proto
|		     |-- sdk_ppchat_msg.proto
|		     |-- sdk_remind.proto
|		     |-- sdk_rss.proto
|		     |-- sdk_session.proto
|		     |-- sdk_sysmsg.proto
|		     |-- sdk_topic.proto
|		     |-- sdk_user.proto
|		     |-- sdk_user_relation.proto
|		     `-- sdk_user_sound.proto
`--pb2json.py
```

​	其中，./sdk/pbjson/proto下面的protobuf定义的协议，定义出了sdk能提供给app的所有业务功能；其它的proto文件，是sdk与服务器的通讯协议，这些协议有部分需要被./sdk/pbjson/proto下的proto文件所引用。

​	但是，所有的proto文件对app开发人员对是完全透明的，即app开发人员只关心json格式定义出来的协议。为了避免手工书写json格式协议文档带来的麻烦（重复劳动、易错、耗时），则需要一个脚本./sdk/pb2json.py，一键完成proto到json的转换，且满足json_doc文件夹下的json文档需要带详细注释，json_dbg文件夹下的json数据可直接用于进行sdk调试。



## 2.方案调研

​	技术调研中，发现网络上有2种方法，可实现protobuf数据到json数据的转换：一、开源的pbjson.py文件，见[GitHub.NextTuesday.py-pb-converters](https://github.com/NextTuesday/py-pb-converters)；二、利用protobuf自身的语法支持，同样可以实现在python语法下，将protobuf数据到json数据的转换。

​	但是以上两种办法，都是只将protobuf数据转换成json数据，也就是说，需要优先构造出protobuf的数据再进行转换，且无法将proto文件中定义出来的注释拷贝到json文档中。故无法满足当下需求。

​	于是决定采用**自定义方案**： <font color=red>完全手写python脚本，逐一读取所有proto文件的内容（包括import的proto定义），经过格式转换，分别写入到对应的json文件中去</font>。



## 3.具体实现

​	脚本代码详见：http://wenqiang.yi@git.teems.cn/scm/im/imsdk.git/imsdk/protocol/pb2json.h

* 1.抽象出proto文件的属性

  ```python
  #枚举：enum { SYNCTYPE_ALL = 0; }
  class XEnum():
      def __init__(self, name):
          self.name_ = name
          self.left_brace_ = ''   # {
          self.enum_item = ''
          self.right_brace_ = ''  # }
          
  #protobuf项： required uint32 ret = 1;
  class XItem():
      def __init__(self, qualifier, type, name, comment):
          self.qualifier_ = qualifier #修饰符
          self.type_ = type           #类型
          self.name_ = name           #名称
          self.comment_ = comment     #注释
      def __to_json_item__(self, xproto, space_num, is_comment):
          #-- snip --
  
  #proto message: message UpdateRobotReq {}
  class XMessage():
      def __init__(self, name):
          self.name_ = name
          self.left_brace_ = ''   # {
          self.xmsgs_ = {}        #   <name, XMessage>
          self.xitems_ = []       #   XItem
          self.right_brace_ = ''  # }
          self.xmsg_ing_ = None   # XMessage
          self.opcode_ = None
      def __to_json_message__(self, xproto, space_num, ofxitem, is_comment):
          #-- snip --
  ```

* 2.单个proto

  ```python
  #proto
  class XProto():
      def __init__(self, filename, xdoc):
          self.filename_ = filename
          self.syntax_ = 'proto2'
          self.proto_names_ = []
          self.package_ = ''
          self.xmsgs_ = {} #{name:XMessage}
          self.jsfilename_ = os.path.basename(filename.replace('.proto', '.json'))
          self.xdoc_ = xdoc
          self.enums_ = []
      def __load__(self): #加载app-sdk的交互协议
          #-- snip --
      def __load_imports__(self): #加载导入的proto
          #-- snip --
      def __build_json__(self, xopcode, jsfilename, mask_req):
          #-- snip --
  ```

* 3.读取opcode.h，用于过滤app所需的proto message

  ```python
  #opcode: 用于过滤app所需的proto message，eg:UpdateRobotReq/UpdateRobotAck/UpdateRobotNoti
  class XOpcode():
      def __init__(self, name):
          self.enums_ = {} #{enum: {name: opcode}}
          self.filename_ = name
  ```

* 4.语法分析: 分析proto的语法，解析出各个参数放于内存 

  ```python
  class GrammarParser():
      def __init__(self, content):
          self.version_ = "proto2"
          self.content_ = content.replace('\t', ' ')
          self.content_ = self.content_.strip()
          self.contents_ = list(filter(None, self.content_.split(' ')))
          
      def __ignore__(self):
          #-- snip --
      def __syntax__(self):
          #-- snip --
      def __proto__(self):
          #-- snip --
      def __package_x__(self):
          #-- snip --
      def __brace__(self):
          #-- snip --
      def __enum__(self):
          #-- snip --
      def __message__(self):
          #-- snip --
      def __item__(self):
          #-- snip --
      def __opcode_message__(self):
          #-- snip --
      def __opcode_item__(self):
          #-- snip --
  ```

* 5.DocPb2Json: 批量将proto转换成json

  ```python
  class DocPb2Json():
      def __init__(self, *dirs):
          self.rootdir_ = os.getcwd() 
          self.workdir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'proto')
          self.import_dirs_ = []
          self.jsdoc_dir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'json_doc')
          self.jsdbg_dir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'json_dbg') 
          self.xprotos_ = {}      #{package:{filename:xproto}}
          self.work_xprotos = {}  #{package:xproto}
          self.xopcode_ = XOpcode(os.path.join(self.rootdir_, 'sdk', 'pbjson', 'opcode.h'))
          for i in dirs:
              self.import_dirs_.append(os.path.join(i, 'proto'))
      def __run__(self):
          #-- snip --
  ```



## 4.效果呈现

python3执行pb2json.py脚本：

```shell
E:\weaver\workspace\project\IMServer\imsdk\protocol> python3 pb2json.py
================== the document from proto to json ==================
[debug]: --- load opcode: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\opcode.h ---
enum IMSdkNotice {
   kNotiExitCorp : 100
   kNotiBeForceLogout : 101
   -- snip --
}
enum IMSdkOpcode {
   kOPSetLoginParams : 1001
   kOPLogin : 1002
   -- snip --
}
[debug]: --- load local proto: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\proto\sdk_ai.proto ---
[debug]: --- load import proto: E:\weaver\workspace\project\IMServer\imsdk\protocol\common\proto\base.proto ---
[debug]: --- load local proto: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\proto\sdk_chat_msg.proto ---
[debug]: --- load import proto: E:\weaver\workspace\project\IMServer\imsdk\protocol\helper\proto\helper.proto ---
[debug]: --- load import proto: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\proto\sdk_ppchat_msg.proto ---
   -- snip --
[debug]: --- to json: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\json_dbg\sdk_user_relation.json ---
[debug]: --- to json: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\json_doc\sdk_user_sound.json ---
[debug]: --- to json: E:\weaver\workspace\project\IMServer\imsdk\protocol\sdk\pbjson\json_dbg\sdk_user_sound.json ---
================== sucessfully ==================
```

![脚本运行效果图](../images/pb2json.png)