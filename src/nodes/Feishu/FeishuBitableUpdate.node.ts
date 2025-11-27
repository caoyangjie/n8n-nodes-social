import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuBitableUpdate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Bitable Update',
    name: 'feishuBitableUpdate',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '更新飞书多维表格信息',
    subtitle: '更新飞书多维表格信息',
    defaults: {
      name: 'Feishu Bitable Update',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [],
    properties: [
      {
        displayName: 'App Token',
        name: 'app_token',
        type: 'string',
        default: '',
        required: true,
        description: '多维表格的唯一标识符',
      },
      {
        displayName: 'User Access Token',
        name: 'user_access_token',
        type: 'string',
        default: '',
        required: true,
        description: '用户访问凭证',
      },
      {
        displayName: '新名称',
        name: 'name',
        type: 'string',
        default: '',
        required: false,
        description: '多维表格的新名称',
      },
      {
        displayName: '新图标',
        name: 'icon',
        type: 'string',
        default: '',
        required: false,
        description: '多维表格的新图标',
      },
      {
        displayName: '新描述',
        name: 'description',
        type: 'string',
        default: '',
        required: false,
        description: '多维表格的新描述',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const app_token = this.getNodeParameter('app_token', i) as string;
        const user_access_token = this.getNodeParameter('user_access_token', i) as string;
        const name = this.getNodeParameter('name', i, '') as string;
        const icon = this.getNodeParameter('icon', i, '') as string;
        const description = this.getNodeParameter('description', i, '') as string;

        const requestData: any = {};
        if (name) {
          requestData.name = name;
        }
        if (icon) {
          requestData.icon = icon;
        }
        if (description) {
          requestData.description = description;
        }

        const response = await axios.put(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}`,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${user_access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        returnData.push({
          json: response.data,
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
} 