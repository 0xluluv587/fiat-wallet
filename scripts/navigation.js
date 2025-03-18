// navigation.js - 实现全局导航栏功能

// 创建并添加导航栏HTML到页面
function injectNavigation() {
    // 创建导航按钮
    const navToggle = document.createElement('div');
    navToggle.className = 'nav-toggle';
    navToggle.id = 'navToggle';
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(navToggle);

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // 创建侧边栏
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';

    // 创建侧边栏头部
    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'sidebar-header';
    sidebarHeader.innerHTML = '<span>Matrix USD 原型导航</span><span class="close-sidebar" id="closeSidebar"><i class="fas fa-times"></i></span>';
    sidebar.appendChild(sidebarHeader);

    // 创建导航列表
    const navList = document.createElement('ul');
    navList.className = 'nav-list';
    
    // 添加导航项
    navList.innerHTML = `
        <li class="nav-item has-dropdown">
            <a href="#" class="nav-link">首页</a>
            <span class="dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
            <ul class="nav-dropdown">
                <li><a href="/" class="nav-link" target="_blank">钱包首页</a></li>
                <li><a href="/scenes-overview" class="nav-link" target="_blank">场景概览页</a></li>
            </ul>
        </li>
        <li class="nav-item has-dropdown">
            <a href="#" class="nav-link">场景三：交易功能</a>
            <span class="dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
            <ul class="nav-dropdown">
                <li><a href="/coin-exchange" class="nav-link" target="_blank">OTC 法币交易页面</a></li>
                <li><a href="/coin-exchange-confirm" class="nav-link" target="_blank">交易确认页面</a></li>
                <li><a href="/scenes/coin-exchange-withdraw.html" class="nav-link" target="_blank">USD 出金页面</a></li>
                <li><a href="/scenes/coin-exchange-deposit-bank.html" class="nav-link" target="_blank">USD 入金详情页面</a></li>
                <li><a href="/coin-exchange-insufficient?amount=5000&balance=2500" class="nav-link" target="_blank">余额不足提示页面</a></li>
                <li><a href="/coin-exchange-deposit?amount=5000" class="nav-link" target="_blank">USDC充值地址页面</a></li>
                <li><a href="/coin-exchange-waiting" class="nav-link" target="_blank">交易处理中页面</a></li>
                <li><a href="/coin-exchange-result?type=outbound&status=success" class="nav-link" target="_blank">出金交易结果页面</a></li>
                <li><a href="/coin-exchange-result?type=inbound&status=success" class="nav-link" target="_blank">入金交易结果页面</a></li>
                <li><a href="/scenes/transaction-status-notification.html" class="nav-link" target="_blank">交易状态通知组件</a></li>
            </ul>
        </li>
        <li class="nav-item has-dropdown">
            <a href="#" class="nav-link">其他页面</a>
            <span class="dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
            <ul class="nav-dropdown">
                <li><a href="/scenes/account.html" class="nav-link" target="_blank">账户页面</a></li>
                <li><a href="/otc-history.html" class="nav-link" target="_blank">交易历史记录</a></li>
            </ul>
        </li>
    `;
    
    sidebar.appendChild(navList);
    document.body.appendChild(sidebar);

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: margin-left 0.3s;
        }
        .nav-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #0052ff;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s;
        }
        .nav-toggle:hover {
            background: #0039c6;
            transform: scale(1.05);
        }
        .sidebar {
            position: fixed;
            top: 0;
            left: -300px;
            width: 300px;
            height: 100%;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 999;
            transition: left 0.3s;
            overflow-y: auto;
            padding-top: 70px;
        }
        .sidebar.open {
            left: 0;
        }
        .sidebar-header {
            position: fixed;
            top: 0;
            left: -300px;
            width: 300px;
            padding: 15px 20px;
            background: #0052ff;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transition: left 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sidebar.open .sidebar-header {
            left: 0;
        }
        .close-sidebar {
            cursor: pointer;
            font-size: 20px;
        }
        .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .nav-item {
            border-bottom: 1px solid #eee;
        }
        .nav-link {
            display: block;
            padding: 12px 20px;
            color: #333;
            text-decoration: none;
            transition: background 0.2s;
        }
        .nav-link:hover {
            background: #f5f8ff;
        }
        .nav-link.active {
            background: #e6f0ff;
            color: #0052ff;
            border-left: 4px solid #0052ff;
        }
        .nav-dropdown {
            margin: 0;
            padding: 0;
            list-style: none;
            background: #f9f9f9;
            display: none;
        }
        .nav-dropdown.open {
            display: block;
        }
        .nav-dropdown .nav-link {
            padding-left: 40px;
            font-size: 0.9em;
        }
        .has-dropdown {
            position: relative;
        }
        .dropdown-toggle {
            position: absolute;
            right: 0;
            top: 0;
            padding: 12px 20px;
            cursor: pointer;
            color: #666;
        }
        body.sidebar-open {
            margin-left: 300px;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            display: none;
            z-index: 998;
        }
        .overlay.visible {
            display: block;
        }
    `;
    document.head.appendChild(style);

    // 添加事件监听
    setupNavEvents();
}

// 设置导航事件
function setupNavEvents() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    
    // 打开侧边栏
    navToggle.addEventListener('click', function() {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        document.body.classList.add('sidebar-open');
    });
    
    // 关闭侧边栏
    function closeSidebarFunc() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.classList.remove('sidebar-open');
    }
    
    closeSidebar.addEventListener('click', closeSidebarFunc);
    overlay.addEventListener('click', closeSidebarFunc);
    
    // 绑定下拉菜单点击事件
    setTimeout(() => {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('open');
                const icon = this.querySelector('i');
                if (dropdown.classList.contains('open')) {
                    icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        });

        // 默认展开所有导航菜单
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.classList.add('open');
            const icon = dropdown.previousElementSibling.querySelector('i');
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        });
    }, 100);
}

// 初始化导航
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经在scenes-overview页面，如果是则不添加导航（因为该页面已有导航）
    if (!window.location.pathname.includes('scenes-overview')) {
        // 检查是否已有Font Awesome，如果没有则添加
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
        
        injectNavigation();
    }
}); 