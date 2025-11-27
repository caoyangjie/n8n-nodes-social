import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuFolderMeta implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Folder Meta',
    name: 'feishuFolderMeta',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '获取飞书文件夹的元数据信息',
    subtitle: '获取飞书文件夹的元数据信息',
    defaults: {
      name: 'Feishu Folder Meta',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    properties: [
      {
        displayName: '用户访问令牌',
        name: 'user_access_token',
        type: 'string',
        default: '',
        required: true,
        description: '用户访问令牌',
      },
      {
        displayName: '文件夹标识',
        name: 'folder_token',
        type: 'string',
        default: '',
        required: true,
        description: '文件夹标识',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取所有参数
        const userAccessToken = this.getNodeParameter('user_access_token', i) as string;
        const folderToken = this.getNodeParameter('folder_token', i) as string;

        // 发送请求到飞书API
        const response = await axios.get(
          `https://open.feishu.cn/open-apis/drive/explorer/v2/folder/${folderToken}/meta`,
          {
            headers: {
              'Authorization': `Bearer ${userAccessToken}`,
              'Content-Type': 'application/json; charset=utf-8',
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