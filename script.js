/**
 * 079 Service - Main JavaScript
 * Premium landing page interactions
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const faqItems = document.querySelectorAll('.faq-item');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const contactForm = document.getElementById('contactForm');
  const backToTop = document.getElementById('backToTop');
  const revealElements = document.querySelectorAll('.reveal-up');

  // Gallery images array
  const galleryImages = [];
  let currentImageIndex = 0;

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initGallery();
    initContactForm();
    initBackToTop();
    initRevealAnimations();
    initActiveNav();
  });

  // Header scroll behavior
  function initHeader() {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Mobile menu toggle
  function initMobileMenu() {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll to sections
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // FAQ Accordion
  function initFAQ() {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        this.setAttribute('aria-expanded', !isActive);
      });
    });
  }

  // Gallery and Lightbox
  function initGallery() {
    // Build gallery images array
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        galleryImages.push({
          src: img.src,
          alt: img.alt
        });
      } else {
        // For placeholder items, use a placeholder or skip
        galleryImages.push({
          src: '',
          alt: 'Placeholder'
        });
      }

      // Click to open lightbox
      item.addEventListener('click', function() {
        if (galleryImages[index].src) {
          openLightbox(index);
        }
      });
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });

    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    // Find previous valid image
    let attempts = galleryImages.length;
    do {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      attempts--;
    } while (galleryImages[currentImageIndex].src === '' && attempts > 0);

    updateLightboxImage();
  }

  function showNextImage() {
    // Find next valid image
    let attempts = galleryImages.length;
    do {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      attempts--;
    } while (galleryImages[currentImageIndex].src === '' && attempts > 0);

    updateLightboxImage();
  }

  function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];
    if (image.src) {
      lightboxImg.src = image.src;
      lightboxImg.alt = image.alt;
    }
  }

  // Contact Form
  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validate
      let isValid = true;

      // Reset errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate name
      if (!name) {
        document.getElementById('name').closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate phone
      if (!phone) {
        document.getElementById('phone').closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate message
      if (!message) {
        document.getElementById('message').closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (!isValid) return;

      // Build WhatsApp message
      const whatsappText = `Salam! 079 Service ilə əlaqə saxlayıram.%0A%0A` +
        `Ad: ${encodeURIComponent(name)}%0A` +
        `Telefon: ${encodeURIComponent(phone)}%0A%0A` +
        `Mesaj: ${encodeURIComponent(message)}`;

      const whatsappUrl = `https://wa.me/994708090079?text=${whatsappText}`;

      // Show success message
      const successDiv = document.getElementById('formSuccess');
      successDiv.classList.add('show');

      // Open WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        successDiv.classList.remove('show');
      }, 3000);
    });

    // Remove error on input
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', function() {
        this.closest('.form-group').classList.remove('error');
      });
    });
  }

  // Back to top button
  function initBackToTop() {
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Reveal animations on scroll
  function initRevealAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay for multiple elements
          const delay = index * 100;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Active nav link highlighting
  function initActiveNav() {
    let currentSection = '';

    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = sectionId;
        }
      });

      // Update nav links
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

})();
