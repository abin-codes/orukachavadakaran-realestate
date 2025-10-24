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

// ==================== DYNAMIC HOMEPAGE STATS FROM JSON ====================
// DYNAMIC CMS CONTENT UPDATER
fetch('/content/homepage.json')
  .then(res => res.json())
  .then(data => {
    // ===== HEADER / NAVBAR =====
    document.querySelector('[data-cms="home-brand-tagline"]').textContent = data.home_brand_tagline || '';
    document.querySelector('[data-cms="home-nav-link-home"]').textContent = data.home_nav_link_home || '';
    document.querySelector('[data-cms="home-nav-link-properties"]').textContent = data.home_nav_link_properties || '';
    document.querySelector('[data-cms="home-nav-link-blog"]').textContent = data.home_nav_link_blog || '';
    document.querySelector('[data-cms="home-nav-link-about"]').textContent = data.home_nav_link_about || '';
    document.querySelector('[data-cms="home-nav-link-contact"]').textContent = data.home_nav_link_contact || '';

    // ===== HERO SECTION =====
    document.querySelector('[data-cms="home-hero-badge"]').textContent = data.home_hero_badge || '';
    document.querySelector('[data-cms="home-hero-title"]').innerHTML = data.home_hero_title || '';
    document.querySelector('[data-cms="home-hero-desc"]').innerHTML = data.home_hero_desc || '';
    document.querySelector('[data-cms="home-btn-houses"]').textContent = data.home_btn_houses || '';
    document.querySelector('[data-cms="home-btn-plots"]').textContent = data.home_btn_plots || '';

    // ===== HERO STATS =====
    document.getElementById('stat-properties').textContent = (data.home_stat_properties || '') + '+';
    document.querySelector('[data-cms="home-stat-properties-label"]').textContent = data.home_stat_properties_label || '';
    document.getElementById('stat-clients').textContent = (data.home_stat_clients || '') + '+';
    document.querySelector('[data-cms="home-stat-clients-label"]').textContent = data.home_stat_clients_label || '';
    document.getElementById('stat-locations').textContent = data.home_stat_locations || '';
    document.querySelector('[data-cms="home-stat-locations-label"]').textContent = data.home_stat_locations_label || '';

    // ===== RATING BADGE =====
    document.querySelector('[data-cms="home-rating-title"]').textContent = data.home_rating_title || '';
    document.getElementById('stat-rating').textContent = data.home_rating_value || '';
    document.querySelector('[data-cms="home-rating-desc"]').textContent = data.home_rating_desc || '';

    // ===== WHY CHOOSE US =====
    document.querySelector('[data-cms="why-choose-label"]').textContent = data.why_choose_label || '';
    document.querySelector('[data-cms="why-choose-title"]').textContent = data.why_choose_title || '';
    document.querySelector('[data-cms="why-choose-desc"]').textContent = data.why_choose_desc || '';

    // ===== FEATURED PROPERTIES SECTION =====
    document.querySelector('[data-cms="featured-label"]').textContent = data.featured_label || '';
    document.querySelector('[data-cms="featured-title"]').textContent = data.featured_title || '';
    document.querySelector('[data-cms="featured-desc"]').textContent = data.featured_desc || '';

    // Property 1
    document.querySelector('[data-cms="property-1-badge"]').textContent = data.property_1_badge || '';
    document.querySelector('[data-cms="property-1-location"]').innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + (data.property_1_location || '');
    document.querySelector('[data-cms="property-1-title"]').textContent = data.property_1_title || '';
    document.querySelector('[data-cms="property-1-desc"]').textContent = data.property_1_desc || '';
    document.querySelector('[data-cms="property-1-price"]').textContent = data.property_1_price || '';

    // Property 2
    document.querySelector('[data-cms="property-2-badge"]').textContent = data.property_2_badge || '';
    document.querySelector('[data-cms="property-2-location"]').innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + (data.property_2_location || '');
    document.querySelector('[data-cms="property-2-title"]').textContent = data.property_2_title || '';
    document.querySelector('[data-cms="property-2-desc"]').textContent = data.property_2_desc || '';
    document.querySelector('[data-cms="property-2-price"]').textContent = data.property_2_price || '';

    // ===== VIEW ALL PROPERTIES BUTTON =====
    document.querySelector('[data-cms="view-all-btn"]').textContent = data.view_all_btn || '';

    // ===== FOOTER =====
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
    console.error('Failed to dynamically update homepage from CMS:', err);
  });
