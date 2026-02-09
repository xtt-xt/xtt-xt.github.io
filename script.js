// ===== 1. 主题切换功能 =====
let themeToggle, themeIcon;

// 初始化主题相关元素
function initThemeElements() {
    themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeIcon = themeToggle.querySelector('i');
    }
}

function initTheme() {
    initThemeElements();
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('初始化主题:', {
        savedTheme,
        systemPrefersDark,
        hasThemeToggle: !!themeToggle,
        hasThemeIcon: !!themeIcon
    });
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

function toggleTheme() {
    initThemeElements(); // 重新获取元素
    
    document.body.classList.toggle('light-mode');
    if (themeIcon) {
        if (document.body.classList.contains('light-mode')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
            console.log('切换到浅色模式');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
            console.log('切换到深色模式');
        }
    }
}

// 初始化主题事件监听
function initThemeEvents() {
    initThemeElements();
    
    if (themeToggle) {
        // 移除旧的事件监听器（避免重复）
        themeToggle.removeEventListener('click', toggleTheme);
        themeToggle.removeEventListener('keydown', handleThemeKeydown);
        
        // 添加新的事件监听器
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('keydown', handleThemeKeydown);
    }
}

function handleThemeKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        toggleTheme();
        e.preventDefault();
    }
}

// ===== 2. 跨页面主题同步 =====
function syncTheme() {
    console.log('同步主题...');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 如果没有保存的主题，使用系统偏好
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    console.log('当前主题应为:', currentTheme);
    
    // 应用主题
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('light-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== 3. 基本信息设置 =====
function initPageInfo() {
    if (document.getElementById('currentYear')) {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
    
    if (document.getElementById('lastUpdate')) {
        const lastUpdate = new Date();
        document.getElementById('lastUpdate').textContent = 
            `${lastUpdate.getFullYear()}-${(lastUpdate.getMonth()+1).toString().padStart(2, '0')}-${lastUpdate.getDate().toString().padStart(2, '0')}`;
    }
}

// ===== 4. 页面事件处理 =====
// 页面加载完成后执行
function onPageLoad() {
    console.log('页面加载完成:', window.location.pathname);
    
    // 同步主题（优先）
    syncTheme();
    
    // 初始化主题
    initTheme();
    
    // 初始化主题事件
    initThemeEvents();
    
    // 初始化页面信息
    initPageInfo();
    
    console.log('页面初始化完成');
}

// 页面显示时同步主题（处理后退/前进缓存）
function onPageShow(event) {
    if (event.persisted) {
        console.log('页面从缓存恢复，重新同步主题');
        setTimeout(syncTheme, 100);
    }
}

// 监听storage事件（其他标签页修改主题时）
function onStorageChange(event) {
    if (event.key === 'theme') {
        console.log('检测到主题变化:', event.newValue);
        syncTheme();
    }
}

// ===== 5. 事件监听器设置 =====
// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成');
    onPageLoad();
});

// 页面完全加载后
window.addEventListener('load', function() {
    console.log('页面完全加载');
    // 确保主题正确应用
    setTimeout(syncTheme, 100);
});

// 页面显示事件（处理浏览器缓存）
window.addEventListener('pageshow', onPageShow);

// 监听storage变化
window.addEventListener('storage', onStorageChange);

// ===== 6. 全局函数（供其他页面调用） =====
// 导出主题相关函数供其他脚本使用
window.AppTheme = {
    syncTheme: syncTheme,
    toggleTheme: toggleTheme,
    initTheme: initTheme
};

// 控制台欢迎信息
console.log('%c🎉 欢迎访问星天(xtt)的个人网站！', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
console.log('%c💡 提示：点击右上角按钮可切换深浅主题。', 'color: #3498db;');
