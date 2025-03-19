#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示标题
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}     Matrix USD 开发环境启动工具     ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装${NC}"
    echo -e "请访问 https://nodejs.org/ 安装 Node.js"
    exit 1
fi

# 检查是否已安装依赖项
if [ ! -d "node_modules" ] || [ ! -d "node_modules/mime-types" ]; then
    echo -e "${YELLOW}正在安装必要的依赖...${NC}"
    npm install mime-types --save
    echo -e "${GREEN}依赖安装完成!${NC}"
fi

# 添加执行权限
chmod +x local-server.js

# 启动本地服务器
echo -e "${BLUE}正在启动本地开发服务器...${NC}"
node local-server.js 