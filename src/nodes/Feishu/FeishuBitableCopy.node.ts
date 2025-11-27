import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuBitableCopy implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Bitable Copy',
    name: 'feishuBitableCopy',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '拷贝飞书多维表格',
    subtitle: '拷贝飞书多维表格',
    defaults: {
      name: 'Feishu Bitable Copy',
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
        displayName: '目标文件夹Token',
        name: 'folder_token',
        type: 'string',
        default: '',
        required: false,
        description: '目标文件夹的token，不填则默认复制到根目录',
      },
      {
        displayName: '新多维表格名称',
        name: 'name',
        type: 'string',
        default: '',
        required: false,
        description: '新多维表格的名称，不填则默认为"副本-原名称"',
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
        const folder_token = this.getNodeParameter('folder_token', i, '') as string;
        const name = this.getNodeParameter('name', i, '') as string;

        const requestData: any = {};
        if (folder_token) {
          requestData.folder_token = folder_token;
        }
        if (name) {
          requestData.name = name;
        }

        const response = await axios.post(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/copy`,
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