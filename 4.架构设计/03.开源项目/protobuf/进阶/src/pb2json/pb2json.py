#!/usr/bin/python
# -*- coding: utf-8 -*-
#pb2json.py
"""
note: the document of protobuf to the document of json
      @allright by Jevstein 2020.03.18
"""

import os
import re
import copy
import platform

_os_name_ = platform.system()

_qualifiers_ = ('repeated', 'optional', 'required')
_int_types_ = ('int32', 'uint32', 'int64', 'uint64', 'fixed64')
_str_types_ = ('string', 'bytes')
_bool_types_ = ('bool')
_json_space_ = '   '

def log_dbg(*args):
    # print('[dbg]: {0}'.format(args))
    # print("".join('{0}'.format(args)))
    print('[debug]:', *args)

def log_err(*args):
    # print('[error]: {0}'.format(args))
    print('[error]:', *args)

def replace_end_flag(content):
    len1 = len(',\n')
    len2 = len(content)
    idx = content.rfind(',\n')
    if (idx == (len2 - len1)):
        content = content[0:idx] + '\n'
    else:
        idx = content.rfind(',//')
        content = content[0:idx] + content[idx + 1:]
    return content

# class BuidJson()

#语法分析器：不检查proto的格式错误
class GrammarParser():
    def __init__(self, content):
        self.version_ = "proto2"
        self.content_ = content.replace('\t', ' ')
        self.content_ = self.content_.strip()
        self.contents_ = list(filter(None, self.content_.split(' ')))
        # print(self.contents_)

    def __ignore__(self):
        if (self.content_ == ''):
            return True
        if (self.content_[0:len('\n')] == '\n'):
            return True
        if (self.content_[0:len('//')] == '//'):
            return True
        if (self.content_[0:len('#')] == '#'):
            return True
        if (self.content_[0:len('/*')] == '/*'):
            return True
        if (self.content_[0:len('option ')] == 'option '): #option java_、 option go_
            return True
        return False

    def __syntax__(self):
        if (self.contents_[0] != 'syntax'):
            return False, ''
        idx = self.content_.find('"')
        if idx == -1:
            return False, ''
        return True, self.content_[0:len('proto2')]

    def __proto__(self):
        if (self.contents_[0] != 'import'):
            return False, ''
        idx1 = self.contents_[1].find('"')
        idx2 = self.contents_[1].rfind('"')
        if (idx1 == -1) or (idx2 <= idx1):
            return False, ''
        return True, self.contents_[1][idx1+1:idx2]

    def __package_x__(self):
        if (self.contents_[0] != 'package'):
            return False, ''
        return True, self.contents_[1].replace(';', '')

    def __brace__(self):
        if (self.content_[0:1] == '{'):
            return '{'
        if (self.content_[0:1] == '}'):
            return '}'
        return ''

    def __enum__(self):
        if (self.contents_[0] != 'enum'):
            return False, ''
        return True, self.contents_[1]

    def __message__(self):
        if (len(self.contents_) >= 2):
            if (self.contents_[0] == 'message') and (self.contents_[1].strip() != ''):
                xmsg = XMessage(self.contents_[1].strip())
                if (len(self.contents_) > 2 and self.contents_[2] == '{'):
                    xmsg.left_brace_ = '{'
                return True, xmsg
        return False,XMessage('')

    def __item__(self):
        if (self.contents_[0] not in _qualifiers_): #修饰符
            # print('invalid xitem: ', self.content_)
            return False, XItem('','','','')
        comment = '' if (self.content_.find('//') == -1) else self.content_[self.content_.find('//') + 2:].strip()
        return True, XItem(self.contents_[0], self.contents_[1], self.contents_[2], comment)

    def __opcode_message__(self):
        if (self.contents_[0] != 'enum'):
            return False, ''
        return True, self.contents_[1]

    def __opcode_item__(self):
        idx1 = self.content_.find('=') + 1
        idx2 = self.content_.find(',')
        if (idx1 == -1 or idx2 <= idx1):
            return False, '', 0
        v = self.content_[idx1:idx2].strip()
        return True, self.contents_[0], v

class XEnum():
    def __init__(self, name):
        self.name_ = name
        self.left_brace_ = ''   # {
        self.enum_item = ''
        self.right_brace_ = ''  # }

    def __clear__(self):
        self.name_ = ''
        self.left_brace_ = ''
        self.enum_item = ''
        self.right_brace_ = ''

class XItem():
    def __init__(self, qualifier, type, name, comment):
        self.qualifier_ = qualifier #修饰符
        self.type_ = type           #类型
        self.name_ = name           #名称
        self.comment_ = comment     #注释

    def __members__(self):
        print(self.__class__.__name__, vars(self))
        # print('"', self.name_, '":0, //', self.comment_)

    def __Ret__(self, space_num):
        body = ''
        if self.type_ == 'Ret':
            body += '{\n'
            body += ((space_num + 1) * _json_space_) + '"ret": 0,\n'
            body += ((space_num + 1) * _json_space_) + '"ret_msg": ""\n'
            body += (space_num * _json_space_) + '}'
            return True, body
        return False, body

    def __CidUid__(self, space_num):
        body = ''
        if self.type_ == 'CidUid':
            body += '{\n'
            body += ((space_num + 1) * _json_space_) + '"cid": 0,\n'
            body += ((space_num + 1) * _json_space_) + '"uid": 0\n'
            body += (space_num * _json_space_) + '}'
            return True, body
        return False, body

    def __body__(self, space_num):
        while (1):
            ret, body = self.__Ret__(space_num)#ret
            if ret:
                break
            ret, body = self.__CidUid__(space_num)#ciduid
            if ret:
                break
            ret = False
            body = ''
            break
        return ret, body
    
    def __to_json_item__(self, xproto, space_num, is_comment):
        ret = True
        jsitem = space_num * _json_space_
        jsitem += '"' + self.name_ + '":'
        if self.type_ in _int_types_:
            body = '0'
        elif self.type_ in _str_types_:
            body = '""'
        elif self.type_ in _bool_types_:
            body = 'true'
        elif xproto.__existed_enum__(self.type_):
            body = '0'
        elif xproto.xdoc_.__existed_ipt_enum__(self.type_):
            body = '0'
        else:
            ret, body = self.__body__(space_num)
            if not ret:
                body = '{}'
        jsitem += ('[' + body + ']') if self.qualifier_=='repeated' else body
        jsitem += ',' 
        if (is_comment and self.comment_ != ''):
            jsitem += '//' + self.comment_
        jsitem += '\n'
        return ret, jsitem

class XMessage():
    def __init__(self, name):
        self.name_ = name
        self.left_brace_ = ''   # {
        self.xmsgs_ = {}        #   <name, XMessage>
        self.xitems_ = []       #   XItem
        self.right_brace_ = ''  # }
        self.xmsg_ing_ = None   # XMessage
        self.opcode_ = None

    def __clear__(self):
        self.name_ = ''
        self.left_brace_ = ''
        self.xmsgs_.clear()
        self.xitems_.clear()
        self.right_brace_ = ''
        if self.xmsg_ing_ is not None:
            self.xmsg_ing_.__clear__()

    def __bind__(self, opcode):
        self.opcode_ = opcode

    def __name_withop_(self):
        return self.name_ if self.opcode_ is None else (self.name_ + '-' + self.opcode_)

    def __members__(self):
        print(self.__class__.__name__, vars(self))

    def __empty__(self):
        return True if (self.name_ == '' and self.left_brace_== '' and self.right_brace_ == '') else False

    def __valid__(self):
        return True if (self.name_ != '' and self.left_brace_== '{' and self.right_brace_ == '}') else False

    def __add__(self, parser):
        if self.name_ == '':
            log_err('invalid message!')
            return False

        if self.xmsg_ing_ is None:
            self.xmsg_ing_ = XMessage('')

        # xmsg_ing_
        if self.xmsg_ing_.name_ != '':
            if self.xmsg_ing_.__add__(parser):
                if self.xmsg_ing_.__valid__():
                    self.xmsgs_[self.xmsg_ing_.name_] = copy.deepcopy(self.xmsg_ing_)
                    self.xmsg_ing_.__clear__()
                return True
            log_err("failed to parse xmsg_ing!")
            return False
        # {
        if self.left_brace_ == '':
            if parser.__brace__() == '{':
                self.left_brace_ = '{'
                return True
            if parser.__brace__() == '}':
                log_err("invalid brace!")
            return False
        # }
        if parser.__brace__() == '}':
            self.right_brace_ = '}'
            return True
        # XItem 
        ret, xitem = parser.__item__()
        if ret:
            self.xitems_.append(xitem)
            return True
        # XMessage
        ret, xmsg = parser.__message__()
        if ret:
            if not self.xmsg_ing_.__empty__():
                log_err("xmsg not empty!")
                return False
            self.xmsg_ing_ = xmsg
            return True
        
        log_err("failed to add msg!")
        return False

    def __to_json_message__(self, xproto, space_num, ofxitem, is_comment):
        i = 0
        is_repeated = (ofxitem is not None) and (ofxitem.qualifier_=='repeated')
        # e.g:  "name": [{//注释 \n
        jsmsg = (space_num * _json_space_)
        jsmsg += '"' + (self.__name_withop_() if ofxitem is None else ofxitem.name_) + '": '
        jsmsg += '[{' if is_repeated else '{'
        if ((ofxitem is not None) and (is_comment and ofxitem.comment_ != '')):
            jsmsg += '//' + ofxitem.comment_
        jsmsg += '\n'
        for xitem in self.xitems_:
            i += 1
            ret, jsitem = xitem.__to_json_item__(xproto, space_num + 1, is_comment)
            if ret:
                jsmsg += jsitem
            else:
                js_msg_item = jsitem
                if xitem.type_ in self.xmsgs_.keys():
                    ret, js_msg_item = self.xmsgs_[xitem.type_].__to_json_message__(xproto, space_num + 1, xitem, is_comment)
                elif xitem.type_ in xproto.xmsgs_.keys():
                    ret, js_msg_item = xproto.xmsgs_[xitem.type_].__to_json_message__(xproto, space_num + 1, xitem, is_comment)
                else:
                    ret, ipt_xproto, ipt_xitem_type = xproto.xdoc_.__find_xproto__(xproto, xitem.type_)
                    if ret:
                        ret, js_msg_item = ipt_xproto.xmsgs_[ipt_xitem_type].__to_json_message__(ipt_xproto, space_num + 1, xitem, is_comment)
                    else:
                        log_err('invalid type!', self.name_ + ':' + xitem.type_ + ':' + xitem.name_)
                        # return False, jsmsg+js_msg_item
                jsmsg += js_msg_item
            if i == len(self.xitems_):
                jsmsg = replace_end_flag(jsmsg)
        jsmsg += (space_num * _json_space_) + ('}],\n' if is_repeated else '},\n')

        return True, jsmsg

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
    
    def __existed_enum__(self, enum_name):
        return True if enum_name in self.enums_ else False

    def __load__(self):
        ret_code = True
        f = open(self.filename_, 'r', encoding='UTF-8')
        xenum = XEnum('')
        xmsg_ing = XMessage('')
        line_num = 0
        for line in f: 
            line_num += 1
            parser = GrammarParser(line)
            if parser.__ignore__():
                continue

            # print(line)

            #1.syntax
            ret, syntax = parser.__syntax__()
            if ret:
                self.syntax_ = syntax
                continue
            #2.proto name
            ret, proto_name = parser.__proto__()
            if ret:
                self.proto_names_.append(proto_name)
                continue
            #3.package name
            ret, package = parser.__package_x__()
            if ret:
                self.package_ = package
                continue
            #4.enum
            ret, enum_name = parser.__enum__()
            if ret:
                xenum.name_ = enum_name
                self.enums_.append(enum_name)
                continue
            if xenum.name_ != '':
                if parser.__brace__() == '}':
                    xenum.__clear__()
                continue
            #5.xmsg_ing
            if xmsg_ing.__empty__():#create
                ret, xmsg = parser.__message__()
                if ret:
                    xmsg_ing = xmsg
                    continue
                ret_code = False
                log_err(self.__class__.__name__, ": failed to parse msging for invalid message! -->")
                log_err(self.filename_,'[' + str(line_num) + ']: ', line)
                break
            else:#inner
                if xmsg_ing.__add__(parser):
                    if xmsg_ing.__valid__():
                        self.xmsgs_[xmsg_ing.name_] = copy.deepcopy(xmsg_ing)
                        xmsg_ing.__clear__()
                    continue
                ret_code = False
                log_err(self.__class__.__name__, ": failed to add msging for invalid message! -->")
                log_err(self.filename_,'[' + str(line_num) + ']: ', line)
                break
        f.close()
        return ret_code

    def __load_imports__(self):
        for i in self.proto_names_:
            ret, filename = self.xdoc_.__filepath__(i)
            if not ret:
                log_err(self.__class__.__name__, ":", i, "is not existed!")
                continue
            if self.xdoc_.__existed_proto__(filename):
                # log_dbg(self.__class__.__name__, ":", i, "is loaded!")
                continue
            proto = XProto(filename, self.xdoc_)
            log_dbg('--- load import proto:', proto.filename_, '---')
            if not proto.__load__():
                log_err(self.__class__.__name__, 'failed to load:', proto.filename_)
                continue
            self.xdoc_.__append_xproto__(proto)
        return True

    def __build_json__(self, xopcode, jsfilename, mask_req):
        i = 0
        fileobj = open(jsfilename, 'w', encoding='UTF-8')
        self.__js_write__(fileobj, '{\n')
        for name, xmsg in self.xmsgs_.items():
            i += 1
            opcode = xopcode.__opcode_value__(name, mask_req)
            if opcode is None:
                continue
            xmsg.__bind__(opcode)
            is_comment = False if mask_req else True
            ret, jsmsg = xmsg.__to_json_message__(self, 1, None, is_comment)
            if i == len(self.xmsgs_):
                jsmsg = replace_end_flag(jsmsg)
            self.__js_write__(fileobj, jsmsg)
        self.__js_write__(fileobj, '}\n')
        fileobj.close()

    def __js_write__(self, fileobj, jsdata):
        fileobj.write(jsdata)
        # print(jsdata)

class XOpcode():
    def __init__(self, name):
        self.enums_ = {} #{enum: {name: opcode}}
        self.filename_ = name

    def __load__(self):
        f = open(self.filename_, 'r', encoding='UTF-8')
        enum_name = ''
        opcodes = {}
        line_num = 0
        for line in f:
            line_num += 1
            parser = GrammarParser(line)
            if parser.__ignore__():
                continue

            # print(line)

            #1.enum
            ret, data = parser.__opcode_message__()
            if ret:
                enum_name = data
                continue

            #2.{},opcode
            if parser.__brace__() == '{':
                opcodes.clear()
            elif parser.__brace__() == '}':
                self.enums_[enum_name] = copy.deepcopy(opcodes)
            else:
                ret, op_name, op_value = parser.__opcode_item__()
                if ret:
                    opcodes[op_name] = op_value
                else:
                    log_err(self.__class__.__name__, ": failed to parse opcode! -->")
                    log_err(self.filename_,'[' + str(line_num) + ']: ', line)
        f.close()

    def __opcode_value__(self, xmsg_name, mask_req):
        #Req
        idx = xmsg_name.rfind('Req')
        if (idx == (len(xmsg_name) - len('Req'))):
            op_name = 'kOP' + xmsg_name[0:idx]
            return self.enums_['IMSdkOpcode'][op_name] if (op_name in self.enums_['IMSdkOpcode'].keys()) else None
        if mask_req:
            return None
        #Ack
        idx = xmsg_name.rfind('Ack')
        if (idx == (len(xmsg_name) - len('Ack'))):
            op_name = 'kOP' + xmsg_name[0:idx]
            return self.enums_['IMSdkOpcode'][op_name] if (op_name in self.enums_['IMSdkOpcode'].keys()) else None
        #Noti
        idx = xmsg_name.rfind('Noti')
        if (idx == (len(xmsg_name) - len('Noti'))):
            op_name = 'kNoti' + xmsg_name[0:idx]
            return self.enums_['IMSdkNotice'][op_name] if (op_name in self.enums_['IMSdkNotice'].keys()) else None
        return None

    def __all_members__(self):
        for k,v in self.enums_.items():
            print('enum', k, '{')
            for opn, opv in v.items():
                print('  ', opn, ':', opv)
            print('}')

class DocPb2Json():
    def __init__(self, *dirs):
        self.rootdir_ = os.getcwd() #'E:\weaver\workspace\project\IMServer\imsdk\protocol' #'/Users/jevstein/Desktop/eteams/pb2json'
        self.workdir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'proto')      #./sdk/pbjson/proto
        self.import_dirs_ = [] #'{0}'.format(dirs)                                 #(./data/proto, ) 
        self.jsdoc_dir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'json_doc') #./sdk/pbjson/json_doc
        self.jsdbg_dir_ = os.path.join(self.rootdir_, 'sdk', 'pbjson', 'json_dbg') #./sdk/pbjson/json_dbg
        self.xprotos_ = {}      #{package:{filename:xproto}}
        self.work_xprotos = {}  #{package:xproto}
        self.xopcode_ = XOpcode(os.path.join(self.rootdir_, 'sdk', 'pbjson', 'opcode.h'))
        for i in dirs:
            self.import_dirs_.append(os.path.join(i, 'proto'))

    def __filepath__(self, protoname):
        for i in self.import_dirs_:
            filename = os.path.join(self.rootdir_, i, protoname)
            if os.path.exists(filename):
                return True, filename
        return False, ""

    def __existed_proto__(self, filename):
        for v in self.xprotos_.values():
            if filename in v.keys():
                return True
        return False
        
    def __existed_ipt_enum__(self, enum_name):
        for v in self.xprotos_.values():
            for xproto in v.values():
                if xproto.__existed_enum__(enum_name):
                    return True
        return False

    def __find_xproto__(self, xproto, xmsg_type):
        packages = list(filter(None, xmsg_type.split('.')))
        if len(packages) == 1:
            xtype = packages[0]
            for v in self.xprotos_.values():
                for k in v.keys():
                    if os.path.basename(k) in xproto.proto_names_:
                        if xtype in v[k].xmsgs_.keys():
                            return True, v[k], xtype
        elif len(packages) > 1:
            package = packages[0]
            xtype = packages[1]
            if package in self.xprotos_.keys():
                for k in self.xprotos_[package].keys():
                    if os.path.basename(k) in xproto.proto_names_:
                        if xtype in self.xprotos_[package][k].xmsgs_.keys():
                            return True, self.xprotos_[package][k], xtype
        return False, None, None

    def __append_xproto__(self, xproto):
        if xproto.package_ in self.xprotos_:
            if xproto.filename_ in self.xprotos_[xproto.package_]:
                return False
            self.xprotos_[xproto.package_][xproto.filename_] = xproto
            return True
        file_xprotos = {}
        file_xprotos[xproto.filename_] = xproto
        self.xprotos_[xproto.package_] = file_xprotos
        return True

    def __run__(self):
        #1.加载opcode
        log_dbg('--- load opcode:', self.xopcode_.filename_, '---')
        self.xopcode_.__load__()
        self.xopcode_.__all_members__()

        #2.遍历work目录,加载proto
        for root, dirs, files in os.walk(self.workdir_):
            for f in files:
                if not f.endswith('.proto'):
                    continue
                #1）加载protos
                proto = XProto(os.path.join(root, f), self)
                log_dbg('--- load local proto:', proto.filename_, '---')
                if not proto.__load__():
                    log_err('failed to load:', proto.filename_)
                    continue
                self.work_xprotos[proto.package_] = proto
                #2）加载import protos
                proto.__load_imports__()
                
        #3.proto to json
        for xproto in self.work_xprotos.values():
            #1.doc
            jsfilename = os.path.join(self.jsdoc_dir_, xproto.jsfilename_)
            log_dbg('--- to json:', jsfilename, '---')
            xproto.__build_json__(self.xopcode_, jsfilename, False)

            #2.dbg
            jsfilename = os.path.join(self.jsdbg_dir_, xproto.jsfilename_)
            log_dbg('--- to json:', jsfilename, '---')
            xproto.__build_json__(self.xopcode_, jsfilename, True)

def main():
    print("================== the document from proto to json ==================")
    if (_os_name_ == "Windows"):
	    xdoc = DocPb2Json('sdk\pbjson', 'data', 'helper', 'common', 'userstatus', 'ppchat', 'sysmsg', 'mongodb', 'group', 'office')
    else:
        xdoc = DocPb2Json('sdk/pbjson', 'data', 'helper', 'common', 'userstatus', 'ppchat', 'sysmsg', 'mongodb', 'group', 'office')
    xdoc.__run__()
    print("================== sucessfully ==================")

if __name__ == "__main__":
    main()