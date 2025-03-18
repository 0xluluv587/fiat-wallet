#!/usr/bin/env node

/**
 * Fiat-Wallet服务器管理工具
 * 
 * 使用方法:
 * 启动服务器: node server-manager.js start
 * 停止服务器: node server-manager.js stop
 * 重启服务器: node server-manager.js restart
 * 查看状态: node server-manager.js status
 * 
 * 也可以指定端口:
 * node server-manager.js start 3004
 */

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const DEFAULT_PORT = 3003;
const PID_FILE = path.join(__dirname, '.server-pid');
const LOG_FILE = path.join(__dirname, 'server.log');

// 解析命令行参数
const command = process.argv[2] || 'help';
const port = parseInt(process.argv[3]) || DEFAULT_PORT;

// 主函数
async function main() {
  switch (command) {
    case 'start':
      await startServer();
      break;
    case 'stop':
      await stopServer();
      break;
    case 'restart':
      await restartServer();
      break;
    case 'status':
      await checkStatus();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// 启动服务器
async function startServer() {
  console.log('正在启动服务器...');
  
  // 检查是否已有服务器在运行
  if (await isServerRunning()) {
    console.log(`服务器已在运行，PID: ${await getServerPid()}`);
    console.log(`可通过访问 http://localhost:${port} 查看`);
    return;
  }
  
  // 检查端口是否被占用
  const isPortFree = await checkPort(port);
  if (!isPortFree) {
    console.log(`端口 ${port} 已被占用，尝试自动查找可用端口...`);
    const availablePort = await findAvailablePort(port);
    console.log(`使用可用端口 ${availablePort}`);
    process.env.PORT = availablePort;
  } else {
    process.env.PORT = port;
  }
  
  // 启动服务器
  try {
    // 启动服务器进程，使用简化的方式处理输出
    const serverProcess = spawn('node', ['server.js'], { 
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, PORT: process.env.PORT }
    });
    
    // 将进程ID保存到文件
    fs.writeFileSync(PID_FILE, serverProcess.pid.toString());
    
    // 将进程与父进程分离
    serverProcess.unref();
    
    console.log(`服务器已启动，PID: ${serverProcess.pid}`);
    console.log(`端口: ${process.env.PORT}`);
    console.log(`访问地址: http://localhost:${process.env.PORT}`);
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
}

// 停止服务器
async function stopServer() {
  console.log('正在停止服务器...');
  
  if (!await isServerRunning()) {
    console.log('没有服务器在运行');
    return;
  }
  
  const pid = await getServerPid();
  if (!pid) {
    console.log('无法获取服务器PID，尝试强制关闭所有Node服务器实例...');
    await forceKillAllNodeServers();
    return;
  }
  
  try {
    process.kill(pid);
    console.log(`已停止服务器进程 (PID: ${pid})`);
    
    // 清理PID文件
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
  } catch (error) {
    console.error('无法停止服务器:', error);
    console.log('尝试强制关闭...');
    await forceKillAllNodeServers();
  }
}

// 重启服务器
async function restartServer() {
  console.log('正在重启服务器...');
  await stopServer();
  
  // 等待一点时间确保端口释放
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await startServer();
}

// 检查服务器状态
async function checkStatus() {
  if (await isServerRunning()) {
    const pid = await getServerPid();
    console.log(`服务器正在运行，PID: ${pid}`);
    console.log(`访问地址: http://localhost:${port}`);
  } else {
    console.log('服务器当前未运行');
  }
}

// 工具函数：检查服务器是否运行
async function isServerRunning() {
  const pid = await getServerPid();
  if (!pid) return false;
  
  try {
    // 发送空信号检查进程是否存在
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // 进程不存在
    return false;
  }
}

// 工具函数：获取服务器PID
async function getServerPid() {
  if (!fs.existsSync(PID_FILE)) return null;
  
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim());
    return pid || null;
  } catch (error) {
    return null;
  }
}

// 工具函数：检查端口是否可用
function checkPort(port) {
  return new Promise(resolve => {
    exec(`lsof -i:${port}`, (error, stdout) => {
      // 如果有错误或者没有输出，说明端口是空闲的
      resolve(!stdout || stdout.trim() === '');
    });
  });
}

// 工具函数：查找可用端口
async function findAvailablePort(startPort) {
  let port = startPort;
  
  while (!(await checkPort(port)) && port < startPort + 100) {
    port++;
  }
  
  return port;
}

// 工具函数：强制关闭所有Node服务器实例
function forceKillAllNodeServers() {
  return new Promise((resolve, reject) => {
    // 使用pkill命令查找并终止所有Node服务器进程
    exec('pkill -f "node server.js"', (error) => {
      // pkill可能会返回错误，如果没有找到匹配的进程
      if (error && error.code !== 1) {
        console.error('强制终止服务器失败:', error);
      } else {
        console.log('已强制终止所有Node服务器进程');
      }
      resolve();
    });
  });
}

// 显示帮助信息
function showHelp() {
  console.log(`
Fiat-Wallet服务器管理工具

使用方法:
  node server-manager.js [命令] [端口]

可用命令:
  start   - 启动服务器（默认端口: ${DEFAULT_PORT}）
  stop    - 停止服务器
  restart - 重启服务器
  status  - 检查服务器状态
  help    - 显示此帮助信息

示例:
  node server-manager.js start       # 在默认端口启动服务器
  node server-manager.js start 3004  # 在端口3004启动服务器
  node server-manager.js stop        # 停止服务器
  `);
}

// 执行主函数
main().catch(error => {
  console.error('发生错误:', error);
  process.exit(1);
}); 