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



// ==================== DYNAMIC BLOG CMS & ARTICLE LOADER ====================
fetch('/content/blogpage.json')
  .then(res => res.json())
  .then(data => {
    // HEADER
    document.querySelector('[data-cms="blog-brand-logo"] img').src = data.blog_brand_logo;
    document.querySelector('[data-cms="blog-brand-tagline"]').textContent = data.blog_brand_tagline;
    document.querySelector('[data-cms="blog-nav-link-home"]').textContent = data.blog_nav_link_home;
    document.querySelector('[data-cms="blog-nav-link-properties"]').textContent = data.blog_nav_link_properties;
    document.querySelector('[data-cms="blog-nav-link-blog"]').textContent = data.blog_nav_link_blog;
    document.querySelector('[data-cms="blog-nav-link-about"]').textContent = data.blog_nav_link_about;
    document.querySelector('[data-cms="blog-nav-link-contact"]').textContent = data.blog_nav_link_contact;
    // HERO
    document.querySelector('[data-cms="blog-hero-label"]').textContent = data.blog_hero_label;
    document.querySelector('[data-cms="blog-hero-title"]').textContent = data.blog_hero_title;
    document.querySelector('[data-cms="blog-hero-desc"]').textContent = data.blog_hero_desc;
    // FOOTER
    document.querySelector('[data-cms="footer-logo"]').textContent = data.footer_logo;
    document.querySelector('[data-cms="footer-desc"]').textContent = data.footer_desc;
    document.querySelector('[data-cms="footer-social-label"]').textContent = data.footer_social_label;
    document.querySelector('[data-cms="footer-facebook"]').href = data.footer_facebook;
    document.querySelector('[data-cms="footer-instagram"]').href = data.footer_instagram;
    document.querySelector('[data-cms="footer-whatsapp"]').href = data.footer_whatsapp;
    document.querySelector('[data-cms="footer-links-heading"]').textContent = data.footer_links_heading;
    document.querySelector('[data-cms="footer-link-home"]').textContent = data.footer_link_home;
    document.querySelector('[data-cms="footer-link-properties"]').textContent = data.footer_link_properties;
    document.querySelector('[data-cms="footer-link-blog"]').textContent = data.footer_link_blog;
    document.querySelector('[data-cms="footer-link-about"]').textContent = data.footer_link_about;
    document.querySelector('[data-cms="footer-link-contact"]').textContent = data.footer_link_contact;
    document.querySelector('[data-cms="footer-serve-heading"]').textContent = data.footer_serve_heading;
    document.querySelector('[data-cms="footer-location-1"]').textContent = data.footer_location_1;
    document.querySelector('[data-cms="footer-location-2"]').textContent = data.footer_location_2;
    document.querySelector('[data-cms="footer-location-3"]').textContent = data.footer_location_3;
    document.querySelector('[data-cms="footer-contact-heading"]').textContent = data.footer_contact_heading;
    document.querySelector('[data-cms="footer-address"]').textContent = data.footer_address;
    document.querySelector('[data-cms="footer-phone"]').innerHTML = data.footer_phone;
    document.querySelector('[data-cms="footer-email"]').textContent = data.footer_email;
    document.querySelector('[data-cms="footer-copyright"]').textContent = data.footer_copyright;
    document.querySelector('[data-cms="footer-privacy"]').textContent = data.footer_privacy;
    document.querySelector('[data-cms="footer-terms"]').textContent = data.footer_terms;
  })
  .catch(err => console.error('Dynamic CMS static blogpage load failed:', err));

// ==== DYNAMIC BLOGS LOAD ====
fetch('/content/blog-list.json')
  .then(res => res.json())
  .then(({ blogs }) => Promise.all(
    blogs.map(name => fetch(`/content/blogs/${name}`).then(r => r.json()))
  ))
  .then(blogDataList => {
    // Preview cards
    const previewGrid = document.querySelector('.blog-preview-grid');
    previewGrid.innerHTML = '';
    // Detailed articles
    const detailedSection = document.getElementById('blog-detailed-section');
    detailedSection.innerHTML = '';

    blogDataList.forEach(blog => {
      // Preview card
      const previewCard = document.createElement('div');
      previewCard.className = 'blog-preview-card';
      previewCard.setAttribute('data-blog-id', blog.blog_id);
      previewCard.innerHTML = `
        <div class="blog-preview-image">
          <img src="${blog.preview_image}" alt="${blog.preview_title}">
          <span class="blog-preview-tag">${blog.tag}</span>
        </div>
        <div class="blog-preview-content">
          <p class="blog-preview-date"><i class="far fa-calendar"></i> ${blog.date}</p>
          <h3 class="blog-preview-title">${blog.preview_title}</h3>
          <p class="blog-preview-desc">${blog.preview_desc}</p>
          <button class="blog-read-more" onclick="scrollToBlog('${blog.blog_id}')">${blog.read_more_text || 'Read More'} <i class="fas fa-arrow-right"></i></button>
        </div>
      `;
      previewGrid.appendChild(previewCard);

      // Article (detailed)
      const article = document.createElement('article');
      article.className = 'blog-article';
      article.id = blog.blog_id;
      article.innerHTML = `
        <div class="blog-article-header">
          <img src="${blog.article_image}" alt="${blog.article_title}" class="blog-article-image">
          <div class="blog-article-overlay">
            <span class="blog-article-tag">${blog.tag}</span>
            <p class="blog-article-date"><i class="far fa-calendar"></i> ${blog.date}</p>
            <h2 class="blog-article-title">${blog.article_title}</h2>
          </div>
        </div>
        <div class="blog-article-content"><p>${blog.content.replace(/\n/g, '<br>')}</p></div>
        <div class="blog-article-footer">
          <p class="blog-helpful-text">Found this helpful?</p>
          <button class="blog-share-btn" onclick="shareBlog('${blog.blog_id}')">${blog.share_text || 'Share'} <i class="fas fa-share-alt"></i></button>
        </div>
      `;
      detailedSection.appendChild(article);
    });
  })
  .catch(err => console.error('Dynamic blog articles loading failed:', err));
