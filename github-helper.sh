#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示标题
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}     Matrix USD GitHub 管理工具      ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# 检查 Git 是否已安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: Git 未安装${NC}"
    echo -e "请访问 https://git-scm.com/ 安装 Git"
    exit 1
fi

# 检查是否是 Git 仓库
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}当前目录不是 Git 仓库，是否初始化? (y/n)${NC}"
    read -r init_response
    if [ "$init_response" = "y" ]; then
        git init
        echo -e "${GREEN}Git 仓库已初始化${NC}"
    else
        echo -e "${RED}操作取消${NC}"
        exit 1
    fi
fi

# 主菜单函数
show_menu() {
    echo -e "${CYAN}请选择要执行的操作:${NC}"
    echo -e "${YELLOW}1)${NC} 查看仓库状态"
    echo -e "${YELLOW}2)${NC} 添加所有更改"
    echo -e "${YELLOW}3)${NC} 提交更改"
    echo -e "${YELLOW}4)${NC} 推送到远程仓库"
    echo -e "${YELLOW}5)${NC} 拉取最新更改"
    echo -e "${YELLOW}6)${NC} 查看分支"
    echo -e "${YELLOW}7)${NC} 创建新分支"
    echo -e "${YELLOW}8)${NC} 切换分支"
    echo -e "${YELLOW}9)${NC} 合并分支"
    echo -e "${YELLOW}10)${NC} 设置远程仓库"
    echo -e "${YELLOW}11)${NC} 一键部署 (add+commit+push)"
    echo -e "${YELLOW}q)${NC} 退出"
    echo ""
    echo -n "请输入选项 [1-11/q]: "
}

# 检查远程仓库是否已设置
check_remote() {
    if ! git remote -v | grep -q "origin"; then
        echo -e "${YELLOW}警告: 未设置远程仓库${NC}"
        echo -e "请选择选项 10 设置远程仓库"
        return 1
    fi
    return 0
}

# 循环执行操作
while true; do
    show_menu
    read -r option
    
    case $option in
        1)
            echo -e "${BLUE}执行: 查看仓库状态${NC}"
            git status
            ;;
        2)
            echo -e "${BLUE}执行: 添加所有更改${NC}"
            git add .
            echo -e "${GREEN}所有更改已添加到暂存区${NC}"
            ;;
        3)
            echo -e "${BLUE}执行: 提交更改${NC}"
            echo -n "请输入提交信息: "
            read -r commit_message
            git commit -m "$commit_message"
            ;;
        4)
            echo -e "${BLUE}执行: 推送到远程仓库${NC}"
            if check_remote; then
                current_branch=$(git branch --show-current)
                echo -n "推送到分支 $current_branch? (y/n): "
                read -r push_response
                if [ "$push_response" = "y" ]; then
                    git push origin "$current_branch"
                else
                    echo -n "请输入要推送到的分支名: "
                    read -r branch_name
                    git push origin "$branch_name"
                fi
            fi
            ;;
        5)
            echo -e "${BLUE}执行: 拉取最新更改${NC}"
            if check_remote; then
                git pull
            fi
            ;;
        6)
            echo -e "${BLUE}执行: 查看分支${NC}"
            git branch -a
            ;;
        7)
            echo -e "${BLUE}执行: 创建新分支${NC}"
            echo -n "请输入新分支名: "
            read -r new_branch
            git checkout -b "$new_branch"
            echo -e "${GREEN}已创建并切换到分支: $new_branch${NC}"
            ;;
        8)
            echo -e "${BLUE}执行: 切换分支${NC}"
            git branch
            echo -n "请输入要切换到的分支名: "
            read -r switch_branch
            git checkout "$switch_branch"
            ;;
        9)
            echo -e "${BLUE}执行: 合并分支${NC}"
            git branch
            echo -n "请输入要合并的分支名: "
            read -r merge_branch
            git merge "$merge_branch"
            ;;
        10)
            echo -e "${BLUE}执行: 设置远程仓库${NC}"
            echo -n "请输入远程仓库URL: "
            read -r remote_url
            git remote add origin "$remote_url" 2>/dev/null || git remote set-url origin "$remote_url"
            echo -e "${GREEN}远程仓库已设置: $remote_url${NC}"
            ;;
        11)
            echo -e "${BLUE}执行: 一键部署${NC}"
            echo -n "请输入提交信息: "
            read -r auto_commit_message
            git add .
            echo -e "${GREEN}所有更改已添加到暂存区${NC}"
            git commit -m "$auto_commit_message"
            
            if check_remote; then
                current_branch=$(git branch --show-current)
                git push origin "$current_branch"
                echo -e "${GREEN}已推送到 $current_branch${NC}"
            fi
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