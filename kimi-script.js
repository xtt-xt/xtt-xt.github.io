// ===== Kimi发现页面专用脚本 =====

// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 欢迎来到Kimi发现页面！', 'color: #9b59b6; font-size: 18px; font-weight: bold;');
    console.log('%c💡 点击游戏卡片查看详情和更新日志。', 'color: #3498db;');
    
    // 为游戏卡片添加点击效果
    initGameCards();
    
    // 为页面添加特殊效果
    addPageEffects();
    
    // 设置当前年份和最后更新日期
    setPageInfo();
});

// 设置页面信息
function setPageInfo() {
    // 设置当前年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // 设置最后更新日期
    const lastUpdate = new Date();
    document.getElementById('lastUpdate').textContent = 
        `${lastUpdate.getFullYear()}-${(lastUpdate.getMonth()+1).toString().padStart(2, '0')}-${lastUpdate.getDate().toString().padStart(2, '0')}`;
}

// 初始化游戏卡片交互
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // 添加点击事件 - 跳转到游戏详情页
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            window.location.href = `game-detail.html?game=${gameId}`;
        });
        
        // 添加键盘支持
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
                e.preventDefault();
            }
        });
        
        // 添加悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// 添加页面特效
function addPageEffects() {
    // 为游戏卡片添加延迟显示动画
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
}

// 主题同步检查
function checkThemeSync() {
    const currentTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    console.log(`当前主题: ${currentTheme}`);
    
    // 确保与主站主题同步
    if (currentTheme === 'light' && !document.body.classList.contains('light-mode')) {
        document.body.classList.add('light-mode');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// 页面卸载前保存主题状态
window.addEventListener('beforeunload', function() {
    // 确保主题状态保存
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

// 初始化主题同步
checkThemeSync();
