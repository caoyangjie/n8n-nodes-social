import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

export class FeishuToken implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Feishu Token',
		name: 'feishuToken',
		icon: 'file:../../icon/feishu.svg',
		group: ['transform'],
		version: 1,
		subtitle: '获取访问Token',
		description: '获取飞书开放平台的访问Token',
		defaults: {
			name: 'Feishu Token',
		},
		inputs: [{
			type: 'main',
		}],
		outputs: [{
			type: 'main',
		}],
		credentials: [
			{
				name: 'feishuApi',
				required: true,
			},
		],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('feishuApi');

		if (!credentials) {
			throw new Error('请先配置飞书API凭证！');
		}

		const { appId, appSecret, tokenType, redirectUri, codeVerifier, code } = credentials;

		let endpoint = '';
		let body: IDataObject = {
			app_id: appId,
			app_secret: appSecret,
		};

		switch (tokenType) {
			case 'tenant_access_token':
				endpoint = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
				break;
			case 'app_access_token':
				endpoint = 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal';
				break;
			case 'user_access_token':
				endpoint = 'https://open.feishu.cn/open-apis/authen/v2/oauth/token';
				if (!code) {
					throw new Error('获取user_access_token需要提供用户授权码！');
				}
				body = {
					grant_type: 'authorization_code',
					code,
					redirect_uri: redirectUri,
					code_verifier: codeVerifier,
				};
				break;
			default:
				throw new Error(`不支持的Token类型: ${tokenType}`);
		}

		// 发送请求获取访问token
		const response = await this.helpers.request({
			method: 'POST',
			uri: endpoint,
			body,
			json: true,
		});

		if (response.code !== 0) {
			throw new Error(`获取访问Token失败: ${response.msg}`);
		}

		const returnData: IDataObject = {};

		// 根据不同的token类型返回不同的字段
		switch (tokenType) {
			case 'tenant_access_token':
				returnData.tenant_access_token = response.tenant_access_token;
				returnData.expire = response.expire;
				break;
			case 'app_access_token':
				returnData.app_access_token = response.app_access_token;
				returnData.expire = response.expire;
				break;
			case 'user_access_token':
				returnData.access_token = response.data.access_token;
				returnData.refresh_token = response.data.refresh_token;
				returnData.token_type = response.data.token_type;
				returnData.expire_in = response.data.expires_in;
				break;
		}

		const executionData = this.helpers.returnJsonArray(returnData);
		return [executionData];
	}
} 