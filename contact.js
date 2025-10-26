// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('contact-nav-toggle');
const navMenu = document.getElementById('contact-nav-menu');
const navLinks = document.querySelectorAll('.contact-nav-link');

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
const header = document.getElementById('contact-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add 'scrolled' class when user scrolls down more than 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== FORM SUBMISSION ====================
// ==================== FORM SUBMISSION (v) ====================

// Select the form element
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent normal reload

        const formData = new FormData(contactForm);

        // ✅ Use formbold endpoint from the form’s action attribute
        const actionURL = contactForm.action;

        try {
            const response = await fetch(actionURL, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            // ✅ formbold returns JSON success if submission works
            if (response.ok) {
                showMessage('Thank you for contacting us! We’ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                // ❌ formbold failed (e.g. invalid endpoint)
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    showMessage(data.errors.map(err => err.message).join(', '), 'error');
                } else {
                    showMessage('Oops! Something went wrong. Please try again later.', 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        }
    });
}



// ==================== SHOW MESSAGE FUNCTION ====================
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== FORM INPUT ANIMATIONS ====================
const formInputs = document.querySelectorAll('.contact-form-input, .contact-form-textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (this.value === '') {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ==================== SCROLL REVEAL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.2,
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

// ==================== PAGE LOAD ANIMATIONS ====================
window.addEventListener('load', () => {
    // Animate form
    const formWrapper = document.querySelector('.contact-form-wrapper');
    if (formWrapper) {
        formWrapper.style.opacity = '0';
        formWrapper.style.transform = 'translateY(30px)';
        formWrapper.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        observer.observe(formWrapper);
    }

    // Animate info cards
    const infoCards = document.querySelectorAll('.contact-info-card, .contact-social-card, .contact-hours-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1 + 0.3}s, transform 0.6s ease ${index * 0.1 + 0.3}s`;
        observer.observe(card);
    });
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
console.log('%c📞 Contact Page Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%cWe\'re here to help you find your dream property!', 'color: #C8B8A8; font-size: 12px;');



// ==================== DYNAMIC CMS CONTENT UPDATER FOR CONTACT PAGE ====================
fetch('/content/contactpage.json')
  .then(res => res.json())
  .then(data => {
    // HEADER / NAVBAR
    document.querySelector('[data-cms="contact-brand-tagline"]').textContent = data.contact_brand_tagline || '';
    document.querySelector('[data-cms="contact-nav-link-home"]').textContent = data.contact_nav_link_home || '';
    document.querySelector('[data-cms="contact-nav-link-properties"]').textContent = data.contact_nav_link_properties || '';
    document.querySelector('[data-cms="contact-nav-link-blog"]').textContent = data.contact_nav_link_blog || '';
    document.querySelector('[data-cms="contact-nav-link-about"]').textContent = data.contact_nav_link_about || '';
    document.querySelector('[data-cms="contact-nav-link-contact"]').textContent = data.contact_nav_link_contact || '';
    var contactLogoImg = document.querySelector('[data-cms="contact-brand-logo"] img');
    if (contactLogoImg && data.contact_brand_logo) contactLogoImg.src = data.contact_brand_logo;

    // HERO SECTION
    document.querySelector('[data-cms="contact-hero-label"]').textContent = data.contact_hero_label || '';
    document.querySelector('[data-cms="contact-hero-title"]').textContent = data.contact_hero_title || '';
    document.querySelector('[data-cms="contact-hero-desc"]').textContent = data.contact_hero_desc || '';

    // CONTACT FORM SECTION
    document.querySelector('[data-cms="contact-form-title"]').textContent = data.contact_form_title || '';
    document.querySelector('[data-cms="contact-form-desc"]').textContent = data.contact_form_desc || '';
    document.querySelector('[data-cms="label-name"]').textContent = data.label_name || '';
    document.querySelector('[data-cms="label-email"]').textContent = data.label_email || '';
    document.querySelector('[data-cms="label-message"]').textContent = data.label_message || '';

    // CONTACT INFO CARDS
    document.querySelector('[data-cms="location-title"]').textContent = data.location_title || '';
    document.querySelector('[data-cms="location-text"]').innerHTML = data.location_text ? data.location_text.replace(/\n/g, '<br>') : '';
    document.querySelector('[data-cms="phone-title"]').textContent = data.phone_title || '';
    document.querySelector('[data-cms="phone-text"]').innerHTML = data.phone_text ? data.phone_text.replace(/\n/g, '<br>') : '';
    document.querySelector('[data-cms="email-title"]').textContent = data.email_title || '';
    document.querySelector('[data-cms="email-text"]').textContent = data.email_text || '';

    // SOCIAL MEDIA
    document.querySelector('[data-cms="social-title"]').textContent = data.social_title || '';
    document.querySelector('[data-cms="social-facebook"]').href = data.social_facebook || '#';
    document.querySelector('[data-cms="social-instagram"]').href = data.social_instagram || '#';
    document.querySelector('[data-cms="social-whatsapp"]').href = data.social_whatsapp || '#';

    // OFFICE HOURS
    document.querySelector('[data-cms="hours-title"]').textContent = data.hours_title || '';
    document.querySelector('[data-cms="hours-weekdays"]').textContent = data.hours_weekdays || '';
    document.querySelector('[data-cms="hours-weekdays-time"]').textContent = data.hours_weekdays_time || '';
    document.querySelector('[data-cms="hours-saturday"]').textContent = data.hours_saturday || '';
    document.querySelector('[data-cms="hours-saturday-time"]').textContent = data.hours_saturday_time || '';
    document.querySelector('[data-cms="hours-sunday"]').textContent = data.hours_sunday || '';
    document.querySelector('[data-cms="hours-sunday-time"]').textContent = data.hours_sunday_time || '';

    // GOOGLE MAP EMBED
    var googleMap = document.querySelector('[data-cms="google-map"]');
    if (googleMap && data.google_map) googleMap.src = data.google_map;

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
    document.querySelector('[data-cms="footer-email"]').textContent = data.footer_email || '';
    document.querySelector('[data-cms="footer-copyright"]').textContent = data.footer_copyright || '';
    document.querySelector('[data-cms="footer-privacy"]').textContent = data.footer_privacy || '';
    document.querySelector('[data-cms="footer-terms"]').textContent = data.footer_terms || '';

  })
  .catch(err => {
    console.error('Failed to dynamically update contact page from CMS:', err);
  });
