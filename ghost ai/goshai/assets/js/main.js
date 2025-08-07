/**
 * Ghost CMS Main JavaScript File
 * Contains core functionality used across all pages
 */

document.addEventListener('DOMContentLoaded', () => {
  // =============== MOBILE MENU TOGGLE ===============
  const mobileMenuToggle = () => {
    const menuButton = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuButton && navMenu) {
      menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuButton.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
      });
    }
  };

  // =============== DARK MODE TOGGLE ===============
  const darkModeToggle = () => {
    const darkModeButton = document.querySelector('#dark-mode-toggle');
    const html = document.documentElement;

    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'true') {
      html.classList.add('dark-mode');
    }

    // Toggle functionality
    if (darkModeButton) {
      darkModeButton.addEventListener('click', () => {
        html.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', html.classList.contains('dark-mode'));
      });
    }
  };

  // =============== LAZY LOADING IMAGES ===============
  const lazyLoadImages = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // Use lazy loading polyfill
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js';
      document.body.appendChild(script);
      
      script.onload = () => {
        const observer = lozad();
        observer.observe();
      };
    }
  };

  // =============== SMOOTH SCROLLING ===============
  const smoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // =============== INITIALIZE ALL FUNCTIONS ===============
  mobileMenuToggle();
  darkModeToggle();
  lazyLoadImages();
  smoothScrolling();
});