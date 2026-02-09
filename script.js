// ===== 1. 主题切换功能 =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// 点击切换主题
themeToggle.addEventListener('click', toggleTheme);

// 支持键盘Enter键切换
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') toggleTheme();
});

// ===== 2. 基本信息设置 =====
document.getElementById('currentYear').textContent = new Date().getFullYear();
const lastUpdate = new Date();
document.getElementById('lastUpdate').textContent = 
    `${lastUpdate.getFullYear()}-${(lastUpdate.getMonth()+1).toString().padStart(2, '0')}-${lastUpdate.getDate().toString().padStart(2, '0')}`;

// ===== 3. 页面加载后执行 =====
window.addEventListener('load', () => {
    initTheme();
});

// 控制台欢迎信息
console.log('%c🎉 欢迎访问星天(xtt)的个人介绍页！', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
console.log('%c💡 提示：点击右上角按钮可切换深浅主题。', 'color: #3498db;');
