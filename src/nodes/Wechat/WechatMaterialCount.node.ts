import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import axios from 'axios';

export class WechatMaterialCount implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Wechat Material Count',
    name: 'wechatMaterialCount',
    icon: 'file:../../icon/wechat.svg',
    group: ['transform'],
    version: 1,
    description: 'Get total count of wechat materials',
    defaults: {
      name: 'WeChat Material Count',
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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // 获取access_token参数
        const access_token = this.getNodeParameter('access_token', i) as string;

        // 发送请求到微信API获取素材总数
        const response = await axios.get(
          `https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=${access_token}`
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