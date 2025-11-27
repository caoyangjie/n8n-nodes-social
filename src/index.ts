import { INodeType, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ICredentialType } from 'n8n-workflow';

// Import WeChat nodes
import { WechatToken } from './nodes/Wechat/WechatToken.node';
import { WechatDraft } from './nodes/Wechat/WechatDraft.node';
import { WechatDraftGet } from './nodes/Wechat/WechatDraftGet.node';
import { WechatDraftDelete } from './nodes/Wechat/WechatDraftDelete.node';
import { WechatDraftUpdate } from './nodes/Wechat/WechatDraftUpdate.node';
import { WechatDraftList } from './nodes/Wechat/WechatDraftList.node';
import { WechatDraftPublish } from './nodes/Wechat/WechatDraftPublish.node';
import { WechatMedia } from './nodes/Wechat/WechatMedia.node';
import { WechatMaterial } from './nodes/Wechat/WechatMaterial.node';
import { WechatMaterialUpload } from './nodes/Wechat/WechatMaterialUpload.node';
import { WechatMaterialGet } from './nodes/Wechat/WechatMaterialGet.node';
import { WechatMaterialDelete } from './nodes/Wechat/WechatMaterialDelete.node';
import { WechatMaterialCount } from './nodes/Wechat/WechatMaterialCount.node';
import { WechatMaterialList } from './nodes/Wechat/WechatMaterialList.node';
import { WechatArticleGet } from './nodes/Wechat/WechatArticleGet.node';
import { WechatPublishedArticles } from './nodes/Wechat/WechatPublishedArticles.node';

// Import Feishu nodes
import { FeishuToken } from './nodes/Feishu/FeishuToken.node';
import { FeishuBitable } from './nodes/Feishu/FeishuBitable.node';
import { FeishuBitableCopy } from './nodes/Feishu/FeishuBitableCopy.node';
import { FeishuBitableGet } from './nodes/Feishu/FeishuBitableGet.node';
import { FeishuBitableUpdate } from './nodes/Feishu/FeishuBitableUpdate.node';
import { FeishuRootFolder } from './nodes/Feishu/FeishuRootFolder.node';
import { FeishuFileList } from './nodes/Feishu/FeishuFileList.node';
import { FeishuFolderMeta } from './nodes/Feishu/FeishuFolderMeta.node';
import { FeishuCreateFolder } from './nodes/Feishu/FeishuCreateFolder.node';
import { FeishuMoveFile } from './nodes/Feishu/FeishuMoveFile.node';
import { FeishuDeleteFile } from './nodes/Feishu/FeishuDeleteFile.node';
import { FeishuTaskCheck } from './nodes/Feishu/FeishuTaskCheck.node';

// Import credentials
import { WechatApi } from './credentials/WechatApi.credentials';
import { FeishuApi } from './credentials/FeishuApi.credentials';

// 导出所有节点类 
export {
	WechatToken,
	WechatDraft,
	WechatDraftGet,
	WechatDraftDelete,
	WechatDraftUpdate,
	WechatDraftList,
	WechatDraftPublish,
	WechatMedia,
	WechatMaterial,
	WechatMaterialUpload,
	WechatMaterialGet,
	WechatMaterialDelete,
	WechatMaterialCount,
	WechatMaterialList,
	WechatArticleGet,
	WechatPublishedArticles,
	FeishuToken,
	FeishuBitable,
	FeishuBitableCopy,
	FeishuBitableGet,
	FeishuBitableUpdate,
	WechatApi,
	FeishuApi,
};

// 导出所有节点实例
export const nodes: INodeType[] = [
	new WechatToken(),
	new WechatDraft(),
	new WechatDraftGet(),
	new WechatDraftDelete(),
	new WechatDraftUpdate(),
	new WechatDraftList(),
	new WechatDraftPublish(),
	new WechatMedia(),
	new WechatMaterial(),
	new WechatMaterialUpload(),
	new WechatMaterialGet(),
	new WechatMaterialDelete(),
	new WechatMaterialCount(),
	new WechatMaterialList(),
	new WechatArticleGet(),
	new WechatPublishedArticles(),
	new FeishuToken(),
	new FeishuBitable(),
	new FeishuRootFolder(),
	new FeishuFileList(),
	new FeishuFolderMeta(),
	new FeishuCreateFolder(),
	new FeishuMoveFile(),
	new FeishuDeleteFile(),
	new FeishuTaskCheck(),
];

// 导出凭证
export const credentials: ICredentialType[] = [
	new WechatApi(),
	new FeishuApi(),
]; 