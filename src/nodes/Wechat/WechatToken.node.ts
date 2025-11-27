import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class WechatToken implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WeChat Token',
		name: 'wechatToken',
		icon: 'file:../../icon/wechat.svg',
		group: ['transform'],
		version: 1,
		description: 'Get WeChat Official Account Access Token',
		defaults: {
			name: 'WeChat Token',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'wechatApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Get Access Token',
						value: 'getAccessToken',
					},
				],
				default: 'getAccessToken',
				description: 'The resource to operate on.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		try {
			// 获取凭证
			const credentials = await this.getCredentials('wechatApi');
			const appId = credentials.appId as string;
			const appSecret = credentials.appSecret as string;

			// 配置请求选项
			const options: IHttpRequestOptions = {
				method: 'GET',
				url: 'https://api.weixin.qq.com/cgi-bin/token',
				qs: {
					grant_type: 'client_credential',
					appid: appId,
					secret: appSecret,
				},
				headers: {
					'Accept': 'application/json',
				},
			};

			// 发送请求获取token
			const responseString = await this.helpers.requestWithAuthentication.call(
				this,
				'wechatApi',
				options,
			);				
			const responseData = JSON.parse(responseString);
			// 检查错误
			if (responseData.errcode) {
				throw new Error(`WeChat API Error: ${responseData.errmsg} (Error Code: ${responseData.errcode})`);
			}

			console.log('Response Data:', JSON.stringify(responseData, null, 2));
			const executionData: INodeExecutionData = {
				json: {
					access_token: responseData.access_token,
					expires_in: responseData.expires_in,
					obtained_at: new Date().toISOString(), // 添加获取时间
				},
			};

			return [[executionData]];
		} catch (error) {
			if (this.continueOnFail()) {
				const errorData: INodeExecutionData = {
					json: {
						error: (error as Error).message,
						details: error.response?.body || error.response || error,
						timestamp: new Date().toISOString(),
					},
				};
				return [[errorData]];
			}
			throw error;
		}
	}
} 