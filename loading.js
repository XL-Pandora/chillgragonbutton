// 3秒后关闭加载动画
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const overlay = document.getElementById('splash-overlay');
    
    // 先触发缩小动画
    document.getElementById('splash-image-container').style.animation = 'shrink 0.5s ease-out forwards';
    
    // 动画结束后移除遮罩
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        initializePage(); // 初始化页面内容
      }, 500);
    }, 500); // 等待缩小动画完成
  }, 3000); // 总时长3秒
});

// 确保页面标题保持原样
function initializePage() {
  // 恢复原页面标题（防止CSS动画影响）
  const titleImg = document.querySelector('#page-header img');
  titleImg.style.width = ''; // 清除可能的样式覆盖
  
  // 原有初始化代码
  generateButtons();
  loadSongs();
}