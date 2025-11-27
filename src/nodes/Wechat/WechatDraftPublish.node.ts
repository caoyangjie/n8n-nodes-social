import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatDraftPublish implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Draft Publish',
    name: 'wechatDraftPublish',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: 'Publish wechat draft article',
    defaults: {
      name: 'WeChat Draft Publish',
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
        description: '要发布的草稿的media_id',
      },
      {
        displayName: '发布时间',
        name: 'publish_time',
        type: 'number',
        default: 0,
        required: false,
        description: '发布时间（Unix时间戳），不填则表示立即发布',
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
        const media_id = this.getNodeParameter('media_id', i) as string;
        const publish_time = this.getNodeParameter('publish_time', i, 0) as number;

        // 构建请求数据
        const requestData = {
          media_id,
          publish_time,
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${access_token}`,
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