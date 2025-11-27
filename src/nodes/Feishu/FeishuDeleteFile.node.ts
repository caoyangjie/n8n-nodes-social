import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuDeleteFile implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Delete File',
    name: 'feishuDeleteFile',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '删除飞书云文档中的文件或文件夹',
    subtitle: '删除飞书云文档中的文件或文件夹',
    defaults: {
      name: 'Feishu Delete File',
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
        description: '要删除的文件或文件夹的标识',
      },
      {
        displayName: '类型',
        name: 'type',
        type: 'options',
        options: [
          {
            name: '移到回收站',
            value: 'trash',
            description: '将文件移动到回收站',
          },
          {
            name: '永久删除',
            value: 'delete',
            description: '永久删除文件（不可恢复）',
          },
        ],
        default: 'trash',
        required: true,
        description: '删除类型',
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
        const type = this.getNodeParameter('type', i) as string;

        // 构建请求数据
        const requestData = {
          file_token: fileToken,
          type,
        };

        // 发送请求到飞书API
        const response = await axios.post(
          'https://open.feishu.cn/open-apis/drive/v1/files/file_token/delete',
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