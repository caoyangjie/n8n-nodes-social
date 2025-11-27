import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatDraft implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Draft',
    name: 'wechatDraft',
		icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: 'push article to wechat draft!',
    defaults: {
      name: 'WeChat Draft',
    },
	inputs: ['main'] as NodeConnectionType[],
	outputs: ['main'] as NodeConnectionType[],
    credentials: [],
    properties: [
      {
        displayName: '标题',
        name: 'title',
        type: 'string',
        default: '',
        required: true,
        description: '文章标题',
      },
      {
        displayName: '作者',
        name: 'author',
        type: 'string',
        default: '',
        required: true,
        description: '文章作者',
      },
      {
        displayName: '摘要',
        name: 'digest',
        type: 'string',
        default: '',
        required: true,
        description: '文章摘要',
      },
      {
        displayName: '内容',
        name: 'content',
        type: 'string',
        typeOptions: {
          rows: 10,
        },
        default: '',
        required: true,
        description: '文章内容，支持HTML标签',
      },
      {
        displayName: 'Access Token',
        name: 'access_token',
        type: 'string',
        default: '',
        required: true,
        description: '微信接口调用凭证',
      },
      {
        displayName: '封面图片素材ID',
        name: 'thumb_media_id',
        type: 'string',
        default: '',
        required: true,
        description: '封面图片素材id',
      },
      {
        displayName: '是否开启评论',
        name: 'need_open_comment',
        type: 'options',
        options: [
          {
            name: '不开启',
            value: 0,
          },
          {
            name: '开启',
            value: 1,
          },
        ],
        default: 0,
        required: false,
        description: '是否打开评论，0不打开，1打开',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取所有参数
        const title = this.getNodeParameter('title', i) as string;
        const author = this.getNodeParameter('author', i) as string;
        const digest = this.getNodeParameter('digest', i) as string;
        const content = this.getNodeParameter('content', i) as string;
        const access_token = this.getNodeParameter('access_token', i) as string;
        const thumb_media_id = this.getNodeParameter('thumb_media_id', i) as string;
        const need_open_comment = this.getNodeParameter('need_open_comment', i, 0) as number;

        // 构建请求数据
        const requestData = {
          articles: [
            {
              title,
              author,
              digest,
              content,
              thumb_media_id,
              need_open_comment,
              only_fans_can_comment: 0,
            },
          ],
        };

        // 发送请求到微信API
        const response = await axios.post(
          `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${access_token}`,
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