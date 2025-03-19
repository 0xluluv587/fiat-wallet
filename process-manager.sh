#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示标题
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}    Matrix USD 进程管理工具    ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# 主菜单函数
show_menu() {
    echo -e "${CYAN}请选择要执行的操作:${NC}"
    echo -e "${YELLOW}1)${NC} 查看所有HTTP服务器进程"
    echo -e "${YELLOW}2)${NC} 查看指定端口的占用情况"
    echo -e "${YELLOW}3)${NC} 终止指定端口的进程"
    echo -e "${YELLOW}4)${NC} 查找僵尸进程"
    echo -e "${YELLOW}5)${NC} 终止所有Node.js服务器进程"
    echo -e "${YELLOW}6)${NC} 终止指定PID的进程"
    echo -e "${YELLOW}7)${NC} 查看系统资源使用情况"
    echo -e "${YELLOW}8)${NC} 显示进程树"
    echo -e "${YELLOW}q)${NC} 退出"
    echo ""
    echo -n "请输入选项 [1-8/q]: "
}

# 查看所有HTTP服务器进程
view_http_processes() {
    echo -e "${BLUE}正在查找所有HTTP服务器进程...${NC}"
    echo ""
    
    # 查找Python HTTP服务器
    python_processes=$(ps -ef | grep -E "python.*http\.server" | grep -v grep)
    if [ -n "$python_processes" ]; then
        echo -e "${GREEN}Python HTTP 服务器:${NC}"
        echo "$python_processes" | awk '{print "PID: " $2 ", 命令: " $0}'
        echo ""
    fi
    
    # 查找Node.js HTTP服务器
    node_processes=$(ps -ef | grep -E "node.*server" | grep -v grep)
    if [ -n "$node_processes" ]; then
        echo -e "${GREEN}Node.js 服务器:${NC}"
        echo "$node_processes" | awk '{print "PID: " $2 ", 命令: " $0}'
        echo ""
    fi
    
    # 如果没有找到任何HTTP服务器进程
    if [ -z "$python_processes" ] && [ -z "$node_processes" ]; then
        echo -e "${YELLOW}未找到任何HTTP服务器进程。${NC}"
    fi
}

# 查看指定端口的占用情况
check_port() {
    echo -n "请输入要检查的端口号: "
    read -r port_number
    
    if [[ ! "$port_number" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}错误: 请输入有效的端口号${NC}"
        return
    fi
    
    echo -e "${BLUE}正在检查端口 $port_number 的占用情况...${NC}"
    port_info=$(lsof -i :"$port_number" 2>/dev/null)
    
    if [ -n "$port_info" ]; then
        echo -e "${GREEN}端口 $port_number 被以下进程占用:${NC}"
        echo "$port_info"
        echo ""
        echo -e "${YELLOW}是否要终止这些进程? (y/n): ${NC}"
        read -r kill_response
        
        if [ "$kill_response" = "y" ]; then
            pid=$(echo "$port_info" | grep -v "PID" | awk '{print $2}' | head -1)
            if [ -n "$pid" ]; then
                kill -9 "$pid" 2>/dev/null
                echo -e "${GREEN}已终止进程 PID: $pid${NC}"
            else
                echo -e "${RED}无法获取进程PID${NC}"
            fi
        fi
    else
        echo -e "${GREEN}端口 $port_number 当前未被占用${NC}"
    fi
}

# 终止指定端口的进程
kill_port_process() {
    echo -n "请输入要终止进程的端口号: "
    read -r port_number
    
    if [[ ! "$port_number" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}错误: 请输入有效的端口号${NC}"
        return
    fi
    
    echo -e "${BLUE}正在查找并终止端口 $port_number 的进程...${NC}"
    port_info=$(lsof -i :"$port_number" 2>/dev/null)
    
    if [ -n "$port_info" ]; then
        echo -e "${YELLOW}以下进程将被终止:${NC}"
        echo "$port_info"
        echo ""
        echo -e "${RED}确认终止这些进程? (y/n): ${NC}"
        read -r confirm_kill
        
        if [ "$confirm_kill" = "y" ]; then
            pids=$(echo "$port_info" | grep -v "PID" | awk '{print $2}')
            for pid in $pids; do
                kill -9 "$pid" 2>/dev/null
                echo -e "${GREEN}已终止进程 PID: $pid${NC}"
            done
        else
            echo -e "${YELLOW}操作已取消${NC}"
        fi
    else
        echo -e "${YELLOW}端口 $port_number 当前未被占用${NC}"
    fi
}

# 查找僵尸进程
find_zombie_processes() {
    echo -e "${BLUE}正在查找僵尸进程...${NC}"
    zombie_processes=$(ps -ef | grep -w Z | grep -v grep)
    
    if [ -n "$zombie_processes" ]; then
        echo -e "${YELLOW}发现以下僵尸进程:${NC}"
        echo "$zombie_processes"
        echo ""
        echo -e "${RED}警告: 僵尸进程通常需要终止其父进程才能清除${NC}"
        echo -e "${YELLOW}是否要尝试终止僵尸进程的父进程? (y/n): ${NC}"
        read -r kill_zombie_parent
        
        if [ "$kill_zombie_parent" = "y" ]; then
            parent_pids=$(echo "$zombie_processes" | awk '{print $3}' | sort -u)
            for ppid in $parent_pids; do
                echo -e "${YELLOW}终止父进程 PID: $ppid${NC}"
                kill -9 "$ppid" 2>/dev/null
                echo -e "${GREEN}已尝试终止父进程 PID: $ppid${NC}"
            done
        else
            echo -e "${YELLOW}操作已取消${NC}"
        fi
    else
        echo -e "${GREEN}未发现僵尸进程${NC}"
    fi
}

# 终止所有Node.js服务器进程
kill_all_node_servers() {
    echo -e "${BLUE}正在查找所有Node.js服务器进程...${NC}"
    node_processes=$(ps -ef | grep -E "node.*server" | grep -v grep)
    
    if [ -n "$node_processes" ]; then
        echo -e "${YELLOW}以下Node.js进程将被终止:${NC}"
        echo "$node_processes" | awk '{print "PID: " $2 ", 命令: " $0}'
        echo ""
        echo -e "${RED}确认终止所有Node.js服务器进程? (y/n): ${NC}"
        read -r confirm_kill_all
        
        if [ "$confirm_kill_all" = "y" ]; then
            pids=$(echo "$node_processes" | awk '{print $2}')
            for pid in $pids; do
                kill -9 "$pid" 2>/dev/null
                echo -e "${GREEN}已终止进程 PID: $pid${NC}"
            done
        else
            echo -e "${YELLOW}操作已取消${NC}"
        fi
    else
        echo -e "${YELLOW}未找到任何Node.js服务器进程${NC}"
    fi
}

# 终止指定PID的进程
kill_process_by_pid() {
    echo -n "请输入要终止的进程PID: "
    read -r process_pid
    
    if [[ ! "$process_pid" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}错误: 请输入有效的PID${NC}"
        return
    fi
    
    # 检查进程是否存在
    if ps -p "$process_pid" > /dev/null; then
        echo -e "${BLUE}进程信息:${NC}"
        ps -f -p "$process_pid"
        echo ""
        echo -e "${RED}确认终止此进程? (y/n): ${NC}"
        read -r confirm_kill_pid
        
        if [ "$confirm_kill_pid" = "y" ]; then
            kill -9 "$process_pid" 2>/dev/null
            echo -e "${GREEN}已终止进程 PID: $process_pid${NC}"
        else
            echo -e "${YELLOW}操作已取消${NC}"
        fi
    else
        echo -e "${RED}PID为 $process_pid 的进程不存在${NC}"
    fi
}

# 查看系统资源使用情况
view_system_resources() {
    echo -e "${BLUE}系统资源使用情况:${NC}"
    echo ""
    
    echo -e "${GREEN}CPU 使用情况:${NC}"
    top -l 1 | grep -E "^CPU"
    echo ""
    
    echo -e "${GREEN}内存使用情况:${NC}"
    vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f MB\n", "$1:", $2 * $size / 1048576);'
    echo ""
    
    echo -e "${GREEN}磁盘使用情况:${NC}"
    df -h | grep -v "map"
}

# 显示进程树
show_process_tree() {
    echo -e "${BLUE}正在生成进程树...${NC}"
    
    if command -v pstree > /dev/null; then
        pstree
    else
        echo -e "${YELLOW}pstree 命令不可用，使用替代方法...${NC}"
        ps -aef | grep -v grep
    fi
}

# 循环执行操作
while true; do
    show_menu
    read -r option
    
    case $option in
        1)
            view_http_processes
            ;;
        2)
            check_port
            ;;
        3)
            kill_port_process
            ;;
        4)
            find_zombie_processes
            ;;
        5)
            kill_all_node_servers
            ;;
        6)
            kill_process_by_pid
            ;;
        7)
            view_system_resources
            ;;
        8)
            show_process_tree
            ;;
        q|Q)
            echo -e "${GREEN}谢谢使用!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}无效选项，请重试${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}操作完成，按回车键继续...${NC}"
    read -r
    clear
done 