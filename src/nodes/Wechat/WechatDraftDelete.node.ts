import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatDraftDelete implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Draft Delete',
    name: 'wechatDraftDelete',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '删除微信公众号草稿',
    defaults: {
      name: 'WeChat Draft Delete',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [],
    properties: [
      {
        displayName: '草稿ID',
        name: 'media_id',
        type: 'string',
        default: '',
        required: true,
        description: '要删除的草稿的media_id',
      },
      {
        displayName: 'Access Token',
        name: 'access_token',
        type: 'string',
        default: '',
        required: true,
        description: '微信接口调用凭证',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取所有参数
        const media_id = this.getNodeParameter('media_id', i) as string;
        const access_token = this.getNodeParameter('access_token', i) as string;

        // 构建请求数据
        const requestData = {
          media_id,
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=${access_token}`,
          requestData
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