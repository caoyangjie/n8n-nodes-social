import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WechatApi implements ICredentialType {
	name = 'wechatApi';
	displayName = 'WeChat API Credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'App ID',
			name: 'appId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'App Secret',
			name: 'appSecret',
			type: 'string',
			default: '',
			required: true,
		},
	];
} 