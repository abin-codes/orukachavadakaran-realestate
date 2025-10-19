// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('blog-nav-toggle');
const navMenu = document.getElementById('blog-nav-menu');
const navLinks = document.querySelectorAll('.blog-nav-link');

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
const header = document.getElementById('blog-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add 'scrolled' class when user scrolls down more than 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== SCROLL TO BLOG FUNCTION ====================
function scrollToBlog(blogId) {
    const blogArticle = document.getElementById(blogId);
    
    if (blogArticle) {
        const offsetTop = blogArticle.offsetTop - 100; // Account for fixed header
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Add highlight animation
        blogArticle.style.transform = 'scale(1.02)';
        blogArticle.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            blogArticle.style.transform = 'scale(1)';
        }, 1000);
    }
}

// ==================== SHARE BLOG FUNCTION ====================
function shareBlog(blogId) {
    const blogArticle = document.getElementById(blogId);
    const blogTitle = blogArticle.querySelector('.blog-article-title').textContent;
    const blogURL = window.location.origin + window.location.pathname + '#' + blogId;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: blogTitle,
            text: 'Check out this article: ' + blogTitle,
            url: blogURL
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy link to clipboard
        copyToClipboard(blogURL);
        
        // Show success message
        showShareMessage('Link copied to clipboard!');
    }
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    document.execCommand('copy');
    
    // Remove textarea
    document.body.removeChild(textarea);
}

// ==================== SHOW SHARE MESSAGE ====================
function showShareMessage(message) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: #2C3E50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
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

// Animate blog preview cards
const previewCards = document.querySelectorAll('.blog-preview-card');
previewCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate blog articles
const articles = document.querySelectorAll('.blog-article');
articles.forEach((article, index) => {
    article.style.opacity = '0';
    article.style.transform = 'translateY(30px)';
    article.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    observer.observe(article);
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    // Check if URL has a hash (blog ID)
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        // Wait for page to fully load, then scroll to blog
        setTimeout(() => {
            scrollToBlog(hash);
        }, 500);
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
console.log('%c📝 Blog Page Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%cRead our latest real estate insights', 'color: #C8B8A8; font-size: 12px;');
