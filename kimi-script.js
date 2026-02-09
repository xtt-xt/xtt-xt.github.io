// ===== Kimi发现页面专用脚本 =====

// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 欢迎来到Kimi发现页面！', 'color: #9b59b6; font-size: 18px; font-weight: bold;');
    console.log('%c💡 点击游戏卡片查看详情和更新日志。', 'color: #3498db;');
    
    // 确保主题同步
    ensureThemeSync();
    
    // 为游戏卡片添加点击效果
    initGameCards();
    
    // 为页面添加特殊效果
    addPageEffects();
    
    // 设置当前年份和最后更新日期
    setPageInfo();
});

// 确保主题同步
function ensureThemeSync() {
    console.log('Kimi页面: 确保主题同步');
    
    // 检查本地存储中是否有主题设置
    let savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        // 如果没有保存的主题，使用系统偏好并保存
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = systemPrefersDark ? 'dark' : 'light';
        localStorage.setItem('theme', savedTheme);
        console.log('Kimi页面: 初始保存主题为', savedTheme);
    }
    
    // 应用主题
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('light-mode');
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    console.log('Kimi页面: 主题已同步为', savedTheme);
}

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
        card.addEventListener('click', function(e) {
            const gameId = this.getAttribute('data-game-id');
            if (gameId) {
                console.log('点击游戏卡片，跳转到:', gameId);
                window.location.href = `game-detail.html?game=${gameId}`;
            } else {
                console.error('游戏卡片缺少data-game-id属性');
                alert('游戏链接配置错误，请稍后再试');
            }
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

// 监听storage事件，确保主题变化时同步
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        console.log('Kimi页面: 检测到主题变化，重新同步');
        ensureThemeSync();
    }
});
