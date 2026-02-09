// ===== 游戏详情页脚本 =====

// 游戏数据定义
const gameData = {
    'ai-chat': {
        id: 'ai-chat',
        title: 'AI对话游戏',
        subtitle: '与AI进行智能对话的趣味体验',
        status: '开发中',
        version: 'v0.1.0',
        updateDate: '2024-03-15',
        icon: 'fas fa-robot',
        tags: ['AI对话', '聊天', '互动'],
        description: `
            <p>这是一个基于Kimi AI的对话游戏，你可以与不同个性的AI角色进行有趣的对话。每个角色都有独特的背景故事和对话风格，让聊天变得更加生动有趣。</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>🤖 多个AI角色：每个角色都有独特的性格和背景故事</li>
                <li>💬 智能对话：基于Kimi AI的自然语言处理能力</li>
                <li>🎭 角色扮演：你可以选择不同身份与AI对话</li>
                <li>📚 话题丰富：支持科技、生活、娱乐、学习等多种话题</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 选择一个你感兴趣的AI角色</p>
            <p>2. 开始对话，可以是闲聊或特定话题</p>
            <p>3. 观察AI的回应，体验智能对话的乐趣</p>
            <p>4. 可以切换角色或话题继续对话</p>
        `,
        techInfo: [
            { label: '开发语言', value: 'JavaScript + HTML5' },
            { label: 'AI引擎', value: 'Kimi AI API' },
            { label: '兼容性', value: 'Chrome / Edge / Firefox' },
            { label: '网络需求', value: '需要互联网连接' }
        ],
        changelog: [
            { 
                date: '2024-03-15', 
                version: 'v0.1.0', 
                content: [
                    '实现了基础AI对话功能',
                    '添加了3个预设角色',
                    '优化了用户界面设计'
                ] 
            },
            { 
                date: '2024-03-08', 
                version: 'v0.0.5', 
                content: [
                    '创建对话界面原型',
                    '集成Kimi API测试接口',
                    '添加基础样式'
                ] 
            },
            { 
                date: '2024-03-01', 
                version: 'v0.0.1', 
                content: [
                    '项目初始化',
                    '创建基础页面结构',
                    '设计对话流程'
                ] 
            }
        ]
    },
    'puzzle': {
        id: 'puzzle',
        title: '智能谜题',
        subtitle: '挑战AI生成的逻辑谜题',
        status: '即将推出',
        version: 'v0.0.5',
        updateDate: '2024-03-10',
        icon: 'fas fa-brain',
        tags: ['解谜', '逻辑', 'AI生成'],
        description: `
            <p>这是一个基于AI生成的逻辑谜题游戏，每个谜题都由AI动态生成，确保每次游戏都有新体验。挑战你的逻辑思维能力，看看你能解决多少难题！</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>🧩 动态生成谜题：每次游戏都有全新的谜题</li>
                <li>📊 多种难度：从简单到专家级，适合各种水平玩家</li>
                <li>⏱️ 计时挑战：挑战自己的解题速度</li>
                <li>🏆 成就系统：解锁各种成就奖励</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 选择难度级别</p>
            <p>2. 系统生成新的谜题</p>
            <p>3. 根据提示和规则解决问题</p>
            <p>4. 提交答案，查看解析和评分</p>
        `,
        techInfo: [
            { label: '开发语言', value: 'JavaScript + Python' },
            { label: '谜题生成', value: 'AI算法生成' },
            { label: '兼容性', value: '现代浏览器' },
            { label: '数据存储', value: '本地存储' }
        ],
        changelog: [
            { 
                date: '2024-03-10', 
                version: 'v0.0.5', 
                content: [
                    '新增5个逻辑谜题',
                    '添加了难度选择系统',
                    '修复了移动端显示问题'
                ] 
            },
            { 
                date: '2024-03-03', 
                version: 'v0.0.3', 
                content: [
                    '实现谜题生成算法',
                    '创建谜题展示界面',
                    '添加答案验证系统'
                ] 
            },
            { 
                date: '2024-02-25', 
                version: 'v0.0.1', 
                content: [
                    '项目初始化',
                    '设计谜题数据结构',
                    '创建基础界面'
                ] 
            }
        ]
    },
    'code': {
        id: 'code',
        title: '代码挑战',
        subtitle: '与AI进行编程对决',
        status: '规划中',
        version: 'v0.0.3',
        updateDate: '2024-03-05',
        icon: 'fas fa-code',
        tags: ['编程', '挑战', '学习'],
        description: `
            <p>这是一个编程挑战游戏，你可以与AI进行编程对决，看谁能写出更好的代码。游戏包含多种编程语言和算法挑战，适合编程爱好者提升技能。</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>💻 多语言支持：支持Python、JavaScript、Java等多种语言</li>
                <li>🧠 智能评分：AI自动评估代码质量和效率</li>
                <li>🏅 排行榜：与全球玩家竞争排名</li>
                <li>📈 学习路径：从基础到高级的渐进式挑战</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 选择编程语言和挑战题目</p>
            <p>2. 在规定时间内编写解决方案</p>
            <p>3. 提交代码，AI自动评估</p>
            <p>4. 查看评分、优化建议和排名</p>
        `,
        techInfo: [
            { label: '开发语言', value: 'JavaScript + Node.js' },
            { label: '代码执行', value: '安全沙箱环境' },
            { label: '支持语言', value: 'Python、JS、Java等' },
            { label: '评分系统', value: 'AI智能评估' }
        ],
        changelog: [
            { 
                date: '2024-03-05', 
                version: 'v0.0.3', 
                content: [
                    '支持Python和JavaScript语言',
                    '添加了代码编辑器',
                    '优化了AI评分系统'
                ] 
            },
            { 
                date: '2024-02-26', 
                version: 'v0.0.2', 
                content: [
                    '创建代码执行环境',
                    '设计挑战题目库',
                    '添加基础编辑器'
                ] 
            }
        ]
    },
    'adventure': {
        id: 'adventure',
        title: '文字冒险',
        subtitle: '在AI生成的故事中冒险',
        status: '构思中',
        version: 'v0.0.2',
        updateDate: '2024-02-28',
        icon: 'fas fa-gamepad',
        tags: ['文字冒险', '故事', '选择'],
        description: `
            <p>这是一个AI驱动的文字冒险游戏，每个故事都由AI动态生成，你的选择决定故事走向。体验无限可能的冒险旅程！</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>📖 动态故事：AI生成无限可能的故事线</li>
                <li>🎯 选择影响：每个选择都会改变故事走向</li>
                <li>🎨 角色定制：创建和定制自己的角色</li>
                <li>💾 自动存档：随时保存和加载游戏进度</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 创建你的角色，设定背景故事</p>
            <p>2. 开始冒险，阅读AI生成的故事</p>
            <p>3. 在关键节点做出选择</p>
            <p>4. 体验不同选择和结局</p>
        `,
        techInfo: [
            { label: '开发语言', value: 'JavaScript' },
            { label: '故事生成', value: 'Kimi AI 故事引擎' },
            { label: '数据存储', value: '本地存储 + 云同步' },
            { label: '支持平台', value: 'Web、移动端' }
        ],
        changelog: [
            { 
                date: '2024-02-28', 
                version: 'v0.0.2', 
                content: [
                    '创建了第一个故事框架',
                    '实现了分支选择系统',
                    '添加了自动存档功能'
                ] 
            },
            { 
                date: '2024-02-20', 
                version: 'v0.0.1', 
                content: [
                    '项目概念设计',
                    '创建基础故事结构',
                    '设计用户界面原型'
                ] 
            }
        ]
    },
    'art': {
        id: 'art',
        title: 'AI艺术生成',
        subtitle: '使用AI生成独特艺术品',
        status: '计划中',
        version: 'v0.0.1',
        updateDate: '2024-02-20',
        icon: 'fas fa-palette',
        tags: ['艺术', '生成', '创意'],
        description: `
            <p>这是一个AI艺术生成工具，你可以通过简单的描述生成独特的数字艺术品。探索AI在艺术创作中的无限可能！</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>🎨 文本到图像：通过描述生成艺术作品</li>
                <li>🖌️ 风格转换：应用不同艺术风格</li>
                <li>📱 编辑工具：简单的后期编辑功能</li>
                <li>🖼️ 画廊分享：保存和分享你的作品</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 输入对艺术品的描述（如"星空下的城堡"）</p>
            <p>2. 选择艺术风格（油画、水彩、像素等）</p>
            <p>3. AI生成艺术作品</p>
            <p>4. 微调参数或重新生成</p>
        `,
        techInfo: [
            { label: '核心技术', value: 'Stable Diffusion API' },
            { label: '开发语言', value: 'JavaScript + Python' },
            { label: '图像处理', value: 'Canvas API' },
            { label: '存储', value: '本地存储 + 云存储' }
        ],
        changelog: [
            { 
                date: '2024-02-20', 
                version: 'v0.0.1', 
                content: [
                    '项目立项和规划',
                    '研究AI图像生成API',
                    '设计用户界面原型'
                ] 
            }
        ]
    },
    'music': {
        id: 'music',
        title: 'AI音乐创作',
        subtitle: '与AI合作创作独特旋律',
        status: '构思中',
        version: 'v0.0.1',
        updateDate: '2024-02-15',
        icon: 'fas fa-music',
        tags: ['音乐', '创作', 'AI作曲'],
        description: `
            <p>这是一个AI音乐创作工具，你可以与AI合作创作独特的音乐作品。无论你是音乐新手还是专业人士，都能在这里找到创作灵感！</p>
            
            <h3>游戏特色</h3>
            <ul>
                <li>🎵 智能作曲：AI根据主题生成旋律</li>
                <li>🎹 虚拟乐器：内置多种乐器音色</li>
                <li>🎼 乐谱编辑：可视化乐谱编辑界面</li>
                <li>🎧 实时试听：即时播放创作成果</li>
            </ul>
            
            <h3>玩法说明</h3>
            <p>1. 选择音乐风格（流行、古典、电子等）</p>
            <p>2. 设定基础旋律或让AI生成</p>
            <p>3. 使用虚拟乐器添加和声和节奏</p>
            <p>4. 导出作品或分享到社区</p>
        `,
        techInfo: [
            { label: '音频技术', value: 'Web Audio API' },
            { label: 'AI作曲', value: '音乐生成算法' },
            { label: '开发语言', value: 'JavaScript' },
            { label: '音频格式', value: 'MP3、WAV、MIDI' }
        ],
        changelog: [
            { 
                date: '2024-02-15', 
                version: 'v0.0.1', 
                content: [
                    '项目概念设计',
                    '研究音乐生成算法',
                    '创建基础界面原型'
                ] 
            }
        ]
    }
};

// 获取URL中的游戏ID
function getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    console.log('从URL获取的游戏ID:', gameId);
    
    // 如果URL中没有game参数，或者gameId不在gameData中，则重定向到Kimi页面
    if (!gameId || !gameData[gameId]) {
        console.error('无效的游戏ID:', gameId, '，重定向到Kimi页面');
        alert('游戏不存在，正在返回游戏列表...');
        setTimeout(() => {
            window.location.href = 'kimi.html';
        }, 1500);
        return null;
    }
    
    return gameId;
}

// ===== 游戏详情页主题同步 =====
function initGameDetailTheme() {
    console.log('游戏详情页: 初始化主题');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 如果没有保存的主题，使用系统偏好
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    console.log('游戏详情页主题状态:', {
        savedTheme,
        systemPrefersDark,
        currentTheme
    });
    
    // 应用主题
    if (currentTheme === 'light') {
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
    
    console.log('游戏详情页: 主题已同步为', currentTheme);
}

// 更新页面内容
function updatePageContent(gameId) {
    if (!gameId) return;
    
    const game = gameData[gameId];
    if (!game) {
        console.error('游戏数据不存在:', gameId);
        window.location.href = 'kimi.html';
        return;
    }
    
    console.log('加载游戏数据:', game.title);
    
    // 更新页面标题
    document.title = `${game.title} - 星天(xtt) Kimi发现页`;
    
    // 更新游戏标题
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-subtitle').textContent = game.subtitle;
    document.getElementById('game-status').textContent = game.status;
    document.getElementById('game-version').textContent = game.version;
    document.getElementById('game-update-date').textContent = `最后更新: ${game.updateDate}`;
    
    // 更新游戏图标
    document.getElementById('game-icon').className = `${game.icon} fa-4x`;
    
    // 更新游戏标签
    const tagsContainer = document.getElementById('game-tags');
    tagsContainer.innerHTML = '';
    game.标签.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'game-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新游戏描述
    document.getElementById('game-description').innerHTML = game.description;
    
    // 更新技术信息
    updateTechInfo(game.techInfo);
    
    // 生成更新日志
    generateChangelog(game.changelog, game.title);
    
    // 更新链接
    updateGameLinks(game);
    
    // 更新页面年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// 更新技术信息
function updateTechInfo(techInfo) {
    const container = document.getElementById('tech-info-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    techInfo.forEach(info => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `
            <span class="tech-label">${info.label}：</span>
            <span class="tech-value">${info.value}</span>
        `;
        container.appendChild(techItem);
    });
}

// 生成更新日志
function generateChangelog(changelog, gameTitle) {
    const container = document.getElementById('game-changelog');
    if (!container) return;
    
    container.innerHTML = '';
    
    changelog.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'changelog-item';
        
        logItem.innerHTML = `
            <div class="changelog-date">${log.date}</div>
            <div class="changelog-content">
                <h3>${gameTitle} ${log.version}</h3>
                ${log.content.map(item => `<p>• ${item}</p>`).join('')}
            </div>
        `;
        
        container.appendChild(logItem);
    });
}

// 更新游戏链接
function updateGameLinks(game) {
    const playButton = document.getElementById('game-play-link');
    const sourceButton = document.getElementById('game-source-link');
    
    if (!playButton || !sourceButton) return;
    
    // 根据游戏状态设置按钮
    if (game.status === '开发中') {
        playButton.textContent = ' 体验Demo';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在开发中，即将推出Demo版本！`);
        };
    } else if (game.status === '即将推出') {
        playButton.textContent = ' 即将推出';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}即将推出，敬请期待！`);
        };
    } else if (game.status === '规划中' || game.status === '计划中' || game.status === '构思中') {
        playButton.textContent = ' 尚未可用';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在规划中，未来会与大家见面！`);
        };
    } else {
        playButton.textContent = ' 开始游戏';
        playButton.href = `games/${game.id}/index.html`;
    }
    
    // 源码链接
    sourceButton.href = `https://github.com/xtt-xt/kimi-games/tree/main/${game.id}`;
    sourceButton.target = '_blank';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 游戏详情页已加载', 'color: #3498db; font-size: 16px; font-weight: bold;');
    
    // 初始化主题（优先执行）
    initGameDetailTheme();
    
    const gameId = getGameIdFromUrl();
    if (gameId) {
        updatePageContent(gameId);
    }
});

// 监听storage事件，确保主题变化时同步
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        console.log('游戏详情页: 检测到主题变化，重新同步');
        initGameDetailTheme();
    }
});
}

// 更新页面内容
function updatePageContent(gameId) {
    if (!gameId) return;
    
    const game = gameData[gameId];
    if (!game) {
        console.error('游戏数据不存在:', gameId);
        window.location.href = 'kimi.html';
        return;
    }
    
    console.log('加载游戏数据:', game.title);
    
    // 更新页面标题
    document.title = `${game.title} - 星天(xtt) Kimi发现页`;
    
    // 更新游戏标题
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-subtitle').textContent = game.subtitle;
    document.getElementById('game-status').textContent = game.status;
    document.getElementById('game-version').textContent = game.version;
    document.getElementById('game-update-date').textContent = `最后更新: ${game.updateDate}`;
    
    // 更新游戏图标
    document.getElementById('game-icon').className = `${game.icon} fa-4x`;
    
    // 更新游戏标签
    const tagsContainer = document.getElementById('game-tags');
    tagsContainer.innerHTML = '';
    game.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'game-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新游戏描述
    document.getElementById('game-description').innerHTML = game.description;
    
    // 更新技术信息
    updateTechInfo(game.techInfo);
    
    // 生成更新日志
    generateChangelog(game.changelog, game.title);
    
    // 更新链接
    updateGameLinks(game);
    
    // 更新页面年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// 更新技术信息
function updateTechInfo(techInfo) {
    const container = document.getElementById('tech-info-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    techInfo.forEach(info => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `
            <span class="tech-label">${info.label}：</span>
            <span class="tech-value">${info.value}</span>
        `;
        container.appendChild(techItem);
    });
}

// 生成更新日志
function generateChangelog(changelog, gameTitle) {
    const container = document.getElementById('game-changelog');
    if (!container) return;
    
    container.innerHTML = '';
    
    changelog.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'changelog-item';
        
        logItem.innerHTML = `
            <div class="changelog-date">${log.date}</div>
            <div class="changelog-content">
                <h3>${gameTitle} ${log.version}</h3>
                ${log.content.map(item => `<p>• ${item}</p>`).join('')}
            </div>
        `;
        
        container.appendChild(logItem);
    });
}

// 更新游戏链接
function updateGameLinks(game) {
    const playButton = document.getElementById('game-play-link');
    const sourceButton = document.getElementById('game-source-link');
    
    if (!playButton || !sourceButton) return;
    
    // 根据游戏状态设置按钮
    if (game.status === '开发中') {
        playButton.textContent = ' 体验Demo';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在开发中，即将推出Demo版本！`);
        };
    } else if (game.status === '即将推出') {
        playButton.textContent = ' 即将推出';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}即将推出，敬请期待！`);
        };
    } else if (game.status === '规划中' || game.status === '计划中' || game.status === '构思中') {
        playButton.textContent = ' 尚未可用';
        playButton.href = '#';
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在规划中，未来会与大家见面！`);
        };
    } else {
        playButton.textContent = ' 开始游戏';
        playButton.href = `games/${game.id}/index.html`;
    }
    
    // 源码链接
    sourceButton.href = `https://github.com/xtt-xt/kimi-games/tree/main/${game.id}`;
    sourceButton.target = '_blank';
}

// ===== 游戏详情页主题同步 =====
function initGameDetailTheme() {
    console.log('游戏详情页: 初始化主题');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 如果没有保存的主题，使用系统偏好
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    console.log('游戏详情页主题状态:', {
        savedTheme,
        systemPrefersDark,
        currentTheme
    });
    
    // 应用主题
    if (currentTheme === 'light') {
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
    
    console.log('游戏详情页: 主题已同步为', currentTheme);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 游戏详情页已加载', 'color: #3498db; font-size: 16px; font-weight: bold;');
    
    // 初始化主题（优先执行）
    initGameDetailTheme();
    
    const gameId = getGameIdFromUrl();
    if (gameId) {
        updatePageContent(gameId);
    }
});

// 监听storage事件，确保主题变化时同步
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        console.log('游戏详情页: 检测到主题变化，重新同步');
        initGameDetailTheme();
    }
});   
    console.log('游戏详情页主题状态:', {
        savedTheme,
        systemPrefersDark,
        currentTheme
    });
    
    // 应用主题
    if (currentTheme === 'light') {
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
    
    console.log('游戏详情页: 主题已同步为', currentTheme);
}

// 更新页面内容
function updatePageContent(gameId) {
    const game = gameData[gameId];
    if (!game) {
        // 如果游戏不存在，跳转回Kimi页面
        window.location.href = 'kimi.html';
        return;
    }
    
    // 更新页面标题
    document.title = `${game.title} - 星天(xtt) Kimi发现页`;
    
    // 更新游戏标题
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-subtitle').textContent = game.subtitle;
    document.getElementById('game-status').textContent = game.status;
    document.getElementById('game-version').textContent = game.version;
    document.getElementById('game-update-date').textContent = `最后更新: ${game.updateDate}`;
    
    // 更新游戏图标
    document.getElementById('game-icon').className = `${game.icon} fa-4x`;
    
    // 更新游戏标签
    const tagsContainer = document.getElementById('game-tags');
    tagsContainer.innerHTML = '';
    game.标签.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'game-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新游戏描述
    document.getElementById('game-description').innerHTML = game.description;
    
    // 更新技术信息
    updateTechInfo(game.techInfo);
    
    // 生成更新日志
    generateChangelog(game.changelog, game.title);
    
    // 更新链接
    updateGameLinks(game);
    
    // 更新页面年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// 更新技术信息
function updateTechInfo(techInfo) {
    const container = document.getElementById('tech-info-list');
    container.innerHTML = '';
    
    techInfo.forEach(info => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `
            <span class="tech-label">${info.label}：</span>
            <span class="tech-value">${info.value}</span>
        `;
        container.appendChild(techItem);
    });
}

// 生成更新日志
function generateChangelog(changelog, gameTitle) {
    const container = document.getElementById('game-changelog');
    container.innerHTML = '';
    
    changelog.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'changelog-item';
        
        logItem.innerHTML = `
            <div class="changelog-date">${log.date}</div>
            <div class="changelog-content">
                <h3>${gameTitle} ${log.version}</h3>
                ${log.content.map(item => `<p>• ${item}</p>`).join('')}
            </div>
        `;
        
        container.appendChild(logItem);
    });
}

// 更新游戏链接
function updateGameLinks(game) {
    const playButton = document.getElementById('game-play-link');
    const sourceButton = document.getElementById('game-source-link');
    
    // 根据游戏状态设置按钮
    if (game.status === '开发中') {
        playButton.textContent = ' 体验Demo';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在开发中，即将推出Demo版本！`);
        };
    } else if (game.status === '即将推出') {
        playButton.textContent = ' 即将推出';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}即将推出，敬请期待！`);
        };
    } else if (game.status === '规划中' || game.status === '计划中' || game.status === '构思中') {
        playButton.textContent = ' 尚未可用';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在规划中，未来会与大家见面！`);
        };
    } else {
        playButton.textContent = ' 开始游戏';
        playButton.href = `games/${game.id}/index.html`;
    }
    
    // 源码链接
    sourceButton.href = `https://github.com/xtt-xt/kimi-games/tree/main/${game.id}`;
    sourceButton.target = '_blank';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 游戏详情页已加载', 'color: #3498db; font-size: 16px; font-weight: bold;');
    
    // 初始化主题（优先执行）
    initGameDetailTheme();
    
    const gameId = getGameIdFromUrl();
    updatePageContent(gameId);
    
    console.log(`加载游戏: ${gameData[gameId].title}`);
});

// 监听storage事件，确保主题变化时同步
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        console.log('游戏详情页: 检测到主题变化，重新同步');
        initGameDetailTheme();
    }
});.getElementById('game-subtitle').textContent = game.subtitle;
    document.getElementById('game-status').textContent = game.status;
    document.getElementById('game-version').textContent = game.version;
    document.getElementById('game-update-date').textContent = `最后更新: ${game.updateDate}`;
    
    // 更新游戏图标
    document.getElementById('game-icon').className = `${game.icon} fa-4x`;
    
    // 更新游戏标签
    const tagsContainer = document.getElementById('game-tags');
    tagsContainer.innerHTML = '';
    game.标签.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'game-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新游戏描述
    document.getElementById('game-description').innerHTML = game.description;
    
    // 更新技术信息
    updateTechInfo(game.techInfo);
    
    // 生成更新日志
    generateChangelog(game.changelog, game.title);
    
    // 更新链接
    updateGameLinks(game);
    
    // 更新页面年份
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// 更新技术信息
function updateTechInfo(techInfo) {
    const container = document.getElementById('tech-info-list');
    container.innerHTML = '';
    
    techInfo.forEach(info => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `
            <span class="tech-label">${info.label}：</span>
            <span class="tech-value">${info.value}</span>
        `;
        container.appendChild(techItem);
    });
}

// 生成更新日志
function generateChangelog(changelog, gameTitle) {
    const container = document.getElementById('game-changelog');
    container.innerHTML = '';
    
    changelog.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'changelog-item';
        
        logItem.innerHTML = `
            <div class="changelog-date">${log.date}</div>
            <div class="changelog-content">
                <h3>${gameTitle} ${log.version}</h3>
                ${log.content.map(item => `<p>• ${item}</p>`).join('')}
            </div>
        `;
        
        container.appendChild(logItem);
    });
}

// 更新游戏链接
function updateGameLinks(game) {
    const playButton = document.getElementById('game-play-link');
    const sourceButton = document.getElementById('game-source-link');
    
    // 根据游戏状态设置按钮
    if (game.status === '开发中') {
        playButton.textContent = ' 体验Demo';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在开发中，即将推出Demo版本！`);
        };
    } else if (game.status === '即将推出') {
        playButton.textContent = ' 即将推出';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}即将推出，敬请期待！`);
        };
    } else if (game.status === '规划中' || game.status === '计划中' || game.status === '构思中') {
        playButton.textContent = ' 尚未可用';
        playButton.href = `#`;
        playButton.onclick = function(e) {
            e.preventDefault();
            alert(`${game.title}正在规划中，未来会与大家见面！`);
        };
    } else {
        playButton.textContent = ' 开始游戏';
        playButton.href = `games/${game.id}/index.html`;
    }
    
    // 源码链接
    sourceButton.href = `https://github.com/xtt-xt/kimi-games/tree/main/${game.id}`;
    sourceButton.target = '_blank';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎮 游戏详情页已加载', 'color: #3498db; font-size: 16px; font-weight: bold;');
    
    const gameId = getGameIdFromUrl();
    updatePageContent(gameId);
    
    console.log(`加载游戏: ${gameData[gameId].title}`);
});
