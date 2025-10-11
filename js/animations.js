/* ===================================
   ANIMATIONS & SCROLL EFFECTS
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ==========
  
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.research-card, .timeline-item, .publication-item, .blog-card');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          
          // Trigger animation
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Initialize animations
  animateOnScroll();
  
  
  // ========== PARALLAX EFFECT FOR HERO BACKGROUND ==========
  const heroBackground = document.querySelector('.hero-background');
  
  if (heroBackground) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }
  
  
  // ========== TYPING EFFECT FOR HERO TAGLINE (Optional Enhancement) ==========
  const heroTagline = document.querySelector('.hero-tagline');
  
  if (heroTagline && heroTagline.dataset.typeEffect === 'true') {
    const text = heroTagline.textContent;
    heroTagline.textContent = '';
    heroTagline.style.opacity = '1';
    
    let index = 0;
    const typingSpeed = 50;
    
    function typeText() {
      if (index < text.length) {
        heroTagline.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, typingSpeed);
      }
    }
    
    // Start typing after a short delay
    setTimeout(typeText, 1000);
  }
  
  
  // ========== COUNTER ANIMATION FOR STATS (if added) ==========
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };
  
  // Observe stat counters
  const statCounters = document.querySelectorAll('.stat-number');
  
  if (statCounters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statCounters.forEach(counter => counterObserver.observe(counter));
  }
  
  
  // ========== PROGRESS BAR ON SCROLL (for blog posts) ==========
  const progressBar = document.querySelector('.reading-progress');
  
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.pageYOffset;
      const progress = (scrolled / documentHeight) * 100;
      
      progressBar.style.width = `${progress}%`;
    });
  }
  
  
  // ========== STAGGER ANIMATION FOR CARDS ==========
  const staggerCards = () => {
    const cardGroups = document.querySelectorAll('.research-grid, .blog-grid');
    
    cardGroups.forEach(group => {
      const cards = group.querySelectorAll('.research-card, .blog-card');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
                }, 50);
              }, index * 100);
            });
            
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(group);
    });
  };
  
  staggerCards();
  
  
  // ========== SMOOTH REVEAL FOR SECTIONS ==========
  const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    sections.forEach(section => {
      section.classList.add('section-hidden');
      sectionObserver.observe(section);
    });
  };
  
  // Add CSS for section reveal
  const style = document.createElement('style');
  style.textContent = `
    .section-hidden {
      opacity: 0;
      transform: translateY(20px);
    }
    .section-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
  `;
  document.head.appendChild(style);
  
  revealSections();
  
  
  // ========== HOVER EFFECT ENHANCEMENTS ==========
  const cards = document.querySelectorAll('.research-card, .blog-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
    
    // 3D tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
  
});


// ========== PERFORMANCE OPTIMIZATION ==========

// Throttle function for scroll events
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// Apply throttle to scroll animations
window.addEventListener('scroll', throttle(() => {
  // Scroll-based animations here
}, 100));