// script.js - Telegram bot bilan

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== TELEGRAM BOT MA'LUMOTLARI =====
    const BOT_TOKEN = '8507851517:AAF7U3esfIZUx7thXrbvU0HgW70GJWkrDc0'; // O'Z TOKENINGIZNI YOZING
    const CHAT_ID = '6903859311'; // O'Z CHAT IDINGIZNI YOZING
    
    // ===== TIL MENYUSI =====
    const langBtns = document.querySelectorAll('.lang-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroTitle = document.querySelector('.slide-text-inner');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const primaryBtn = document.querySelector('.btn-primary');
    const outlineBtn = document.querySelector('.btn-outline');
    
    const translations = {
        uz: {
            home: 'Bosh sahifa',
            portfolio: 'Portfolio',
            services: 'Xizmatlar',
            about: 'Men haqimda',
            contact: 'Bog‘lanish',
            heroTitle: 'KH Pro',
            heroSubtitle: 'Sizning hikoyangizni video orqali jonlantiramiz',
            primaryBtn: 'Portfolioni ko‘rish',
            outlineBtn: 'Bog‘lanish'
        },
        ru: {
            home: 'Главная',
            portfolio: 'Портфолио',
            services: 'Услуги',
            about: 'Обо мне',
            contact: 'Контакты',
            heroTitle: 'KH Pro',
            heroSubtitle: 'Оживим вашу историю через видео',
            primaryBtn: 'Смотреть портфолио',
            outlineBtn: 'Связаться'
        },
        en: {
            home: 'Home',
            portfolio: 'Portfolio',
            services: 'Services',
            about: 'About',
            contact: 'Contact',
            heroTitle: 'KH Pro',
            heroSubtitle: 'Bring your story to life through video',
            primaryBtn: 'View Portfolio',
            outlineBtn: 'Contact'
        }
    };
    
    function changeLanguage(lang) {
        const t = translations[lang];
        if (document.querySelectorAll('.nav-link')[0]) document.querySelectorAll('.nav-link')[0].textContent = t.home;
        if (document.querySelectorAll('.nav-link')[1]) document.querySelectorAll('.nav-link')[1].textContent = t.portfolio;
        if (document.querySelectorAll('.nav-link')[2]) document.querySelectorAll('.nav-link')[2].textContent = t.services;
        if (document.querySelectorAll('.nav-link')[3]) document.querySelectorAll('.nav-link')[3].textContent = t.about;
        if (document.querySelectorAll('.nav-link')[4]) document.querySelectorAll('.nav-link')[4].textContent = t.contact;
        
        if (heroTitle) {
            heroTitle.textContent = t.heroTitle;
            heroTitle.setAttribute('data-text', t.heroTitle);
        }
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
        if (primaryBtn) primaryBtn.textContent = t.primaryBtn;
        if (outlineBtn) outlineBtn.textContent = t.outlineBtn;
    }
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            changeLanguage(this.getAttribute('data-lang'));
        });
    });
    
    // ===== MOBIL MENU =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
    
    // ===== SCROLL ANIMATION =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.portfolio-item, .service-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // ===== VIDEO PLAYER =====
    const playBtns = document.querySelectorAll('.play-btn');
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const video = this.closest('.portfolio-media').querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
        });
    });
    
    // Hover video
    document.querySelectorAll('.portfolio-media video').forEach(video => {
        video.addEventListener('mouseenter', function() { this.play(); });
        video.addEventListener('mouseleave', function() { 
            this.pause(); 
            this.currentTime = 0;
        });
    });
    
    // ===== SERVICE BUTTONS =====
    const serviceBtns = document.querySelectorAll('.service-btn');
    
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.service-card');
            const service = card.querySelector('h3').textContent;
            const price = card.querySelector('.service-price').textContent;
            
            // Telegramga xabar yuborish (buyurtma)
            const xabar = `🛍 Yangi buyurtma:\nXizmat: ${service}\nNarx: ${price}`;
            
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: xabar,
                    parse_mode: 'HTML'
                })
            }).catch(err => console.log('Telegram xatosi:', err));
            
            alert(`Siz ${service} - ${price} xizmatini tanladingiz!`);
        });
    });
    
    // ===== CONTACT FORM - TELEGRAM BOT =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Form ma'lumotlarini olish
            const ism = this.querySelector('input[placeholder="Ismingiz"]')?.value || 'Noma\'lum';
            const email = this.querySelector('input[placeholder="Email"]')?.value || 'Noma\'lum';
            const telefon = this.querySelector('input[placeholder="Telefon"]')?.value || 'Noma\'lum';
            const xabar = this.querySelector('textarea')?.value || 'Noma\'lum';
            
            // Telegram uchun xabar tayyorlash
            const telegramXabar = `
📩 <b>YANGI XABAR KELDI!</b>

👤 <b>Ism:</b> ${ism}
📧 <b>Email:</b> ${email}
📞 <b>Telefon:</b> ${telefon}
💬 <b>Xabar:</b> ${xabar}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
            `;
            
            try {
                // Telegramga yuborish
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: telegramXabar,
                        parse_mode: 'HTML'
                    })
                });
                
                const result = await response.json();
                
                if (result.ok) {
                    // Muvaffaqiyatli yuborildi
                    alert('✅ Xabaringiz yuborildi! Tez orada siz bilan bog\'lanamiz.');
                    this.reset();
                    
                    // Qo'shimcha: foydalanuvchiga ham xabar (agar email bo'lsa)
                    console.log('Xabar yuborildi Telegramga');
                } else {
                    alert('❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
                    console.error('Telegram xatosi:', result);
                }
                
            } catch (error) {
                alert('❌ Internet aloqasini tekshiring. Xabar yuborilmadi.');
                console.error('Xatolik:', error);
            }
        });
    }
    
    // ===== ACTIVE LINK ON SCROLL =====
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ===== STICKER ANIMATION =====
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(sticker => {
        const delay = Math.random() * 10;
        const size = 40 + Math.random() * 40;
        sticker.style.animationDelay = `${delay}s`;
        sticker.style.width = `${size}px`;
        sticker.style.height = `${size}px`;
        sticker.style.fontSize = `${size * 0.5}px`;
    });
    
    // Parallax effekt
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        stickers.forEach(sticker => {
            const speed = 0.03;
            const x = mouseX * 30 * speed;
            const y = mouseY * 30 * speed;
            sticker.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
});