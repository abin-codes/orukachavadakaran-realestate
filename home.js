// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('home-nav-toggle');
const navMenu = document.getElementById('home-nav-menu');
const navLinks = document.querySelectorAll('.home-nav-link');

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
const header = document.getElementById('home-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add 'scrolled' class when user scrolls down more than 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== CTA BUTTONS ====================
const exploreHousesBtn = document.getElementById('home-explore-houses-btn');
const viewPlotsBtn = document.getElementById('home-view-plots-btn');
const viewAllBtn = document.getElementById('home-view-all-btn');

if (exploreHousesBtn) {
    exploreHousesBtn.addEventListener('click', () => {
        window.location.href = 'property.html';
    });
}

if (viewPlotsBtn) {
    viewPlotsBtn.addEventListener('click', () => {
        window.location.href = 'property.html';
    });
}

if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        window.location.href = 'property.html';
    });
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate feature cards
const featureCards = document.querySelectorAll('.home-feature-card');
featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate property cards
const propertyCards = document.querySelectorAll('.home-property-card');
propertyCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    observer.observe(card);
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    // Fade in hero content
    const heroContent = document.querySelector('.home-hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 100);
    }

    // Fade in rating badge
    const ratingBadge = document.querySelector('.home-rating-badge');
    if (ratingBadge) {
        ratingBadge.style.opacity = '0';
        ratingBadge.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            ratingBadge.style.transition = 'all 1s ease';
            ratingBadge.style.opacity = '1';
            ratingBadge.style.transform = 'translateX(0)';
        }, 600);
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
console.log('%c🏠 Kerala Real Estate Website Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%cFind your perfect home in Kerala 🌴', 'color: #C8B8A8; font-size: 12px;');
