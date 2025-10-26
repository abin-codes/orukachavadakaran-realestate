// ==================== GLOBAL VARIABLES ====================
let currentProperty = null;
let currentSlideIndex = 0;
let slideInterval = null;
let propertyImages = [];

// ==================== GET PROPERTY ID FROM URL ====================
function getPropertyIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// ==================== LOAD PROPERTY DATA ====================
async function fetchPropertyData() {
  const propertyId = getPropertyIdFromURL();
  if (!propertyId) {
    alert('Property Not Found');
    window.location.href = 'property.html';
    return;
  }

  try {
    const response = await fetch(`./content/properties/property-${propertyId}.json`);
    if (!response.ok) throw new Error('Property file not found');
    currentProperty = await response.json();
    propertyImages = [currentProperty.featured_image, ...currentProperty.additional_images];
    populatePropertyData();
    initializeSlider();
    initializeThumbnails();
  } catch (error) {
    console.error('Error loading property:', error);
    alert('Error loading property details.');
    window.location.href = 'property.html';
  }
}

// ==================== POPULATE PROPERTY DATA ====================
function populatePropertyData() {
    // Property Name
    document.getElementById('property-name').textContent = currentProperty.name;
    
    // Location - FIXED: Use location_full instead of location
    document.getElementById('property-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentProperty.location_full}`;
    
    // Price in Enquiry Box
    document.getElementById('enquiry-price').textContent = currentProperty.priceDisplay;

    // Status Indicator
    populateStatusIndicator();
    
    // Specifications
    populateSpecifications();
    
    // Description - FIXED: Use long_description instead of description
    document.getElementById('description-text').textContent = currentProperty.long_description;
    
    // Amenities
    populateAmenities();
    
    // Nearby Landmarks
    populateLandmarks();
    
    // Other Features
    populateOtherFeatures();
}

// ==================== POPULATE SPECIFICATIONS ====================
function populateSpecifications() {
    const specsGrid = document.getElementById('specs-grid');
    specsGrid.innerHTML = '';
    
    // FIXED: Access properties directly from currentProperty, not from nested specifications object
    
    // Type
    if (currentProperty.type) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-home"></i>
                </div>
                <div class="spec-content">
                    <p>Type</p>
                    <p>${currentProperty.type}</p>
                </div>
            </div>
        `;
    }
    
    // Built-up Area (only for houses)
    if (currentProperty.builtUpArea) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-ruler-combined"></i>
                </div>
                <div class="spec-content">
                    <p>Built-up Area</p>
                    <p>${currentProperty.builtUpArea}</p>
                </div>
            </div>
        `;
    }
    
    // Plot Size
    if (currentProperty.plotSize) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-vector-square"></i>
                </div>
                <div class="spec-content">
                    <p>Plot Size</p>
                    <p>${currentProperty.plotSize}</p>
                </div>
            </div>
        `;
    }
    
    // Bedrooms (only for houses) - FIXED: Check for > 0
    if (currentProperty.bedrooms && currentProperty.bedrooms > 0) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-bed"></i>
                </div>
                <div class="spec-content">
                    <p>Bedrooms</p>
                    <p>${currentProperty.bedrooms}</p>
                </div>
            </div>
        `;
    }
    
    // Bathrooms (only for houses) - FIXED: Check for > 0
    if (currentProperty.bathrooms && currentProperty.bathrooms > 0) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-bath"></i>
                </div>
                <div class="spec-content">
                    <p>Bathrooms</p>
                    <p>${currentProperty.bathrooms}</p>
                </div>
            </div>
        `;
    }
    
    // Floors (only for houses) - FIXED: Check for > 0
    if (currentProperty.floors && currentProperty.floors > 0) {
        specsGrid.innerHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="spec-content">
                    <p>Floors</p>
                    <p>${currentProperty.floors}</p>
                </div>
            </div>
        `;
    }
}

// ==================== POPULATE AMENITIES ====================
function populateAmenities() {
    const amenitiesContainer = document.getElementById('amenities-tags');
    amenitiesContainer.innerHTML = '';
    
    currentProperty.amenities.forEach(amenity => {
        amenitiesContainer.innerHTML += `<span class="amenity-tag">${amenity}</span>`;
    });
}

// ==================== POPULATE LANDMARKS ====================
function populateLandmarks() {
    const landmarksList = document.getElementById('landmarks-list');
    landmarksList.innerHTML = '';
    
    currentProperty.nearbyLandmarks.forEach(landmark => {
        landmarksList.innerHTML += `<li>${landmark}</li>`;
    });
}

// ==================== POPULATE OTHER FEATURES ====================
function populateOtherFeatures() {
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';
    
    currentProperty.otherFeatures.forEach(feature => {
        featuresList.innerHTML += `<li>${feature}</li>`;
    });
}

// ==================== POPULATE STATUS INDICATOR ====================
function populateStatusIndicator() {
    const statusIndicator = document.getElementById('status-indicator');
    
    if (!statusIndicator) return;
    
    const status = currentProperty.status || 'available'; // Default to available
    
    // Remove all status classes
    statusIndicator.classList.remove('available', 'sold', 'negotiation');
    
    // Add appropriate status class and content
    if (status === 'available') {
        statusIndicator.classList.add('available');
        statusIndicator.innerHTML = `
            <span class="status-icon">🟢</span>
            <span class="status-text">Available</span>
        `;
    } else if (status === 'sold') {
        statusIndicator.classList.add('sold');
        statusIndicator.innerHTML = `
            <span class="status-icon">🔴</span>
            <span class="status-text">Sold Out</span>
        `;
    } else if (status === 'negotiation') {
        statusIndicator.classList.add('negotiation');
        statusIndicator.innerHTML = `
            <span class="status-icon">🟡</span>
            <span class="status-text">Temporarily Reserved</span>
        `;
    }
}

// ==================== IMAGE SLIDER FUNCTIONALITY ====================
function initializeSlider() {
    const mainSlider = document.getElementById('main-slider');
    mainSlider.innerHTML = '';
    
    // Add images to slider
    propertyImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${currentProperty.name} - Image ${index + 1}`;
        img.className = 'slider-image';
        if (index === 0) img.classList.add('active');
        
        // Click to open lightbox
        img.addEventListener('click', () => openLightbox(index));
        
        mainSlider.appendChild(img);
    });
    
    // Update counter
    document.getElementById('total-slides').textContent = propertyImages.length;
    updateSlideCounter();
    
    // Start auto-slide
    startAutoSlide();
    
    // Setup controls
    document.getElementById('slider-prev').addEventListener('click', () => {
        stopAutoSlide();
        previousSlide();
        startAutoSlide();
    });
    
    document.getElementById('slider-next').addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-image');
    
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    // Update thumbnails
    updateThumbnailActive(index);
    
    // Update counter
    updateSlideCounter();
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % propertyImages.length;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + propertyImages.length) % propertyImages.length;
    showSlide(currentSlideIndex);
}

function goToSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlideIndex + 1;
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// ==================== THUMBNAIL GALLERY ====================
function initializeThumbnails() {
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    thumbnailGallery.innerHTML = '';
    
    propertyImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item';
        if (index === 0) thumbnail.classList.add('active');
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Thumbnail ${index + 1}`;
        
        thumbnail.appendChild(img);
        
        // Click to change main slide
        thumbnail.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
        
        thumbnailGallery.appendChild(thumbnail);
    });
}

function updateThumbnailActive(index) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ==================== LIGHTBOX FUNCTIONALITY ====================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

function openLightbox(index) {
    currentSlideIndex = index;
    lightboxImage.src = propertyImages[currentSlideIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function lightboxNextImage() {
    currentSlideIndex = (currentSlideIndex + 1) % propertyImages.length;
    lightboxImage.src = propertyImages[currentSlideIndex];
    showSlide(currentSlideIndex); // Update main slider too
}

function lightboxPrevImage() {
    currentSlideIndex = (currentSlideIndex - 1 + propertyImages.length) % propertyImages.length;
    lightboxImage.src = propertyImages[currentSlideIndex];
    showSlide(currentSlideIndex); // Update main slider too
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', lightboxNextImage);
lightboxPrev.addEventListener('click', lightboxPrevImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            lightboxNextImage();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrevImage();
        }
    }
});

// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('details-nav-toggle');
const navMenu = document.getElementById('details-nav-menu');
const navLinks = document.querySelectorAll('.details-nav-link');

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
const header = document.getElementById('details-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Show navbar after scrolling down
    if (currentScroll > 50) {
        header.classList.add('show-navbar');
        header.classList.add('scrolled');
    } else {
        header.classList.remove('show-navbar');
        header.classList.remove('scrolled');
    }
});

// ==================== STICKY ENQUIRY BOX (Desktop Only) ====================
function setupStickyEnquiryBox() {
    const enquiryBox = document.getElementById('enquiry-box');
    const contentSection = document.querySelector('.details-content-section');
    
    if (window.innerWidth > 968 && enquiryBox && contentSection) {
        const contentRect = contentSection.getBoundingClientRect();
        const contentBottom = contentRect.bottom + window.pageYOffset;
        const enquiryHeight = enquiryBox.offsetHeight;
        const currentScroll = window.pageYOffset;
        
        // Check if we've scrolled past the content section
        if (currentScroll + enquiryHeight + 150 > contentBottom) {
            enquiryBox.style.position = 'absolute';
            enquiryBox.style.top = (contentBottom - contentSection.offsetTop - enquiryHeight) + 'px';
        } else {
            enquiryBox.style.position = 'sticky';
            enquiryBox.style.top = '100px';
        }
    }
}

// Apply sticky behavior on scroll
window.addEventListener('scroll', setupStickyEnquiryBox);
window.addEventListener('resize', setupStickyEnquiryBox);

// ==================== PAGE LOAD INITIALIZATION ====================
window.addEventListener('load', () => {
    // Load property data
    fetchPropertyData();
    
    // Setup sticky enquiry box
    setupStickyEnquiryBox();
    
    // Add fade-in animation to content
    const contentSections = document.querySelectorAll('.details-left-column > div');
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
    
    contentSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
});

// ==================== CLEANUP ON PAGE UNLOAD ====================
window.addEventListener('beforeunload', () => {
    stopAutoSlide();
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🏠 Property Details Page Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log(`%cProperty: ${currentProperty ? currentProperty.name : 'Loading...'}`, 'color: #C8B8A8; font-size: 12px;');


// ==================== DYNAMIC CMS CONTENT UPDATER ====================
const pageFile = window.location.pathname.includes('property-details')
  ? '/content/propertydetailspage.json'
  : '/content/propertypage.json';

fetch(pageFile)
  .then(res => res.json())
  .then(data => {
    // HEADER
    const logoEl = document.querySelector('[data-cms$="brand-logo"] img');
    if (logoEl && data.property_brand_logo) logoEl.src = data.property_brand_logo || data.details_brand_logo;

    const taglineEl = document.querySelector('[data-cms$="brand-tagline"]');
    if (taglineEl) taglineEl.textContent = data.property_brand_tagline || data.details_brand_tagline;

    // Nav Links
    document.querySelector('[data-cms$="nav-link-home"]').textContent = data.property_nav_link_home || data.details_nav_link_home;
    document.querySelector('[data-cms$="nav-link-properties"]').textContent = data.property_nav_link_properties || data.details_nav_link_properties;
    document.querySelector('[data-cms$="nav-link-blog"]').textContent = data.property_nav_link_blog || data.details_nav_link_blog;
    document.querySelector('[data-cms$="nav-link-about"]').textContent = data.property_nav_link_about || data.details_nav_link_about;
    document.querySelector('[data-cms$="nav-link-contact"]').textContent = data.property_nav_link_contact || data.details_nav_link_contact;

    // HERO (if present)
    if (data.property_hero_title) document.querySelector('[data-cms="property-hero-title"]').textContent = data.property_hero_title;
    if (data.property_hero_desc) document.querySelector('[data-cms="property-hero-desc"]').textContent = data.property_hero_desc;

    // SEARCH + FILTER BUTTON TEXT
    const searchInput = document.querySelector('[data-cms="property-search-placeholder"]');
    if (searchInput) searchInput.placeholder = data.property_search_placeholder;

    if (data.filter_all) document.querySelector('[data-cms="filter-all"]').textContent = data.filter_all;
    if (data.filter_plot) document.querySelector('[data-cms="filter-plot"]').textContent = data.filter_plot;
    if (data.filter_house) document.querySelector('[data-cms="filter-house"]').textContent = data.filter_house;
    if (data.filter_house_plot) document.querySelector('[data-cms="filter-house-plot"]').textContent = data.filter_house_plot;

    // BACK BUTTON
    const backBtn = document.querySelector('[data-cms="back-link"]');
    if (backBtn && data.back_link) backBtn.textContent = data.back_link;

    // ENQUIRY BOX (Only details page)
    document.querySelector('[data-cms="enquiry-title"]')?.textContent = data.enquiry_title || '';
    document.querySelector('[data-cms="enquiry-call-label"]')?.textContent = data.enquiry_call_label || '';
    document.querySelector('[data-cms="enquiry-phone-1"]')?.textContent = data.enquiry_phone_1 || '';
    document.querySelector('[data-cms="enquiry-phone-1"]')?.setAttribute('href', `tel:${data.enquiry_phone_1?.replace(/\s+/g, '')}`);
    document.querySelector('[data-cms="enquiry-phone-2"]')?.textContent = data.enquiry_phone_2 || '';
    document.querySelector('[data-cms="enquiry-phone-2"]')?.setAttribute('href', `tel:${data.enquiry_phone_2?.replace(/\s+/g, '')}`);
    document.querySelector('[data-cms="enquiry-email-label"]')?.textContent = data.enquiry_email_label || '';
    document.querySelector('[data-cms="enquiry-email"]')?.textContent = data.enquiry_email || '';
    document.querySelector('[data-cms="enquiry-button"]')?.textContent = data.enquiry_button || '';

    // FOOTER DYNAMIC UPDATE
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
  .catch(err => console.error('Dynamic CMS load failed:', err));
