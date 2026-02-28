// buttonGenerator.js
document.addEventListener('DOMContentLoaded', function() {
    generateButtonsFromJSON();
});

async function generateButtonsFromJSON() {
    try {
        // 加载JSON文件
        const response = await fetch('buttonAudio.json');
        const categories = await response.json();
        
        // 找到所有现有的按钮分类容器
        const existingCategories = document.querySelectorAll('.category');
        
        // 遍历JSON中的每个分类
        for (const [categoryName, buttons] of Object.entries(categories)) {
            // 过滤掉空文件名的按钮
            const validButtons = buttons.filter(btn => btn.file && btn.file.trim() !== '');
            if (validButtons.length === 0) continue;
            
            // 查找是否已有同名的分类容器
            let categoryDiv = null;
            for (const cat of existingCategories) {
                const title = cat.querySelector('h2');
                if (title && title.textContent === categoryName) {
                    categoryDiv = cat;
                    break;
                }
            }
            
            // 如果没有找到同名分类，就创建一个新的
            if (!categoryDiv) {
                categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';
                
                // 创建分类标题
                const title = document.createElement('h2');
                title.textContent = categoryName;
                categoryDiv.appendChild(title);
                
                // 插入到侧边栏之前
                const sidePanel = document.getElementById('side-panel');
                sidePanel.parentNode.insertBefore(categoryDiv, sidePanel);
            }
            
            // 为这个分类下的每个按钮生成HTML
            validButtons.forEach(btn => {
                // 检查这个按钮是否已经存在（通过文本内容和data-audio-url判断）
                const existingButtons = categoryDiv.querySelectorAll('.audio-btn');
                let buttonExists = false;
                
                for (const existingBtn of existingButtons) {
                    if (existingBtn.textContent === btn.name && 
                        existingBtn.dataset.audioUrl === `audio/${btn.file}`) {
                        buttonExists = true;
                        break;
                    }
                }
                
                // 如果按钮不存在，才创建新按钮
                if (!buttonExists) {
                    const button = document.createElement('button');
                    button.className = 'audio-btn';
                    button.setAttribute('data-audio-url', `audio/${btn.file}`);
                    button.textContent = btn.name;
                    
                    // 添加到分类容器
                    categoryDiv.appendChild(button);
                }
            });
        }
        
        console.log('按钮生成完成！');

        // ==== 新增：重新初始化音频按钮 ====
        if (typeof initAudioButtons === 'function') {
            console.log('重新初始化音频按钮...');
            initAudioButtons();
        } else {
            console.warn('initAudioButtons 函数未找到');
        }

        
    } catch (error) {
        console.error('加载音频列表失败:', error);
    }
}