#ifndef _IMSDK_OPCODE_
#define _IMSDK_OPCODE_

 // 通知
//enum class IMSdkNotice : uint32_t
enum IMSdkNotice
{
	//登录相关通知(100-149)
	kNotiExitCorp						= 100, //退出团队logout 通知
	kNotiBeForceLogout					= 101, //被强制退出logout 通知
	kNotiServerCloseConnect				= 102, //服务器由于未知原因即将主动断开连接 通知
	kNotiBeSetDevLogout					= 103, //被自己的其他设备设置为logout下线 通知
	kNotiUnknownReasonLogout			= 104, //由于未知的原因收到logout 通知
	kNotiUserStatusChange				= 105, //用户状态改变 通知

	//单聊消息相关通知(150-199)
	kNotiSendSingleMsg					= 150, //单聊消息 通知
	kNotiSetSingleMsgReadStatus			= 151, //单聊消息阅读状态 通知
	kNotiMakeSingleMsgWithdraw			= 152, //单聊消息撤回 通知
	kNotiForwardMsg 					= 153, //消息转发 通知

	//群组相关通知(200-249)			           
	kNotiCreateGroup 					= 200, //建群成功 通知
	kNotiInviteToGroup 					= 201, //群组邀请 通知
	kNotiExitGroup 						= 202, //退出群组 通知
	kNotiKickGroupMember 				= 203, //踢出群成员 通知
	kNotiModifyGroupInfo 				= 204, //修改群组信息 通知
	kNotiSetGroupAdmin					= 205, //设置管理员 通知
	kNotiModifyGroupAvatar				= 206, //修改群组头像 通知
	kNotiSetGroupRSOnOff				= 207, //设置群组阅读状态开关 通知
	kNotiGroupApplyReply				= 208, //接受申请群 通知
	kNotiSetGroupOnOff					= 209, //设置群组开关 通知
	kNotiDestroyGroup					= 210, //群组解散 通知
	kNotiSetGroupMsgPrivilege 			= 211, //设置群成员可拉取加入群组之前的历史消息的权限 通知
	kNotiDelGroupMsgPrivilege 			= 212, //删除群成员可拉取加入群组之前的历史消息的个人权限 通知
	kNotiAddGroupLabel 					= 213, //添加群标签 通知
	kNotiDelGroupLabel 					= 214, //删除群标签 通知

	//群组消息相关通知(250-299)
	kNotiSendGroupMsg					= 250, //发送群组消息 通知
	kNotiMakeGroupMsgWithdraw			= 251, //群消息撤回 通知
	kNotiGroupMsgScreen					= 252, //群消息屏蔽 通知
	kNotiSetGroupMsgReadStatus			= 253, //群消息阅读状态 通知
											   
	//系统消息相关通知(300-349)				   
	kNotiSysMsg							= 300, //系统消息 通知
	kNotiModifySysMsg					= 301, //系统消息修改 通知
	kNotiUndoMsg						= 302, //发送撤回消息 通知
	kNotiSetSysMsgReadStatus			= 303, //系统消息标记已读状态 通知
	kNotiSetSysMsgUnReadStatus			= 304, //系统消息标记未读状态 通知
	kNotiSendCommMsg					= 305, //发送公共消息 通知
	kNotiSendNoticeMsg					= 306, //发送通知消息 通知
											   
	//会话相关通知(350-399）					 
	kNotiSetSessionStatus 				= 350, //设置会话状态改变 通知
											   
	//消息提醒设置相关通知(400-449)			 
	kNotiSetMsgRemind 					= 400, //设置消息免打扰信息 通知
	kNotiSetMsgRemindTime 				= 401, //按时间段设置消息免打扰信息 通知
											   
	//小助手相关通知(450-499)				    
											   
	//用户信息相关通知(500-549)
	kNotiUpdateUserInfo					= 500, //更新用户信息 通知
											   
	//外部联系人相关通知(550-599)			  
	kNotiUserApplyFriend				= 550, //申请加好友 通知
	kNotiUserReplyFriend				= 551, //好友申请回复 通知
	kNotiUserRemoveFriend				= 552, //解除好友关系 通知
											   
	//机器人相关通知(600-619)
	kNotiAddRobot						= 600, //添加机器人 通知
	kNotiUpdateRobot					= 601, //更新机器人 通知
	kNotiRemoveRobot					= 602, //移除机器人 通知

	//个人协作相关通知(620-649)
	/*日程*/
	kNotiCreateSchedule					= 620, //创建日程 通知
	kNotiBatchCreateSchedule			= 621, //批量创建日程 通知
	kNotiUpdateSchedule					= 622, //修改日程 通知
	kNotiDelSchedule					= 623, //删除日程 通知
	/*备忘*/
	kNotiCreateNote						= 624, //创建备忘 通知
	kNotiBatchCreateNote				= 625, //批量创建备忘 通知
	kNotiUpdateNote						= 626, //修改备忘 通知
	kNotiDelNote						= 627, //删除备忘 通知
	kNotiCreateNoteGroup				= 628, //创建备忘分组 通知
	kNotiUpdateNoteGroup				= 629, //修改备忘分组 通知
	kNotiDeleteNoteGroup				= 630, //删除备忘分组 通知
											   
	//其他通知(650-699)						   
	kNotiConnectLoginStatusReport		= 650, //连接登陆状态上报 通知
	kNotiSetAppPush						= 651, //设置app push开关 通知
	/*话题*/									 
	kNotiMsgToTopic 					= 652, //MsgToTopic 回调(废弃,
	kNotiSendTopicMsg					= 653, //发送群消息通知
	kNotiReplyTopicMsg 					= 654, //参与讨论话题通知
	kNotiFocusTopic 					= 655, //关注话题通知
	kNotiDelTopic 						= 656, //删除话题通知
	kNotiSetTopicCount 					= 657, //标记某个话题会话计数通知
	kNotiMsgModify 						= 658, //消息修改 通知
	/*透传*/							         
	kNotiTransportTech 					= 658, //多人透传协议通知
	kNotiGroupTransportTech 			= 659, //多群透传协议通知
};

// 操作码
//enum class IMSdkOpcode : uint32_t
enum IMSdkOpcode
{
	//------------------ 登录相关 ------------------ 
	kOPLoginParams						= 1001,	//设置登录参数
	kOPLogin							= 1002,	//登录
	kOPLogout							= 1003,	//登出
	kOPGetUserOnlineStatus				= 1004, //获取人员在线状态
	kOPSetMobileInfo					= 1005, //设置app信息上传
	kOPSetStatusChange 					= 1006, //设置状态(在线、离线等)
	kOPSetOtherDevOffline 				= 1007, //设置自己的其他设备离线
	
	//------------------ 用户信息 ------------------ 
	kOPGetCidUserInfo 					= 1051, //按cid获取用户信息列表 -（不完善，用eteams通讯录代替）
	kOPGetUserInfo 						= 1052, //根据cid、uid获取用户信息
	kOPGetCustomInfo 					= 1053, //获取客户信息- (用于客户群，app未使用)
	kOPGetCorpInfo 						= 1054, //获取团队信息
	kOPGetAppKey						= 1055, //动态获取appkey
	kOPUpdateUserInfo					= 1056,	//更新用户信息 - 通知:kNotiUpdateUserInfo
	
	//------------------ 会话信息 ------------------ 
	kOPGetHomeSessionList 				= 1101, //获取首页会话列表
	kOPGetPageSessionList 				= 1102, //分页获取（非首页）会话列表
	kOPGetCustomerSessionList 			= 1103, //获取客户群会话列表
	kOPGetOtherSessionList 				= 1104, //获取我的其他团队会话列表
	kOPSetSessionStatus 				= 1105, //设置会话状态 - 通知
	kOPDeleteSession 					= 1106, //删除最近会话
	kOPSearchSession					= 1107, //会话搜索
	kOPSearchMsg 						= 1108, //消息搜索
	
	//------------------ 群组相关 ------------------ 
	kOPCreateGroup 						= 1201, //创建群
	kOPDestroyGroup 					= 1202, //解散群 - 通知
	kOPInviteToGroup 					= 1203, //邀请入群 - 通知
	kOPExitGroup 						= 1204, //退出群 - 通知
	kOPKickGroupMember 					= 1205, //踢群成员 - 通知
	kOPModifyGroupInfo 					= 1206, //修改群信息 - 通知
	kOPSetGroupAdmin 					= 1207, //设置/删除管理员 - 通知
	kOPModifyGroupAvatar 				= 1208, //修改群头像 - 通知
	kOPSetGroupOnOff 					= 1209, //设置群开关 - 通知
	kOPGetGroupInfo 					= 1210, //获取群信息
	kOPIsGroupMember 					= 1211, //判断当前用户是否为群成员
	kOPGetGroupOperNote 				= 1212, //获取群操作记录
	kOPGetGroupOperRel 					= 1213, //获取群操作记录关联
	kOPGetGroupList 					= 1214, //获取群列表
	kOPGetGroupSquareByPage 			= 1215, //分页获取群广场列表
	kOPGetGroupMemberList 				= 1216, //获取群成员列表
	kOPSearchGlobalGroup 				= 1217, //全局搜索群（用于搜索外部联系人群组）
	kOPJoinGroup 						= 1218, //申请入群
	kOPGroupApplyReply 					= 1219, //接受申请入群
	kOPSetGroupMsgPrivilege				= 1220, //设置群成员可拉取加入群之前的历史消息的权限(群主/管理员可设置) 
	kOPDelGroupMsgPrivilege				= 1221, //删除群成员可拉取加入群之前的历史消息的个人权限（群主/管理员可删除）- 通知
	kOPAddGroupLabel 					= 1222, //添加群标签
	kOPDelGroupLabel 					= 1223, //删除群标签
	kOPGetAllGroupLabel 				= 1224, //获取所有群标签
	kOPGetGroupLabel 					= 1225, //获取群标签
	
	//------------------ 聊天相关 ------------------ 
	kOPForwardMsg 						= 1301, //消息转发
	kOPGetCombineMsg 					= 1302, //拉取转发消息详情消息
	kOPWithdrawMsg 						= 1303, //撤回消息 - 通知
	kOPSyncWithdrawMsg 					= 1304, //同步撤回消息（消息撤回可编辑） - **时间内有效
	
	/*群聊相关-80*/
	kOPSendGroupMsg 					= 1341, //发送群消息 - 通知:250
	kOPGetGroupMsgByMsgid 				= 1342, //指定msgid获取群消息(仅sdk内部使用)
	kOPGetGroupMsgByKind 				= 1343, //指定kind获取群消息
	//kOPGetGroupMsgByPage 				= 1344, //分页获取群消息
	kOPGetGroupMsg 						= 1345, //获取群消息
	kOPSetGroupMsgReadStatus 			= 1346, //标记群消息已读 - 通知
	kOPGetGroupMsgReadStatus 			= 1347, //获取群消息已读状态
	kOPGetGroupMsgReadDetail 			= 1348, //获取群消息阅读详情
	kOPSaveGroupChatDraftMsg 			= 1349, //保存群聊草稿信息
	kOPGetGroupChatDraftMsg 			= 1350, //获取群聊草稿信息
	kOPDeleteGroupChatDraftMsg 			= 1351, //删除群聊草稿信息
	kOPGetLocalGroupMsg 				= 1352, //获取本地群聊消息
	kOPSaveFailedGroupMsg 				= 1353, //保存发送失败的群聊消息
	kOPDeleteFailedGroupMsg 			= 1354, //删除发送失败的群聊消息
	kOPInitLocalHistoryViewGroupMsg 	= 1355, //初始化本地历史查看群聊消息
	kOPGetLocalHistoryViewGroupMsg 		= 1356, //获取本地历史查看群聊消息
	kOPGetLocalHistoryViewGroupMsgPageIndex = 1357, //获取本地历史查看群聊消息的页号
	kOPSearchLocalHistoryViewGroupMsg 	= 1358, //从历史查看中搜索本地群聊消息
	kOPClearLocalHistoryGroupMsg 		= 1359, //清空本地历史群聊消息
	kOPGroupMsgScreen 					= 1360, //屏蔽群消息
	kOPGetAnonymous 					= 1361, //获取匿名信息
	
	/*单聊相关-80*/
	kOPSendSingleMsg 					= 1421, //发送单聊消息 - 通知:150
	kOPGetSingleMsgByMsgid 				= 1422, //指定msgid获取单聊消息(仅sdk内部使用) 
	kOPGetSingleMsgByKind 				= 1423, //指定kind获取单聊消息
	//kOPGetSingleMsgByPage 				= 1424, //分页获取单聊消息(废弃？)
	kOPGetSingleMsg 					= 1425, //获取单聊消息
	kOPSetSingleMsgReadStatus 			= 1426, //标记单聊消息已读 - 通知：151
	kOPGetSingleMsgReadStatus 			= 1427, //获取单聊消息已读状态
	kOPSaveSingleChatDraftMsg 			= 1428, //保存单聊草稿信息
	kOPGetSingleChatDraftMsg 			= 1429, //获取单聊草稿信息
	kOPDeleteSingleChatDraftMsg 		= 1430, //删除单聊草稿信息
	kOPGetLocalSingleMsg 				= 1431, //获取本地单聊消息
	kOPSaveFailedSingleMsg 				= 1432, //保存发送失败的单聊消息
	kOPDeleteSavedFailedSingleMsg 		= 1433, //删除发送失败的单聊消息
	kOPInitLocalHistoryViewSingleMsg 	= 1434, //初始化本地历史查看单聊消息
	kOPGetLocalHistoryViewSingleMsg 	= 1435, //获取本地历史查看单聊消息
	kOPGetLocalHistoryViewSingleMsgPageIndex = 1436, //获取本地历史查看单聊消息的页号
	kOPSearchLocalHistoryViewSingleMsg	= 1437, //从历史查看中搜索本地单聊消息
	kOPClearLocalHistorySingleMsg 		= 1438, //清空本地历史单聊消息
	
	//------------------ 系统消息 ------------------ 
	kOPGetSysMsg	    				= 1501, //常规获取系统消息
	kOPGetSysMsgByMsgid	    			= 1502, //指定msgid获取系统消息
	kOPGetLocalHistorySysMsg	    	= 1503, //获取本地系统消息
	kOPSetSysMsgReadStatus	    		= 1504, //标记系统消息已读 - 通知:303
	kOPSetSysMsgUnReadStatus	    	= 1505, //标记系统消息未读 - 通知:304
	kOPSendCommMsg	    				= 1506, //发送公共消息 - 通知:305
	kOPSendNoticeMsg	    			= 1507, //发送通知消息 - 通知:306
	kOPGetSysGroupInfo	    			= 1508, //获取系统分组信息
	
	//------------------ 外部联系人 ------------------ 
	kOPApplyFriend 					    = 1601, //申请加为好友 - 通知:550
	kOPReplyFriend 					    = 1602, //好友申请回复 - 通知:551
	kOPGetFriendList 				    = 1603, //获取好友列表
	kOPSearchUserRelationInfo 		    = 1604, //搜索外部联系人用户关系信息
	kOPRemoveFriend 				    = 1605, //解除好友关系 - 通知:552
	kOPGetFriendRelation 			    = 1606, //获取用户好友关系
	
	//------------------ 消息免打扰 ------------------ 
	kOPSetMsgRemind	    				= 1651, //设置消息免打扰信息 - 通知:400
	kOPSetTaskSysMsgRemind	    		= 1652, //设置任务系统消息免打扰信息
	kOPGetTaskSysMsgRemind	    		= 1653, //获取任务系统消息免打扰信息
	kOPSetMsgRemindTime     			= 1654, //设置时间段消息免打扰信息 - 通知:401
	kOPGetMsgRemind	    				= 1655, //获取消息免打扰信息
	
	//------------------ 话题相关 ------------------ 
	kOPCreateTopic		    			= 1701, //创建话题：发送话题消息（包括：普通消息转话题消息）
	kOPTopicToGroup		    			= 1702, //话题转普通群
	kOPSetTopic		    				= 1703, //设置话题状态
	kOPGetTopicInfoByMsgid				= 1704, //根据msgid获取话题信息
	kOPGetTopicInfoByTid	    		= 1705, //根据tid获取话题信息
	kOPGetRelateTopic	    			= 1706, //获取关联话题
	kOPSyncTopic	    				= 1707, //同步话题的消息

	//------------------ 机器人相关 ------------------ 
	kOPGetStoreRobotList				= 1721, //获取机器人商店列表
	kOPGetSysRssSourceList				= 1722, //获取系统rss订阅源列表
	kOPGetRobotInfo						= 1723, //获取机器人信息
	kOPGetRobotList						= 1724, //获取机器人列表
	kOPAddRobot							= 1725, //添加机器人 - 通知: kNotiAddRobot
	kOPUpdateRobot						= 1726, //更新机器人信息 - 通知: kNotiUpdateRobot
	kOPRemoveRobot						= 1727, //移除机器人 - 通知: kNotiRemoveRobot

	//------------------ 个人协作 ------------------ 
	/*日程*/
	kOPCreateSchedule					= 1751, //创建日程 - 通知:kNotiCreateSchedule
	kOPBatchCreateSchedule				= 1752, //批量创建日程 - 通知:kNotiBatchCreateSchedule
	kOPUpdateSchedule					= 1753, //修改日程 - 通知:kNotiUpdateSchedule
	kOPDelSchedule						= 1754, //删除日程 - 通知:kNotiDelSchedule
	kOPGetSchedule						= 1755, //获取指定日程
	kOPSyncSchedule						= 1756, //根据条件同步日程
	kOPSyncAllSchedule					= 1757, //同步全量日程
	/*备忘*/
	kOPCreateNote						= 1761, //创建备忘 - 通知:kNotiCreateNote
	kOPBatchCreateNote					= 1762, //批量创建备忘 - 通知:kNotiBatchCreateNote
	kOPUpdateNote						= 1763, //修改备忘 - 通知:kNotiUpdateNote
	kOPDelNote							= 1764, //删除备忘 - 通知:kNotiDelNote
	kOPGetNote							= 1765, //获取指定备忘
	kOPCreateNoteGroup					= 1766, //创建备忘分组 - 通知:kNotiCreateNoteGroup
	kOPUpdateNoteGroup					= 1767, //修改备忘分组 - 通知:kNotiUpdateNoteGroup
	kOPDeleteNoteGroup					= 1768, //删除备忘分组 - 通知:kNotiDeleteNoteGroup
	kOPGetNoteGroup						= 1769, //指定获取备忘分组
	kOPSyncNoteGroup					= 1770, //同步备忘分组
	kOPSyncNote							= 1771, //同步备忘
	kOPSyncAllNote						= 1772, //同步全量备忘

	//------------------ 智能服务 ------------------ 
	kOPCheckText						= 1801, //文本纠错
	kOPTranslateText					= 1802, //文本翻译
	
	//------------------ 其它 ------------------
	kOPGetSdkInfo 			    		= 1901, //获取sdk信息
	kOPClearCache 			    		= 1902, //清理缓存
	
	kOPUploadUserOper 			    	= 1921, //用户操作统计(埋点)
	kOPApplyRely 			    		= 1922, //统一申请回复
	
	/*app push开关*/
	kOPSetAppPush 			    		= 1951, //设置app push开关 - 通知:651
	kOPGetAppPush			    		= 1952, //拉取app push开关
	
	/*透传协议*/
	kOPTransportTech			    	= 1955, //多人透传协议 - 通知:658
	kOPGroupTransportTech			    = 1956, //多群透传协议 - 通知:659
	
	/*声音提醒*/
	kOPSyncSoundList 			    	= 1961, //同步声音列表
	kOPAddSoundUsers 			    	= 1962, //批量声音添加用户
	kOPDelSoundUsers 			    	= 1963, //批量删除声音用户
	kOPSyncSoundUsers 			    	= 1964, //同步声音用户
	kOPSetSound 			    		= 1965, //设置声音
};

#endif//_IMSDK_OPCODE_