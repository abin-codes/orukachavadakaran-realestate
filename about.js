// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('about-nav-toggle');
const navMenu = document.getElementById('about-nav-menu');
const navLinks = document.querySelectorAll('.about-nav-link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.getElementById('about-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add 'scrolled' class when user scrolls down more than 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== ANIMATED COUNTER FOR STATS ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            
            // Animate stats if it's a stat card
            if (entry.target.classList.contains('about-stat-card')) {
                const numberElement = entry.target.querySelector('.about-stat-number');
                const targetNumber = parseInt(numberElement.textContent);
                animateCounter(numberElement, targetNumber);
            }
            
            // Fade in animation
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ==================== PAGE LOAD ANIMATIONS ====================
window.addEventListener('load', () => {
    // Animate stat cards
    const statCards = document.querySelectorAll('.about-stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Animate team cards
    const teamCards = document.querySelectorAll('.about-team-card');
    teamCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate value cards
    const valueCards = document.querySelectorAll('.about-value-card');
    valueCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate journey content
    const journeyContent = document.querySelector('.about-journey-content');
    if (journeyContent) {
        journeyContent.style.opacity = '0';
        journeyContent.style.transform = 'translateX(-30px)';
        journeyContent.style.transition = 'opacity 1s ease 0.3s, transform 1s ease 0.3s';
        observer.observe(journeyContent);
    }

    // Animate journey image
    const journeyImage = document.querySelector('.about-journey-image-wrapper');
    if (journeyImage) {
        journeyImage.style.opacity = '0';
        journeyImage.style.transform = 'translateX(30px)';
        journeyImage.style.transition = 'opacity 1s ease 0.3s, transform 1s ease 0.3s';
        observer.observe(journeyImage);
    }
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c👥 About Us Page Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%cLearn more about our journey', 'color: #C8B8A8; font-size: 12px;');
