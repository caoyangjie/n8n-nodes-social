import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FeishuApi implements ICredentialType {
	name = 'feishuApi';
	displayName = 'Feishu API Credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'App ID',
			name: 'appId',
			type: 'string',
			default: '',
			required: true,
			description: '飞书开放平台的应用 App ID',
		},
		{
			displayName: 'App Secret',
			name: 'appSecret',
			type: 'string',
			default: '',
			required: true,
			description: '飞书开放平台的应用 App Secret',
		},
		{
			displayName: 'Token 类型',
			name: 'tokenType',
			type: 'options',
			options: [
				{
					name: '租户访问凭证 (tenant_access_token)',
					value: 'tenant_access_token',
					description: '获取应用的tenant_access_token，用于以应用身份访问API',
				},
				{
					name: '用户访问凭证 (user_access_token)',
					value: 'user_access_token',
					description: '获取用户的user_access_token，用于以用户身份访问API',
				},
				{
					name: '应用访问凭证 (app_access_token)',
					value: 'app_access_token',
					description: '获取应用的app_access_token，用于自建应用访问API',
				},
			],
			default: 'tenant_access_token',
			required: true,
		},
		{
			displayName: '用户授权码',
			name: 'code',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					tokenType: [
						'user_access_token',
					],
				},
			},
			description: '用于获取user_access_token的授权码',
		},
		{
			displayName: '重定向URI',
			name: 'redirectUri',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					tokenType: [
						'user_access_token',
					],
				},
			},
			description: '授权完成后的回调地址，需要与飞书开放平台配置的重定向地址一致',
		},
		{
			displayName: 'Code Verifier',
			name: 'codeVerifier',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					tokenType: [
						'user_access_token',
					],
				},
			},
			description: 'PKCE验证码，用于防止CSRF攻击',
		},
	];
} 