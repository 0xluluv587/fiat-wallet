/**
 * 测试脚本: 验证iframe内容显示效果
 * 
 * 此脚本将直接在浏览器控制台运行，用于验证showcase页面中的iframe内容是否完整显示
 * 使用方法:
 * 1. 在浏览器中打开showcase.html
 * 2. 打开开发者工具 (F12 或 Cmd+Option+I)
 * 3. 复制本脚本内容并粘贴到控制台中运行
 */

(function() {
    console.log('===== 开始测试iframe内容显示效果 =====');
    
    // 获取所有iframe元素
    const frames = document.querySelectorAll('.scene-frame');
    console.log(`找到 ${frames.length} 个iframe元素`);
    
    // 检查每个iframe
    frames.forEach((frame, index) => {
        console.log(`\n检查iframe #${index + 1}:`);
        
        // 输出iframe尺寸信息
        const rect = frame.getBoundingClientRect();
        console.log(`- 显示尺寸: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px`);
        
        try {
            // 访问iframe内容
            const frameContent = frame.contentDocument || frame.contentWindow.document;
            
            // 获取内容高度
            const bodyHeight = frameContent.body.scrollHeight;
            const contentVisible = rect.height >= bodyHeight;
            
            console.log(`- 内容高度: ${bodyHeight}px`);
            console.log(`- 内容是否完全可见: ${contentVisible ? '✓ 是' : '✗ 否'}`);
            
            if (!contentVisible) {
                console.log(`  需要${bodyHeight - rect.height}px额外空间来显示完整内容`);
                
                // 自动修复显示问题
                console.log('  正在尝试修复...');
                
                // 调整iframe高度
                frame.style.height = bodyHeight + 'px';
                
                // 调整父容器以适应更大的iframe
                const iphoneScreen = frame.closest('.iphone-screen');
                if (iphoneScreen) {
                    iphoneScreen.style.overflowY = 'auto';
                }
                
                console.log('  ✓ 修复已应用');
            }
        } catch (e) {
            console.log(`- 无法访问iframe内容: ${e.message}`);
        }
    });
    
    console.log('\n===== 测试完成 =====');
    console.log('如需手动检查: 点击查看每个iframe内容，确保所有内容可见');
})(); 