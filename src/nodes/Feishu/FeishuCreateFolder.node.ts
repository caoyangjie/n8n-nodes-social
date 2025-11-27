import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuCreateFolder implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Create Folder',
    name: 'feishuCreateFolder',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '在飞书云文档中创建新文件夹',
		subtitle: '在飞书云文档中创建新文件夹',
    defaults: {
      name: 'Feishu Create Folder',
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
        displayName: '文件夹名称',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        description: '要创建的文件夹名称',
      },
      {
        displayName: '父文件夹标识',
        name: 'folder_token',
        type: 'string',
        default: '',
        required: false,
        description: '父文件夹标识，不传则默认在根目录下创建',
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
        const name = this.getNodeParameter('name', i) as string;
        const folderToken = this.getNodeParameter('folder_token', i, '') as string;

        // 构建请求数据
        const requestData: {
          name: string;
          folder_token?: string;
        } = {
          name,
        };

        if (folderToken) {
          requestData.folder_token = folderToken;
        }

        // 发送请求到飞书API
        const response = await axios.post(
          'https://open.feishu.cn/open-apis/drive/v1/files/create_folder',
          requestData,
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