// ===== 1. 主题切换功能 =====
const themeToggle = document.getElementById('themeToggle');
let themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 重新获取themeIcon，确保在动态页面中也能获取到
    themeIcon = document.querySelector('#themeToggle i');
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    } else {
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (themeIcon) {
        if (document.body.classList.contains('light-mode')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }
}

// 点击切换主题
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    
    // 支持键盘Enter键切换
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') toggleTheme();
    });
}

// ===== 2. 跨页面主题同步 =====
function syncTheme() {
    // 检查是否有主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 应用主题
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = 'fas fa-sun';
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = 'fas fa-moon';
    }
}

// ===== 3. 基本信息设置 =====
if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

if (document.getElementById('lastUpdate')) {
    const lastUpdate = new Date();
    document.getElementById('lastUpdate').textContent = 
        `${lastUpdate.getFullYear()}-${(lastUpdate.getMonth()+1).toString().padStart(2, '0')}-${lastUpdate.getDate().toString().padStart(2, '0')}`;
}

// ===== 4. 页面加载后执行 =====
window.addEventListener('load', () => {
    initTheme();
    syncTheme(); // 确保主题同步
});

// 页面切换时也同步主题
window.addEventListener('pageshow', function(event) {
    // 如果是从缓存加载（如后退按钮）
    if (event.persisted) {
        setTimeout(syncTheme, 100);
    }
});

// 控制台欢迎信息
console.log('%c🎉 欢迎访问星天(xtt)的个人介绍页！', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
console.log('%c💡 提示：点击右上角按钮可切换深浅主题。', 'color: #3498db;');
