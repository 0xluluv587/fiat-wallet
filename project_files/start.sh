#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 设置权限
chmod +x server-manager.js

# 如果没有参数则启动服务器
if [ $# -eq 0 ]; then
  node server-manager.js start
else
  # 否则执行相应的命令
  node server-manager.js "$@"
fi

# 提示信息
echo ""
echo "提示：您可以使用以下命令管理服务器"
echo "  ./start.sh        - 启动服务器"
echo "  ./start.sh stop   - 停止服务器"
echo "  ./start.sh restart - 重启服务器"
echo "  ./start.sh status - 查看服务器状态" 