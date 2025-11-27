import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuMoveFile implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Move File',
    name: 'feishuMoveFile',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '移动飞书云文档中的文件或文件夹',
    subtitle: '移动飞书云文档中的文件或文件夹',
    defaults: {
      name: 'Feishu Move File',
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
        displayName: '文件标识',
        name: 'file_token',
        type: 'string',
        default: '',
        required: true,
        description: '要移动的文件或文件夹的标识',
      },
      {
        displayName: '目标文件夹标识',
        name: 'target_folder_token',
        type: 'string',
        default: '',
        required: true,
        description: '目标文件夹的标识',
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
        const fileToken = this.getNodeParameter('file_token', i) as string;
        const targetFolderToken = this.getNodeParameter('target_folder_token', i) as string;

        // 构建请求数据
        const requestData = {
          file_token: fileToken,
          target_folder_token: targetFolderToken,
        };

        // 发送请求到飞书API
        const response = await axios.post(
          'https://open.feishu.cn/open-apis/drive/v1/files/file_token/move',
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