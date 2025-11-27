import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatDraftGet implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Draft Get',
    name: 'wechatDraftGet',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '获取微信公众号草稿箱中的草稿',
    defaults: {
      name: 'WeChat Draft Get',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [],
    properties: [
      {
        displayName: 'Access Token',
        name: 'access_token',
        type: 'string',
        default: '',
        required: true,
        description: '微信接口调用凭证',
      },
      {
        displayName: '草稿ID',
        name: 'media_id',
        type: 'string',
        default: '',
        required: true,
        description: '要获取的草稿的media_id',
      },
      {
        displayName: '文章索引',
        name: 'article_idx',
        type: 'number',
        default: 0,
        required: false,
        description: '要获取的图文消息的文章在原图文消息中的位置（从0开始）',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取所有参数
        const access_token = this.getNodeParameter('access_token', i) as string;
        const media_id = this.getNodeParameter('media_id', i) as string;
        const article_idx = this.getNodeParameter('article_idx', i, 0) as number;

        // 构建请求数据
        const requestData = {
          media_id,
          article_idx,
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/draft/get?access_token=${access_token}`,
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