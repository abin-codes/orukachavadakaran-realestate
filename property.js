// ==================== GLOBAL STATE ====================
let allProperties = [];
let currentCategory = 'all';
let currentSort = 'newest';

// ==================== MOBILE NAVIGATION TOGGLE ====================
const navToggle = document.getElementById('property-nav-toggle');
const navMenu = document.getElementById('property-nav-menu');
const navLinks = document.querySelectorAll('.property-nav-link');

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
const header = document.getElementById('property-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add 'scrolled' class when user scrolls down more than 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// displayPropertyCards
function displayPropertyCards(properties) {
  const propertyGrid = document.getElementById('property-grid');
  propertyGrid.innerHTML = '';  // Clear existing cards

  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-property-id', property.property_id);
    card.setAttribute('data-category', property.type.toLowerCase().replace(/ & /g, '-'));
    card.setAttribute('data-price', property.price);
    card.setAttribute('data-date', property.date_added);
    card.setAttribute('data-location', property.location_city);
    card.setAttribute('data-title', property.name);

    card.innerHTML = `
      <div class="property-card-image">
        <img src="${property.featured_image}" alt="${property.name}">
        <span class="property-card-badge">${property.type}</span>
        <span class="property-card-location"><i class="fas fa-map-marker-alt"></i> ${property.location_city}</span>
      </div>
      <div class="property-card-content">
        <h3 class="property-card-title">${property.name}</h3>
        <p class="property-card-desc">${property.short_description}</p>
        <div class="property-card-footer">
          <span class="property-card-price">${property.priceDisplay}</span>
          <button class="btn-details" onclick="window.location.href='property-details.html?id=${property.property_id}'">
            Details <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    propertyGrid.appendChild(card);
  });
}

// ==================== INITIALIZE PROPERTIES DATA ====================
async function loadProperties() {
  try {
    // Fetch list of property files automatically (you need a JSON index or static list here)
    const propertyFiles = ['property-101.json', 'property-102.json']; // Update with your files or automate

    const loaded = await Promise.all(
      propertyFiles.map(filename =>
        fetch(`./content/properties/${filename}`).then(res => res.json())
      )
    );

    displayPropertyCards(loaded);

    // Now build allProperties array from loaded and setup filtering/search as before
    allProperties = loaded.map(property => {
      const dummyDiv = document.createElement('div');
      dummyDiv.innerHTML = `
      <div class="property-card" data-property-id="${property.property_id}" data-category="${property.type.toLowerCase().replace(' & ', '-')}" data-price="${property.price}" data-date="${property.date_added}" data-location="${property.location_city.toLowerCase()}" data-title="${property.name.toLowerCase()}">
        <div class="property-card-image">
          <img src="${property.featured_image}" alt="${property.name}">
          <span class="property-card-badge">${property.type}</span>
          <span class="property-card-location"><i class="fas fa-map-marker-alt"></i> ${property.location_city}</span>
        </div>
        <div class="property-card-content">
          <h3 class="property-card-title">${property.name}</h3>
          <p class="property-card-desc">${property.short_description}</p>
          <div class="property-card-footer">
            <span class="property-card-price">${property.priceDisplay}</span>
            <button class="btn-details" onclick="window.location.href='property-details.html?id=${property.property_id}'">
              Details <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>`;
      return {
        element: dummyDiv.firstElementChild,
        id: property.property_id,
        category: property.type.toLowerCase().replace(' & ', '-'),
        price: property.price,
        date: new Date(property.date_added),
        location: property.location_city.toLowerCase(),
        title: property.name.toLowerCase()
      };
    });

    updatePropertyCount(allProperties.length);
    setupDetailsButtons();
    animatePropertyCards();

  } catch (error) {
    console.error('Failed to load properties:', error);
  }
}

window.addEventListener('load', loadProperties);


// ==================== SEARCH FUNCTIONALITY WITH AUTOCOMPLETE ====================
const searchInput = document.getElementById('property-search-input');
const suggestionsContainer = document.getElementById('property-suggestions');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('show');
            return;
        }

        // Filter properties based on search term (location or title)
        const matchedProperties = allProperties.filter(property => {
            return property.location.includes(searchTerm) || 
                   property.title.includes(searchTerm);
        });

        // Display suggestions
        if (matchedProperties.length > 0) {
            displaySuggestions(matchedProperties, searchTerm);
        } else {
            suggestionsContainer.innerHTML = '<div class="property-suggestion-item" style="pointer-events: none;">No properties found</div>';
            suggestionsContainer.classList.add('show');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.remove('show');
        }
    });
}

function displaySuggestions(properties, searchTerm) {
    suggestionsContainer.innerHTML = '';
    
    // Limit to 5 suggestions
    const limitedProperties = properties.slice(0, 5);
    
    limitedProperties.forEach(property => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'property-suggestion-item';
        suggestionItem.innerHTML = `
            <div class="property-suggestion-title">${capitalizeWords(property.title)}</div>
            <div class="property-suggestion-location">${capitalizeWords(property.location)}</div>
        `;
        
        suggestionItem.addEventListener('click', () => {
            // Scroll to the property card
            scrollToProperty(property.element);
            // Clear search and hide suggestions
            searchInput.value = '';
            suggestionsContainer.classList.remove('show');
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    suggestionsContainer.classList.add('show');
}

function scrollToProperty(element) {
    const offsetTop = element.offsetTop - 150; // Account for fixed header
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
    
    // Add highlight effect
    element.style.transform = 'scale(1.05)';
    element.style.boxShadow = '0 12px 40px rgba(200, 184, 168, 0.5)';
    
    setTimeout(() => {
        element.style.transform = '';
        element.style.boxShadow = '';
    }, 2000);
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// ==================== CATEGORY FILTER ====================
const categoryButtons = document.querySelectorAll('.property-category-btn');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current category
        currentCategory = button.getAttribute('data-category');
        
        // Filter and display properties
        filterAndSortProperties();
    });
});

// ==================== SORT FILTER ====================
const sortSelect = document.getElementById('property-sort-select');

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndSortProperties();
    });
}

// ==================== FILTER AND SORT PROPERTIES ====================
function filterAndSortProperties() {
    // First, filter by category
    let filteredProperties = allProperties;
    
    if (currentCategory !== 'all') {
        filteredProperties = allProperties.filter(property => {
            return property.category === currentCategory;
        });
    }
    
    // Then, sort the filtered properties
    filteredProperties = sortProperties(filteredProperties, currentSort);
    
    // Display the filtered and sorted properties
    displayProperties(filteredProperties);
    
    // Update property count
    updatePropertyCount(filteredProperties.length);
}

function sortProperties(properties, sortType) {
    const sortedProperties = [...properties];
    
    switch(sortType) {
        case 'newest':
            sortedProperties.sort((a, b) => b.date - a.date);
            break;
        case 'oldest':
            sortedProperties.sort((a, b) => a.date - b.date);
            break;
        case 'price-low':
            sortedProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProperties.sort((a, b) => b.price - a.price);
            break;
        default:
            sortedProperties.sort((a, b) => b.date - a.date);
    }
    
    return sortedProperties;
}

function displayProperties(properties) {
    const propertyGrid = document.getElementById('property-grid');
    const noResults = document.getElementById('property-no-results');
    
    // Clear current grid
    propertyGrid.innerHTML = '';
    
    if (properties.length === 0) {
        // Show no results message
        noResults.style.display = 'block';
        propertyGrid.style.display = 'none';
    } else {
        // Hide no results message
        noResults.style.display = 'none';
        propertyGrid.style.display = 'grid';
        
        // Append properties in the sorted order
        properties.forEach(property => {
            propertyGrid.appendChild(property.element);
        });
        
        // Re-apply animations
        animatePropertyCards();
    }
}

function updatePropertyCount(count) {
    const countNumber = document.getElementById('property-count-number');
    if (countNumber) {
        countNumber.textContent = count;
    }
}

// ==================== PROPERTY CARD ANIMATIONS ====================
function animatePropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
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
    
    propertyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ==================== DETAILS BUTTON CLICK ====================
function setupDetailsButtons() {
    const detailsButtons = document.querySelectorAll('.btn-details');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const propertyCard = button.closest('.property-card');
            const propertyId = propertyCard.getAttribute('data-property-id');
            
            // Redirect to property details page 
            window.location.href = `property-details.html?id=${propertyId}`;
            
           
        });
    });
}

// ==================== PAGE LOAD INITIALIZATION ====================
window.addEventListener('load', () => {
    // Initialize properties data
    loadProperties();
    
    // Set initial property count
    updatePropertyCount(allProperties.length);
    
    // Setup details buttons
    setupDetailsButtons();
    
    // Animate initial property cards
    animatePropertyCards();
    
    // Check if there's a category parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Find and click the corresponding category button
        const categoryButton = document.querySelector(`[data-category="${categoryParam}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
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
console.log('%c🏠 Property Listing Page Loaded Successfully! ', 'background: #C8B8A8; color: #2C3E50; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c' + allProperties.length + ' properties available', 'color: #C8B8A8; font-size: 12px;');
