import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class FeishuTaskCheck implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Feishu Task Check',
    name: 'feishuTaskCheck',
    icon: 'file:../../icon/feishu.svg',
    group: ['transform'],
    version: 1,
    description: '查询飞书云文档异步任务的执行状态',
    subtitle: '查询飞书云文档异步任务的执行状态',
    defaults: {
      name: 'Feishu Task Check',
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
        displayName: '任务标识',
        name: 'task_id',
        type: 'string',
        default: '',
        required: true,
        description: '要查询的异步任务标识',
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
        const taskId = this.getNodeParameter('task_id', i) as string;

        // 发送请求到飞书API
        const response = await axios.get(
          'https://open.feishu.cn/open-apis/drive/v1/files/task_check',
          {
            params: {
              task_id: taskId,
            },
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