module.exports = {
    // WeChat Nodes
    WechatToken: require('./nodes/Wechat/WechatToken.node').WechatToken,
    WechatDraft: require('./nodes/Wechat/WechatDraft/WechatDraft.node').WechatDraft,
    WechatDraftGet: require('./nodes/Wechat/WechatDraftGet/WechatDraftGet.node').WechatDraftGet,
    WechatDraftDelete: require('./nodes/Wechat/WechatDraftDelete/WechatDraftDelete.node').WechatDraftDelete,
    WechatDraftUpdate: require('./nodes/Wechat/WechatDraftUpdate/WechatDraftUpdate.node').WechatDraftUpdate,
    WechatDraftList: require('./nodes/Wechat/WechatDraftList/WechatDraftList.node').WechatDraftList,
    WechatDraftPublish: require('./nodes/Wechat/WechatDraftPublish/WechatDraftPublish.node').WechatDraftPublish,
    WechatMedia: require('./nodes/Wechat/WechatMedia/WechatMedia.node').WechatMedia,
    WechatMaterial: require('./nodes/Wechat/WechatMaterial/WechatMaterial.node').WechatMaterial,
    WechatMaterialUpload: require('./nodes/Wechat/WechatMaterialUpload/WechatMaterialUpload.node').WechatMaterialUpload,
    WechatMaterialGet: require('./nodes/Wechat/WechatMaterialGet/WechatMaterialGet.node').WechatMaterialGet,
    WechatMaterialDelete: require('./nodes/Wechat/WechatMaterialDelete/WechatMaterialDelete.node').WechatMaterialDelete,
    WechatMaterialCount: require('./nodes/Wechat/WechatMaterialCount/WechatMaterialCount.node').WechatMaterialCount,
    WechatMaterialList: require('./nodes/Wechat/WechatMaterialList/WechatMaterialList.node').WechatMaterialList,
    WechatArticleGet: require('./nodes/Wechat/WechatArticleGet/WechatArticleGet.node').WechatArticleGet,
    WechatPublishedArticles: require('./nodes/Wechat/WechatPublishedArticles/WechatPublishedArticles.node').WechatPublishedArticles,
    
    // Feishu Nodes
    FeishuToken: require('./nodes/Feishu/FeishuToken.node').FeishuToken,
};
