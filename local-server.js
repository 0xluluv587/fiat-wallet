#!/usr/bin/env node

/**
 * 智能本地开发服务器
 * 功能：
 * 1. 自动检测端口占用并选择可用端口
 * 2. 提供静态文件服务
 * 3. 自动打开浏览器（可选）
 * 4. 显示请求日志
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mime = require('mime-types');

// 配置
const config = {
  startingPort: 8000,  // 开始尝试的端口
  maxPortAttempts: 10, // 最大尝试次数
  defaultPath: '/docs/showcase.html', // 默认打开的路径
  autoOpenBrowser: true, // 是否自动打开浏览器
  showAccessLog: true, // 是否显示访问日志
};

// 美化控制台输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 创建HTTP服务器
function createServer(port) {
  const server = http.createServer((req, res) => {
    // 提取URL路径
    let filePath = '.' + req.url;
    
    // 处理默认路径
    if (filePath === './') {
      filePath = '.' + config.defaultPath;
    }
    
    // 获取文件的绝对路径
    const absolutePath = path.resolve(filePath);
    
    // 检查文件是否存在
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head>
              <title>404 - 找不到文件</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 30px; text-align: center; }
                h1 { color: #e74c3c; }
                .container { max-width: 600px; margin: 0 auto; }
                .path { background: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>404 - 找不到文件</h1>
                <p>请求的文件不存在：</p>
                <div class="path">${filePath}</div>
                <p><a href="${config.defaultPath}">返回主页</a></p>
              </div>
            </body>
          </html>
        `);
        
        if (config.showAccessLog) {
          console.log(`${colors.red}[404]${colors.reset} ${req.method} ${req.url}`);
        }
        return;
      }
      
      // 获取文件的扩展名
      const extname = path.extname(filePath);
      const contentType = mime.lookup(extname) || 'application/octet-stream';
      
      // 读取文件
      fs.readFile(absolutePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head>
                <title>500 - 服务器错误</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 30px; text-align: center; }
                  h1 { color: #e74c3c; }
                  .container { max-width: 600px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>500 - 服务器错误</h1>
                  <p>读取文件时发生错误。</p>
                  <p><a href="${config.defaultPath}">返回主页</a></p>
                </div>
              </body>
            </html>
          `);
          
          console.error(`${colors.red}[500]${colors.reset} 读取文件失败: ${absolutePath}`);
          console.error(err);
          return;
        }
        
        // 返回文件内容
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        
        if (config.showAccessLog) {
          console.log(`${colors.green}[200]${colors.reset} ${req.method} ${req.url}`);
        }
      });
    });
  });
  
  return server;
}

// 检查端口是否可用
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// 打开浏览器
function openBrowser(url) {
  let command;
  
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "${url}"`;
      break;
    default: // Linux
      command = `xdg-open "${url}"`;
      break;
  }
  
  exec(command, (err) => {
    if (err) {
      console.log(`${colors.yellow}[警告]${colors.reset} 无法自动打开浏览器，请手动访问: ${url}`);
    }
  });
}

// 启动服务器
async function startServer() {
  let currentPort = config.startingPort;
  let attempts = 0;
  
  while (attempts < config.maxPortAttempts) {
    const available = await isPortAvailable(currentPort);
    
    if (available) {
      const server = createServer(currentPort);
      
      server.listen(currentPort, () => {
        const localUrl = `http://localhost:${currentPort}${config.defaultPath}`;
        
        console.log('\n');
        console.log(`${colors.bright}${colors.green}🚀 本地服务器已启动!${colors.reset}`);
        console.log('-'.repeat(50));
        console.log(`${colors.cyan}本地访问地址:${colors.reset} ${localUrl}`);
        
        // 获取本地IP地址
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        const ipAddresses = [];
        
        for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
            // 跳过内部IP和非IPv4地址
            if (net.family === 'IPv4' && !net.internal) {
              ipAddresses.push(net.address);
            }
          }
        }
        
        if (ipAddresses.length > 0) {
          console.log(`${colors.cyan}局域网访问:${colors.reset}`);
          ipAddresses.forEach(ip => {
            console.log(`  http://${ip}:${currentPort}${config.defaultPath}`);
          });
        }
        
        console.log('-'.repeat(50));
        console.log(`${colors.yellow}按 Ctrl+C 停止服务器${colors.reset}`);
        console.log('\n');
        
        // 自动打开浏览器
        if (config.autoOpenBrowser) {
          openBrowser(localUrl);
        }
      });
      
      return;
    }
    
    console.log(`${colors.yellow}[信息]${colors.reset} 端口 ${currentPort} 已被占用，尝试下一个端口...`);
    currentPort++;
    attempts++;
  }
  
  console.error(`${colors.red}[错误]${colors.reset} 尝试了 ${config.maxPortAttempts} 个端口，但都被占用。请手动指定一个可用端口。`);
  process.exit(1);
}

// 处理进程终止信号
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.green}👋 服务器已停止${colors.reset}`);
  process.exit(0);
});

// 启动服务器
console.log(`${colors.bright}${colors.blue}📡 正在启动本地开发服务器...${colors.reset}`);
startServer(); 