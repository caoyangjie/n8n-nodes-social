import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuFileList implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu File List',
    name: 'feishuFileList',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '获取飞书文件夹下的文件清单',
    subtitle: '获取飞书文件夹下的文件清单',
    defaults: {
      name: 'Feishu File List',
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
        required: false,
        description: '文件夹标识，不传默认获取根目录下的文件',
      },
      {
        displayName: '页大小',
        name: 'page_size',
        type: 'number',
        default: 20,
        required: false,
        description: '分页大小，默认20，最大100',
      },
      {
        displayName: '页码',
        name: 'page',
        type: 'number',
        default: 1,
        required: false,
        description: '页码，默认1',
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
        const folderToken = this.getNodeParameter('folder_token', i, '') as string;
        const pageSize = this.getNodeParameter('page_size', i, 20) as number;
        const page = this.getNodeParameter('page', i, 1) as number;

        // 构建请求参数
        const params: {
          page_size: number;
          page: number;
          folder_token?: string;
        } = {
          page_size: pageSize,
          page,
        };

        if (folderToken) {
          params.folder_token = folderToken;
        }

        // 发送请求到飞书API
        const response = await axios.get(
          'https://open.feishu.cn/open-apis/drive/v1/files',
          {
            params,
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