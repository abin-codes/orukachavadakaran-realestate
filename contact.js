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
