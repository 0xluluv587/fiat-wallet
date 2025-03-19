# Matrix USD 开发运维工具集

这个工具集包含了一系列用于辅助开发、部署和维护 Matrix USD 项目的脚本工具。这些工具旨在简化常见的开发和运维任务，提高工作效率。

## 工具列表

### 1. 本地开发服务器 (`local-server.js` & `start-dev.sh`)

智能本地开发服务器，具有以下特点：

- **自动端口选择**：在默认端口被占用时自动尝试其他端口
- **静态文件服务**：提供HTML/CSS/JS等静态资源服务
- **自动打开浏览器**：服务启动后自动在浏览器中打开
- **友好的错误提示**：美观的404、500等错误页面
- **显示本地IP**：方便局域网内其他设备访问

#### 使用方法：

```bash
# 方法1：使用启动脚本（推荐）
./start-dev.sh

# 方法2：直接运行Node.js服务器
node local-server.js
```

### 2. GitHub 仓库管理工具 (`github-helper.sh`)

交互式GitHub仓库管理工具，支持以下功能：

- 查看仓库状态
- 添加/提交/推送更改
- 管理分支（创建/切换/合并）
- 一键部署（add + commit + push）
- 设置远程仓库

#### 使用方法：

```bash
./github-helper.sh
```

然后按照菜单提示选择要执行的操作。

### 3. 进程管理工具 (`process-manager.sh`)

解决端口冲突和进程管理的工具，支持：

- 查找和终止占用特定端口的进程
- 查看所有HTTP服务器进程
- 查找并清理僵尸进程
- 监控系统资源使用情况
- 显示进程树

#### 使用方法：

```bash
./process-manager.sh
```

然后按照菜单提示选择要执行的操作。

### 4. GitHub Pages 自动部署 (`.github/workflows/deploy.yml`)

GitHub Actions 工作流程配置，用于自动部署项目到 GitHub Pages：

- 在推送到主分支时自动触发
- 支持通过 PR 预览部署效果
- 可手动触发部署

#### 使用方法：

1. 将代码推送到 GitHub 仓库
2. GitHub Actions 会自动执行部署流程
3. 部署完成后可通过 GitHub Pages URL 访问项目

## 自定义配置

### 本地开发服务器配置

您可以在 `local-server.js` 文件中修改以下配置项：

```javascript
const config = {
  startingPort: 8000,  // 开始尝试的端口
  maxPortAttempts: 10, // 最大尝试次数
  defaultPath: '/docs/showcase.html', // 默认打开的路径
  autoOpenBrowser: true, // 是否自动打开浏览器
  showAccessLog: true, // 是否显示访问日志
};
```

### GitHub Pages 部署配置

您可以在 `.github/workflows/deploy.yml` 文件中修改以下配置：

```yaml
folder: docs  # 要部署的文件夹
branch: gh-pages  # 部署到的分支 
```

## 故障排除

### 端口占用问题

如果遇到端口被占用的情况：

1. 使用进程管理工具查看占用端口的进程：`./process-manager.sh` 选项 2
2. 终止占用端口的进程：`./process-manager.sh` 选项 3
3. 或者修改 `local-server.js` 中的 `startingPort` 配置项

### GitHub 部署失败

如果 GitHub Pages 部署失败：

1. 检查 GitHub 仓库的 Actions 选项卡，查看错误日志
2. 确保 `.github/workflows/deploy.yml` 配置正确
3. 检查部署的分支权限设置

## 注意事项

- 这些工具脚本需要在项目根目录下运行
- 确保脚本具有执行权限（通过 `chmod +x *.sh` 添加）
- 部分功能可能需要安装相关依赖 