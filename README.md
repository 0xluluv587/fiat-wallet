# Fiat-Wallet 原型项目

Matrix USD 高净值用户USD机构专属账户功能原型展示项目，探索使用Cursor+Claude进行高保真原型绘制、且持续提升生产力的可行性和经验

## 项目概述

该项目是Matrix USD产品的高保真原型，展示了用户USD机构专属账户的各项功能，包括账户开通流程、账户管理、交易功能和安全管理等多个场景。项目使用纯HTML、CSS和JavaScript构建，通过Express服务器提供服务。

## 主要功能

项目包含以下主要场景：

1. **场景一：账户开通流程**
   - 未开户状态
   - 身份认证
   - 开户审核中
   - 开户未通过

2. **场景二：账户管理**
   - 账户总览
   - 账户充值
   - 账户提现

3. **场景三：交易功能**
   - 币币兑换（USDC/USD）
   - 交易确认
   - 余额不足处理
   - 交易等待与结果页面
   - 交易状态通知
   - 交易历史记录

4. **场景四：安全管理**
   - 安全设置
   - 银行卡管理

## 如何运行项目

### 前提条件

- Node.js (推荐 v14 或更高版本)
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动服务器

我们提供了一个简便的服务器管理脚本，可以轻松启动、停止和重启服务器：

```bash
# 启动服务器
./start.sh

# 停止服务器
./start.sh stop

# 重启服务器
./start.sh restart

# 查看服务器状态
./start.sh status

# 在指定端口启动服务器
./start.sh start 3004
```

服务器启动后，可以通过浏览器访问 http://localhost:3003 查看原型。

## 服务器管理工具

项目包含一个强大的服务器管理工具（server-manager.js），提供以下特性：

1. **自动端口管理** - 如果默认端口被占用，会自动查找并使用可用端口
2. **进程管理** - 跟踪服务器进程，防止多个实例同时运行
3. **状态监控** - 随时查看服务器运行状态
4. **优雅停止** - 安全地停止服务器进程

## 项目结构

```
fiat-wallet/
├── server.js              # Express服务器
├── server-manager.js      # 服务器管理工具
├── start.sh               # 启动脚本
├── src/                   # 源代码目录
│   ├── index.html         # 主页
│   ├── styles/            # CSS样式
│   ├── scripts/           # JavaScript脚本
│   └── scenes/            # 场景页面
│       ├── coin-exchange.html
│       ├── coin-exchange-confirm.html
│       └── ...            # 其他场景页面
└── README.md              # 项目说明
```

## 解决问题

如果遇到"address already in use"错误，请使用我们的服务器管理工具重启服务器：

```bash
./start.sh restart
```

这会自动停止现有服务器进程并启动新实例。 
