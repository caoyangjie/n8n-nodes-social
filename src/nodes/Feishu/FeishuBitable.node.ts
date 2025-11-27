import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuBitable implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Bitable Create',
    name: 'feishuBitable',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '创建飞书多维表格',
		subtitle: '创建飞书多维表格',
    defaults: {
      name: 'Feishu Bitable Create',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    properties: [
      {
        displayName: 'Access Token',
        name: 'access_token',
        type: 'string',
        default: '',
        required: true,
        description: '飞书接口调用凭证',
      },
      {
        displayName: '多维表格名称',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        description: '要创建的多维表格名称',
      },
      {
        displayName: '文件夹令牌',
        name: 'folder_token',
        type: 'string',
        default: '',
        required: false,
        description: '文件夹令牌，用于指定多维表格创建的位置',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取所有参数
        const access_token = this.getNodeParameter('access_token', i) as string;
        const name = this.getNodeParameter('name', i) as string;
        const folder_token = this.getNodeParameter('folder_token', i, '') as string;

        // 构建请求数据
        const requestData: any = {
          name
        };

        if (folder_token) {
          requestData.folder_token = folder_token;
        }

        // 发送请求到飞书API
        const response = await axios.post(
          'https://open.feishu.cn/open-apis/bitable/v1/apps',
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json; charset=utf-8'
            }
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