import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

export class WechatMedia implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Media',
    name: 'wechatMedia',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '上传临时素材到微信公众号',
    defaults: {
      name: 'WeChat Media',
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
        displayName: '媒体类型',
        name: 'type',
        type: 'options',
        options: [
          {
            name: '图片',
            value: 'image',
            description: '图片(image): 10M,支持PNG/JPEG/JPG/GIF格式',
          },
          {
            name: '语音',
            value: 'voice',
            description: '语音(voice): 2M,播放长度不超过60s,支持AMR/MP3格式',
          },
          {
            name: '视频',
            value: 'video',
            description: '视频(video): 10MB,支持MP4格式',
          },
          {
            name: '缩略图',
            value: 'thumb',
            description: '缩略图(thumb): 64KB,支持JPG格式',
          },
        ],
        default: 'image',
        required: true,
        description: '媒体文件类型',
      },
      {
        displayName: '文件路径',
        name: 'filePath',
        type: 'string',
        default: '',
        required: true,
        description: '要上传的媒体文件的本地路径',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
      // 获取参数
      const access_token = this.getNodeParameter('access_token', 0);
      const type = this.getNodeParameter('type', 0);
      const filePath = this.getNodeParameter('filePath', 0);

      // 构建multipart form-data
      const form = new FormData();
      form.append('media', createReadStream(filePath));

      // 发送请求到微信API
      const response = await axios.post(
        `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=${type}`,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );

      return [[{ json: response.data }]];
    } catch (error) {
      if (this.continueOnFail()) {
        return [[{ json: { error: error.message } }]];
      }
      throw error;
    }
  }
} 