import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuBitableGet implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Bitable Get',
    name: 'feishuBitableGet',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '获取飞书多维表格元信息',
    subtitle: '获取飞书多维表格元信息',
    defaults: {
      name: 'Feishu Bitable Get',
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

        const response = await axios.get(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}`,
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