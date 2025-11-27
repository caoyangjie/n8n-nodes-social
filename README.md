# Social Node 插件使用指南

## 1. 安装依赖
首先，确保你已经安装了 `n8n-workflow` 模块。运行以下命令：

```bash
npm install n8n-workflow
```

## 2. 编译插件
将 TypeScript 代码编译为 JavaScript。运行以下命令：

```bash
npm run build
```

## 3. 将插件链接到 n8n
将插件链接到 n8n 的插件目录中。运行以下命令：

```bash
npm link
```

然后，进入你的 n8n 项目目录，并运行：

```bash
npm link <你的插件名称>
```

## 4. 启动 n8n
确保你已经安装了 n8n，然后启动 n8n：

```bash
n8n
```

## 5. 在 n8n 中使用插件
1. 打开 n8n 的 Web 界面（通常是 `http://localhost:5678`）。
2. 创建一个新的工作流。
3. 在节点选择器中搜索你创建的插件名称（例如 `Wechat Node`）。
4. 将插件节点拖到工作流中，并配置其参数。
5. 运行工作流，测试插件的功能。

## 6. 调试和优化
如果插件没有按预期工作，你可以通过查看 n8n 的日志来调试问题。你还可以继续修改和优化插件代码，然后重新编译和链接。

## 7. 其他
如果你在过程中遇到任何问题，请参考 n8n 的官方文档或联系开发者。

## 8. 参考文档
[n8n 官方文档](https://docs.n8n.io/)
[n8n 插件开发文档](https://docs.n8n.io/developing-nodes/creating-nodes/creating-nodes/)
[n8n 插件开发示例](https://github.com/n8n-io/n8n-nodes-base/tree/master/nodes/n8n-nodes-base/nodes/Wechat)

## 9. 插件开发文档
[n8n 插件开发文档](https://docs.n8n.io/developing-nodes/creating-nodes/creating-nodes/)
[n8n 插件开发示例](https://github.com/n8n-io/n8n-nodes-base/tree/master/nodes/n8n-nodes-base/nodes/Wechat)

## 10. 插件开发示例
[n8n 插件开发示例](https://github.com/n8n-io/n8n-nodes-base/tree/master/nodes/n8n-nodes-base/nodes/Wechat)

## 11. 插件开发示例
[n8n 插件开发示例](https://github.com/n8n-io/n8n-nodes-base/tree/master/nodes/n8n-nodes-base/nodes/Wechat)

## 12. 插件开发示例
[n8n 插件开发示例](https://github.com/n8n-io/n8n-nodes-base/tree/master/nodes/n8n-nodes-base/nodes/Wechat)

TODO: 
- 添加插件开发文档

[ ] 添加插件开发示例
[X] 添加插件开发示例
<!-- TODO 添加插件开发示例 -->
<!-- FIXME 添加插件开发示例 -->
<!-- HACK 添加插件开发示例 -->
<!-- BUG 添加插件开发示例 -->
<!-- NOTE 添加插件开发示例 -->
<!-- DONE 添加插件开发示例 -->