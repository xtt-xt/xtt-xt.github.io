// ===== Kimi发现页面专用脚本 =====

// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 欢迎来到Kimi发现页面！', 'color: #9b59b6; font-size: 18px; font-weight: bold;');
    console.log('%c💡 这里将展示各种基于AI的创意游戏和应用。', 'color: #3498db;');
    
    // 为游戏卡片添加点击效果
    initGameCards();
    
    // 为页面添加特殊效果
    addPageEffects();
});

// 初始化游戏卡片交互
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // 添加点击效果
        card.addEventListener('click', function() {
            const gameTitle = this.querySelector('h3').textContent;
            const gameStatus = this.querySelector('.game-status').textContent;
            
            if (gameStatus === '开发中') {
                alert(`"${gameTitle}" 正在开发中，敬请期待！`);
            } else if (gameStatus === '即将推出') {
                alert(`"${gameTitle}" 即将推出，很快就会上线！`);
            } else {
                alert(`"${gameTitle}" 正在规划中，未来会与大家见面！`);
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
        
        // 添加悬停声音效果（可选）
        card.addEventListener('mouseenter', function() {
            // 可以在这里添加音效或动画
            this.style.cursor = 'pointer';
        });
    });
}

// 添加页面特效
function addPageEffects() {
    // 为路线图项目添加滚动动画
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    roadmapItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
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
