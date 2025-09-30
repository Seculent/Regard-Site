// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu elements
    createMobileMenu();
    
    // Initialize mobile navigation
    initMobileNav();
});

function createMobileMenu() {
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    mobileToggle.setAttribute('aria-label', 'Открыть меню');
    
    // Create mobile navigation
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    
    // Copy navigation links from desktop menu
    const desktopNav = document.querySelector('header nav ul');
    if (desktopNav) {
        mobileNav.innerHTML = `
            <ul>
                ${desktopNav.innerHTML}
            </ul>
        `;
    }
    
    // Add elements to DOM
    const navContent = document.querySelector('.nav-content');
    if (navContent) {
        navContent.appendChild(mobileToggle);
        document.body.appendChild(mobileNav);
        document.body.appendChild(overlay);
    }
}

function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const body = document.body;
    
    if (!mobileToggle || !mobileNav) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        closeMobileMenu();
    });
    
    // Close menu when clicking on links (except brochure button)
    mobileNav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && !e.target.id.includes('brochure')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function toggleMobileMenu() {
        const isActive = mobileNav.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        mobileToggle.classList.add('active');
        body.style.overflow = 'hidden';
        mobileToggle.setAttribute('aria-label', 'Закрыть меню');
    }
    
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        mobileToggle.classList.remove('active');
        body.style.overflow = '';
        mobileToggle.setAttribute('aria-label', 'Открыть меню');
    }
    
    // Handle brochure button in mobile menu
    const mobileBrochureBtn = mobileNav.querySelector('#brochureBtn');
    if (mobileBrochureBtn) {
        mobileBrochureBtn.addEventListener('click', function(e) {
            // This will be handled by the existing PDF viewer
            closeMobileMenu();
        });
    }
}