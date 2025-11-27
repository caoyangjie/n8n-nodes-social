#!/bin/bash

# 更新所有 Wechat 节点文件中的 group 属性
for file in src/nodes/Wechat/*.node.ts; do
    sed -i 's/group: \[\x27wechat\x27\]/group: [\x27transform\x27]/' "$file"
done 