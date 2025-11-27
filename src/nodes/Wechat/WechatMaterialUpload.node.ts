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

export class WechatMaterialUpload implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Material Upload',
    name: 'wechatMaterialUpload',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: '上传永久素材到微信公众号',
    defaults: {
      name: 'WeChat Material Upload',
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
        description: '永久素材类型',
      },
      {
        displayName: '文件路径',
        name: 'filePath',
        type: 'string',
        default: '',
        required: true,
        description: '要上传的媒体文件的本地路径',
      },
      {
        displayName: '视频标题',
        name: 'title',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            type: ['video'],
          },
        },
        required: true,
        description: '视频素材的标题',
      },
      {
        displayName: '视频简介',
        name: 'introduction',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            type: ['video'],
          },
        },
        required: true,
        description: '视频素材的简介',
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

      // 如果是视频素材，需要额外的描述信息
      if (type === 'video') {
        const title = this.getNodeParameter('title', 0);
        const introduction = this.getNodeParameter('introduction', 0);
        form.append('description', JSON.stringify({
          title,
          introduction,
        }));
      }

      // 根据不同类型选择不同的上传接口
      let url = '';
      if (type === 'thumb') {
        url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${access_token}&type=thumb`;
      } else {
        url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${access_token}&type=${type}`;
      }

      // 发送请求到微信API
      const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      return [[{ json: response.data }]];
    } catch (error) {
      if (this.continueOnFail()) {
        return [[{ json: { error: error.message } }]];
      }
      throw error;
    }
  }
} 