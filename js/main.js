/* ===================================
   MAIN JAVASCRIPT
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ========== HEADER SCROLL EFFECT ==========
  const header = document.getElementById('header');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  
  
  // ========== MOBILE MENU TOGGLE ==========
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.contains('active');
      
      if (isOpen) {
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('active');
        body.classList.add('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  
  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  
  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  
  // ========== ABSTRACT TOGGLE (for publications) ==========
  const abstractToggles = document.querySelectorAll('.abstract-toggle');
  
  abstractToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const abstract = this.closest('.publication-featured, .publication-item')
                           .querySelector('.publication-abstract');
      
      if (abstract) {
        const isExpanded = abstract.style.display === 'block';
        
        if (isExpanded) {
          abstract.style.display = 'none';
          this.innerHTML = '<i class="fas fa-chevron-down"></i> Full Abstract';
        } else {
          abstract.style.display = 'block';
          this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Abstract';
        }
      }
    });
  });
  
  
  // ========== ACTIVE NAV LINK HIGHLIGHTING ==========
  // Get current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Find and highlight the matching nav link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Check if current page matches this link
    if (linkPath === currentPath || 
        (currentPath === '' && linkPath === 'index.html') ||
        (linkPath !== 'index.html' && currentPath.includes(linkPath))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  
  // ========== LAZY LOADING IMAGES ==========
  // Modern browser support for lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback for older browsers using Intersection Observer
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  
  // ========== FORM VALIDATION (for contact page) ==========
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form fields
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      // Simple validation
      let isValid = true;
      
      // Reset previous error states
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      
      // Validate name
      if (name.value.trim() === '') {
        showError(name, 'Please enter your name');
        isValid = false;
      }
      
      // Validate email
      if (email.value.trim() === '') {
        showError(email, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate message
      if (message.value.trim() === '') {
        showError(message, 'Please enter a message');
        isValid = false;
      }
      
      // If valid, submit the form (will be handled by Formspree)
      if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Actually submit the form
        contactForm.submit();
      }
    });
  }
  
  // Helper function to show error message
  function showError(input, message) {
    input.classList.add('input-error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  }
  
  // Helper function to validate email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  
  // ========== KEYBOARD NAVIGATION IMPROVEMENTS ==========
  // Add visible focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
  
});


  
  // ========== UTILITY FUNCTIONS ==========

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Helper function to show error message
function showError(input, message) {
  input.classList.add('input-error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

// Helper function to validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}