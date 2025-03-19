import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 设置静态文件目录
app.use(express.static('src'));
// 添加docs目录作为静态文件目录
app.use('/docs', express.static('docs'));

// 路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// 添加交易记录页面路由
app.get('/transactions', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'transactions.html'));
});

// 添加币币兑换页面路由
app.get('/coin-exchange', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange.html'));
});

// 添加币币兑换确认页面路由
app.get('/coin-exchange-confirm', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange-confirm.html'));
});

// 添加历史记录页面路由
app.get('/history.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'otc-history.html'));
});

// 添加otc历史记录页面路由
app.get('/otc-history.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'otc-history.html'));
});

// 添加scenes目录下文件的路由
app.get('/scenes/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', req.params.filename));
});

// 添加所有新创建的页面路由
app.get('/coin-exchange-insufficient', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange-insufficient.html'));
});

app.get('/coin-exchange-deposit', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange-deposit.html'));
});

app.get('/coin-exchange-waiting', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange-waiting.html'));
});

app.get('/coin-exchange-result', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'coin-exchange-result.html'));
});

// 添加场景概览页面路由
app.get('/scenes-overview', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scenes', 'scenes-overview.html'));
});

// 从环境变量获取端口，默认为3003
const port = process.env.PORT || 3003;

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 