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


// ==================== DYNAMIC CMS CONTENT UPDATER FOR ABOUT PAGE ====================
fetch('/content/aboutpage.json')
  .then(res => res.json())
  .then(data => {
    // HEADER / NAVBAR
    document.querySelector('[data-cms="about-brand-tagline"]').textContent = data.about_brand_tagline || '';
    document.querySelector('[data-cms="about-nav-link-home"]').textContent = data.about_nav_link_home || '';
    document.querySelector('[data-cms="about-nav-link-properties"]').textContent = data.about_nav_link_properties || '';
    document.querySelector('[data-cms="about-nav-link-blog"]').textContent = data.about_nav_link_blog || '';
    document.querySelector('[data-cms="about-nav-link-about"]').textContent = data.about_nav_link_about || '';
    document.querySelector('[data-cms="about-nav-link-contact"]').textContent = data.about_nav_link_contact || '';
    var aboutLogoImg = document.querySelector('[data-cms="about-brand-logo"] img');
    if (aboutLogoImg && data.about_brand_logo) aboutLogoImg.src = data.about_brand_logo;

    // HERO SECTION
    document.querySelector('[data-cms="about-hero-label"]').textContent = data.about_hero_label || '';
    document.querySelector('[data-cms="about-hero-title"]').textContent = data.about_hero_title || '';
    document.querySelector('[data-cms="about-hero-desc"]').textContent = data.about_hero_desc || '';

    // HERO STATS
    document.querySelector('[data-cms="about-stat-1-number"]').textContent = data.about_stat_1_number || '';
    document.querySelector('[data-cms="about-stat-1-label"]').textContent = data.about_stat_1_label || '';
    document.querySelector('[data-cms="about-stat-2-number"]').textContent = data.about_stat_2_number || '';
    document.querySelector('[data-cms="about-stat-2-label"]').textContent = data.about_stat_2_label || '';
    document.querySelector('[data-cms="about-stat-3-number"]').textContent = data.about_stat_3_number || '';
    document.querySelector('[data-cms="about-stat-3-label"]').textContent = data.about_stat_3_label || '';
    document.querySelector('[data-cms="about-stat-4-number"]').textContent = data.about_stat_4_number || '';
    document.querySelector('[data-cms="about-stat-4-label"]').textContent = data.about_stat_4_label || '';

    // OUR JOURNEY SECTION
    var journeyImage = document.querySelector('[data-cms="about-journey-image"]');
    if (journeyImage && data.about_journey_image) journeyImage.src = data.about_journey_image;
    document.querySelector('[data-cms="about-satisfaction-number"]').textContent = data.about_satisfaction_number || '';
    document.querySelector('[data-cms="about-satisfaction-label"]').textContent = data.about_satisfaction_label || '';
    document.querySelector('[data-cms="about-journey-label"]').textContent = data.about_journey_label || '';
    document.querySelector('[data-cms="about-journey-title"]').textContent = data.about_journey_title || '';
    document.querySelector('[data-cms="about-journey-text"]').innerHTML = marked.parse(data.about_journey_text || '');
    document.querySelector('[data-cms="about-work-btn"]').textContent = data.about_work_btn || '';

    // TEAM SECTION
    document.querySelector('[data-cms="about-team-label"]').textContent = data.about_team_label || '';
    document.querySelector('[data-cms="about-team-title"]').textContent = data.about_team_title || '';
    document.querySelector('[data-cms="about-team-desc"]').textContent = data.about_team_desc || '';

    // Team member 1
    var team1img = document.querySelector('[data-cms="team-1-image"]');
    if (team1img && data.team_1_image) team1img.src = data.team_1_image;
    document.querySelector('[data-cms="team-1-name"]').textContent = data.team_1_name || '';
    document.querySelector('[data-cms="team-1-role"]').textContent = data.team_1_role || '';

    // Team member 2
    var team2img = document.querySelector('[data-cms="team-2-image"]');
    if (team2img && data.team_2_image) team2img.src = data.team_2_image;
    document.querySelector('[data-cms="team-2-name"]').textContent = data.team_2_name || '';
    document.querySelector('[data-cms="team-2-role"]').textContent = data.team_2_role || '';

    // Team member 3
    var team3img = document.querySelector('[data-cms="team-3-image"]');
    if (team3img && data.team_3_image) team3img.src = data.team_3_image;
    document.querySelector('[data-cms="team-3-name"]').textContent = data.team_3_name || '';
    document.querySelector('[data-cms="team-3-role"]').textContent = data.team_3_role || '';

    // CORE VALUES SECTION
    document.querySelector('[data-cms="about-values-label"]').textContent = data.about_values_label || '';
    document.querySelector('[data-cms="about-values-title"]').textContent = data.about_values_title || '';
    document.querySelector('[data-cms="about-values-desc"]').textContent = data.about_values_desc || '';
    document.querySelector('[data-cms="value-1-title"]').textContent = data.value_1_title || '';
    document.querySelector('[data-cms="value-1-desc"]').textContent = data.value_1_desc || '';
    document.querySelector('[data-cms="value-2-title"]').textContent = data.value_2_title || '';
    document.querySelector('[data-cms="value-2-desc"]').textContent = data.value_2_desc || '';
    document.querySelector('[data-cms="value-3-title"]').textContent = data.value_3_title || '';
    document.querySelector('[data-cms="value-3-desc"]').textContent = data.value_3_desc || '';
    document.querySelector('[data-cms="value-4-title"]').textContent = data.value_4_title || '';
    document.querySelector('[data-cms="value-4-desc"]').textContent = data.value_4_desc || '';

    // CTA SECTION
    document.querySelector('[data-cms="about-cta-title"]').textContent = data.about_cta_title || '';
    document.querySelector('[data-cms="about-cta-desc"]').textContent = data.about_cta_desc || '';
    document.querySelector('[data-cms="about-cta-contact"]').textContent = data.about_cta_contact || '';
    document.querySelector('[data-cms="about-cta-properties"]').textContent = data.about_cta_properties || '';

    // FOOTER
    document.querySelector('[data-cms="footer-logo"]').textContent = data.footer_logo || '';
    document.querySelector('[data-cms="footer-desc"]').textContent = data.footer_desc || '';
    document.querySelector('[data-cms="footer-social-label"]').textContent = data.footer_social_label || '';
    document.querySelector('[data-cms="footer-facebook"]').href = data.footer_facebook || '#';
    document.querySelector('[data-cms="footer-instagram"]').href = data.footer_instagram || '#';
    document.querySelector('[data-cms="footer-whatsapp"]').href = data.footer_whatsapp || '#';
    document.querySelector('[data-cms="footer-links-heading"]').textContent = data.footer_links_heading || '';
    document.querySelector('[data-cms="footer-link-home"]').textContent = data.footer_link_home || '';
    document.querySelector('[data-cms="footer-link-properties"]').textContent = data.footer_link_properties || '';
    document.querySelector('[data-cms="footer-link-blog"]').textContent = data.footer_link_blog || '';
    document.querySelector('[data-cms="footer-link-about"]').textContent = data.footer_link_about || '';
    document.querySelector('[data-cms="footer-link-contact"]').textContent = data.footer_link_contact || '';
    document.querySelector('[data-cms="footer-serve-heading"]').textContent = data.footer_serve_heading || '';
    document.querySelector('[data-cms="footer-location-1"]').textContent = data.footer_location_1 || '';
    document.querySelector('[data-cms="footer-location-2"]').textContent = data.footer_location_2 || '';
    document.querySelector('[data-cms="footer-location-3"]').textContent = data.footer_location_3 || '';
    document.querySelector('[data-cms="footer-contact-heading"]').textContent = data.footer_contact_heading || '';
    document.querySelector('[data-cms="footer-address"]').textContent = data.footer_address || '';
    document.querySelector('[data-cms="footer-phone"]').innerHTML = data.footer_phone || '';
    document.querySelector('[data-cms="footer-email"]').innerHTML = data.footer_email || '';
    document.querySelector('[data-cms="footer-copyright"]').innerHTML = data.footer_copyright || '';
    document.querySelector('[data-cms="footer-privacy"]').textContent = data.footer_privacy || '';
    document.querySelector('[data-cms="footer-terms"]').textContent = data.footer_terms || '';
  })
  .catch(err => {
    console.error('Failed to dynamically update about page from CMS:', err);
  });