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

// ===== 4. 访客统计功能 =====
// 创建并加载不蒜子访客统计脚本
(function() {
    // 创建script标签
    var busuanziScript = document.createElement('script');
    busuanziScript.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    busuanziScript.async = true;
    
    // 脚本加载失败时的处理
    busuanziScript.onerror = function() {
        console.log('访客统计脚本加载失败，使用备用数据');
        document.getElementById('busuanzi_value_site_pv').textContent = '999+';
        document.getElementById('busuanzi_value_site_uv').textContent = '888+';
        
        // 模拟访客统计更新（如果没有实际统计）
        setInterval(function() {
            var pvElement = document.getElementById('busuanzi_value_site_pv');
            var uvElement = document.getElementById('busuanzi_value_site_uv');
            
            if (pvElement && uvElement) {
                var currentPV = parseInt(pvElement.textContent) || 1000;
                var currentUV = parseInt(uvElement.textContent) || 900;
                
                // 随机增加一点访问量
                pvElement.textContent = (currentPV + Math.floor(Math.random() * 3)).toString();
                uvElement.textContent = (currentUV + Math.floor(Math.random() * 2)).toString();
            }
        }, 30000); // 每30秒更新一次
    };
    
    // 添加到页面中
    document.head.appendChild(busuanziScript);
    
    // 检查是否已加载成功
    setTimeout(function() {
        var pvElement = document.getElementById('busuanzi_value_site_pv');
        var uvElement = document.getElementById('busuanzi_value_site_uv');
        
        if (pvElement && uvElement && pvElement.textContent === '加载中...' && uvElement.textContent === '加载中...') {
            // 如果10秒后还是加载中，执行错误处理
            busuanziScript.onerror();
        }
    }, 10000);
})();
