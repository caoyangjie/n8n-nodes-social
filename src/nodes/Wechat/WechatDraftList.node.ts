import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatDraftList implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Draft List',
    name: 'wechatDraftList',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: 'Get wechat draft list',
    defaults: {
      name: 'WeChat Draft List',
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
        displayName: '偏移量',
        name: 'offset',
        type: 'number',
        default: 0,
        required: false,
        description: '从全部素材的该偏移位置开始返回，0表示从第一个素材返回',
      },
      {
        displayName: '数量',
        name: 'count',
        type: 'number',
        default: 20,
        required: false,
        description: '返回素材的数量，取值在1到20之间',
      },
      {
        displayName: '是否返回草稿详情',
        name: 'no_content',
        type: 'options',
        options: [
          {
            name: '返回详情',
            value: 0,
          },
          {
            name: '不返回详情',
            value: 1,
          },
        ],
        default: 0,
        required: false,
        description: '1表示不返回草稿详情，0表示返回草稿详情',
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
        const offset = this.getNodeParameter('offset', i, 0) as number;
        const count = this.getNodeParameter('count', i, 20) as number;
        const no_content = this.getNodeParameter('no_content', i, 0) as number;

        // 构建请求数据
        const requestData = {
          offset,
          count,
          no_content,
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/draft/batchget?access_token=${access_token}`,
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