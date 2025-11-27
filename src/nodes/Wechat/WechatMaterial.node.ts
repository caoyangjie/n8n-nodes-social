import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatMaterial implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Media Download',
    name: 'wechatMediaDownload',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '获取微信公众号素材',
    defaults: {
      name: 'WeChat Material',
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
        description: '素材的类型',
      },
      {
        displayName: '素材ID',
        name: 'media_id',
        type: 'string',
        default: '',
        required: true,
        description: '要获取的素材的media_id',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
      // 获取参数
      const access_token = this.getNodeParameter('access_token', 0) as string;
      const type = this.getNodeParameter('type', 0) as string;
      const media_id = this.getNodeParameter('media_id', 0) as string;

      // 构建请求URL
      const url = `https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=${access_token}`;

      // 发送请求到微信API
      const response = await axios.post(
        url,
        { media_id },
        {
          responseType: type === 'news' ? 'json' : 'arraybuffer',
        }
      );

      if (type === 'news') {
        // 图文消息直接返回JSON数据
        return [[{ json: response.data }]];
      } else {
        // 其他类型返回二进制数据的Base64编码
        return [[{
          json: {
            type,
            media_id,
            content: Buffer.from(response.data).toString('base64'),
          },
        }]];
      }
    } catch (error) {
      if (this.continueOnFail()) {
        return [[{ json: { error: error.message } }]];
      }
      throw error;
    }
  }
} 