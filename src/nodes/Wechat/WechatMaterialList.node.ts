import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatMaterialList implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Material List',
    name: 'wechatMaterialList',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '获取微信公众号素材列表',
    defaults: {
      name: 'WeChat Material List',
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
        displayName: '素材类型',
        name: 'type',
        type: 'options',
        options: [
          {
            name: '图片',
            value: 'image',
          },
          {
            name: '视频',
            value: 'video',
          },
          {
            name: '语音',
            value: 'voice',
          },
          {
            name: '图文',
            value: 'news',
          },
        ],
        default: 'image',
        required: true,
        description: '素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）',
      },
      {
        displayName: '偏移量',
        name: 'offset',
        type: 'number',
        default: 0,
        required: true,
        description: '从全部素材的该偏移位置开始返回，0表示从第一个素材返回',
      },
      {
        displayName: '返回数量',
        name: 'count',
        type: 'number',
        default: 20,
        required: true,
        description: '返回素材的数量，取值在1到20之间',
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
        const type = this.getNodeParameter('type', i) as string;
        const offset = this.getNodeParameter('offset', i) as number;
        const count = this.getNodeParameter('count', i) as number;

        // 构建请求数据
        const requestData = {
          type,
          offset,
          count,
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${access_token}`,
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