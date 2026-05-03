// 粒子背景动画
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.reset();
        if (this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(100, window.innerWidth / 10);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 120)})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

// 打字机效果
const typingText = document.getElementById('typingText');
const phrases = ['全栈开发者', '开源爱好者', 'UI/UX设计师', '终身学习者'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 120;
    }
    if (!isDeleting && charIndex === current.length) {
        typeSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}

// 主题切换
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// 移动端菜单
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 技能进度条动画 (Intersection Observer)
const skillFills = document.querySelectorAll('.skill-bar-fill');
const skillPercents = document.querySelectorAll('.skill-percent');
const observerOptions = { threshold: 0.5 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const width = target.dataset.width;
            if (width) {
                target.style.width = width;
                const percentEl = target.parentElement.previousElementSibling.querySelector('.skill-percent');
                if (percentEl) {
                    const targetPercent = percentEl.dataset.target;
                    animateValue(percentEl, 0, targetPercent, 1500);
                }
            }
            observer.unobserve(target);
        }
    });
}, observerOptions);

skillFills.forEach(fill => observer.observe(fill));

function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.textContent = Math.floor(progress * (end - start) + start) + '%';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 联系表单提交
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('感谢您的消息！我会尽快回复。');
    contactForm.reset();
});

// 初始化
window.addEventListener('load', () => {
    resizeCanvas();
    initParticles();
    animateParticles();
    type();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
