
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all enhancements
  initFormValidation();
  initTestimonialCarousel();
  initScrollAnimations();
  initDynamicContent();
  initServiceWorker();
  initAnalytics();
  initCookieConsent();
  initPricingCalculator();
  initChatWidget();
  initFileUploadPreview();
});

// 1. Form Validation & Submission
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
      
      // Simulate API call (replace with actual fetch)
      setTimeout(() => {
        submitBtn.textContent = 'Sent Successfully!';
        form.reset();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Thank you! We will contact you shortly.';
        form.parentNode.insertBefore(successMsg, form.nextSibling);
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          successMsg.remove();
        }, 3000);
      }, 1500);
    });
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', validateField);
    });
  });
  
  function validateField(e) {
    const field = e.target;
    const errorElement = field.nextElementSibling;
    
    if (field.validity.valid) {
      field.classList.remove('invalid');
      if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
      }
    } else {
      field.classList.add('invalid');
      showError(field);
    }
  }
  
  function showError(field) {
    let message = '';
    if (field.validity.valueMissing) {
      message = 'This field is required';
    } else if (field.validity.typeMismatch) {
      message = `Please enter a valid ${field.type}`;
    } else if (field.validity.tooShort) {
      message = `Minimum length is ${field.minLength} characters`;
    }
    
    const errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    } else {
      errorElement.textContent = message;
    }
  }
}

// 2. Interactive Testimonial Carousel
function initTestimonialCarousel() {
  const testimonials = document.querySelector('.testimonials-grid');
  if (!testimonials) return;
  
  testimonials.classList.add('carousel');
  const items = Array.from(testimonials.children);
  let currentIndex = 0;
  
  // Create navigation dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  items.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.dataset.index = index;
    dot.addEventListener('click', () => goToTestimonial(index));
    dotsContainer.appendChild(dot);
  });
  testimonials.parentNode.appendChild(dotsContainer);
  
  // Create navigation arrows
  const prevArrow = document.createElement('button');
  prevArrow.className = 'carousel-arrow prev';
  prevArrow.innerHTML = '&lt;';
  prevArrow.addEventListener('click', () => navigateTestimonials(-1));
  
  const nextArrow = document.createElement('button');
  nextArrow.className = 'carousel-arrow next';
  nextArrow.innerHTML = '&gt;';
  nextArrow.addEventListener('click', () => navigateTestimonials(1));
  
  testimonials.parentNode.insertBefore(prevArrow, testimonials);
  testimonials.parentNode.insertBefore(nextArrow, testimonials.nextSibling);
  
  // Auto-rotate every 5 seconds
  let autoRotate = setInterval(() => navigateTestimonials(1), 5000);
  
  // Pause on hover
  testimonials.addEventListener('mouseenter', () => clearInterval(autoRotate));
  testimonials.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => navigateTestimonials(1), 5000);
  });
  
  function navigateTestimonials(direction) {
    const newIndex = (currentIndex + direction + items.length) % items.length;
    goToTestimonial(newIndex);
  }
  
  function goToTestimonial(index) {
    currentIndex = index;
    const offset = -index * 100;
    testimonials.style.transform = `translateX(${offset}%)`;
    
    // Update active dot
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  // Initialize first testimonial
  goToTestimonial(0);
}

// 3. Scroll Animations & Smooth Transitions
function initScrollAnimations() {
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('animate');
      }
    });
  };
  
  // Add animation classes to elements
  document.querySelectorAll('#about, #technology, #reliability, #contact, #testimonials').forEach(section => {
    section.querySelectorAll('h3, p, img, .tech-left, .tech-right, .reliableleft').forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.setProperty('--delay', `${i * 0.1}s`);
    });
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
}

// 4. Dynamic Content Loading
function initDynamicContent() {
  // Lazy load images
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // Load more testimonials on button click
  const loadMoreBtn = document.querySelector('.load-more-testimonials');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      fetch('/api/more-testimonials')
        .then(response => response.json())
        .then(data => {
          const container = document.querySelector('.testimonials-grid');
          data.forEach(testimonial => {
            const element = createTestimonialElement(testimonial);
            container.appendChild(element);
          });
          if (data.length < 3) loadMoreBtn.style.display = 'none';
        });
    });
  }
}

// 5. Service Worker for Offline Capability
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
}

// 6. Analytics Integration
function initAnalytics() {
  // Google Analytics (replace with your ID)
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXX-Y');
  
  // Track important interactions
  document.querySelectorAll('.cta-btn, .request a, .nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      gtag('event', 'click', {
        'event_category': 'Engagement',
        'event_label': this.textContent.trim()
      });
    });
  });
}

// 7. Cookie Consent Banner
function initCookieConsent() {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
      <button class="accept-cookies">Accept</button>
      <button class="learn-more">Learn More</button>
    `;
    document.body.appendChild(banner);
    
    banner.querySelector('.accept-cookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      banner.style.display = 'none';
    });
    
    banner.querySelector('.learn-more').addEventListener('click', () => {
      window.open('/privacy-policy#cookies', '_blank');
    });
  }
}

// 8. Dynamic Pricing Calculator
function initPricingCalculator() {
  const calculator = document.querySelector('.pricing-calculator');
  if (!calculator) return;
  
  const audioMinutes = calculator.querySelector('#audio-minutes');
  const turnaround = calculator.querySelector('#turnaround');
  const specialty = calculator.querySelector('#specialty');
  const priceDisplay = calculator.querySelector('.calculated-price');
  
  const baseRate = 0.75; // $ per minute
  const turnaroundRates = {
    '24h': 1.2,
    '48h': 1.0,
    '72h': 0.9
  };
  const specialtyRates = {
    'general': 1.0,
    'radiology': 1.3,
    'surgery': 1.4,
    'psychiatry': 1.2
  };
  
  function calculatePrice() {
    const minutes = parseFloat(audioMinutes.value) || 0;
    const turnaroundRate = turnaroundRates[turnaround.value] || 1.0;
    const specialtyRate = specialtyRates[specialty.value] || 1.0;
    
    const price = minutes * baseRate * turnaroundRate * specialtyRate;
    priceDisplay.textContent = `$${price.toFixed(2)}`;
  }
  
  audioMinutes.addEventListener('input', calculatePrice);
  turnaround.addEventListener('change', calculatePrice);
  specialty.addEventListener('change', calculatePrice);
  
  calculatePrice(); // Initial calculation
}

// 9. Real-time Chat Support Widget
function initChatWidget() {
  const chatTrigger = document.createElement('div');
  chatTrigger.className = 'chat-trigger';
  chatTrigger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c5.514 0 10 3.592 10 8.007s-4.486 8.007-10 8.007c-1.89 0-3.678-.45-5.327-1.26l-3.673 1.26 1.273-3.544C2.57 14.45 2 12.808 2 11.007 2 6.592 6.486 3 12 3zm0 2c-4.418 0-8 2.82-8 6.007 0 1.426.83 2.79 2.3 3.963l.2.175-.656 1.826 2.024-.692.31.133c1.333.57 2.8.892 4.322.892 4.418 0 8-2.82 8-6.007S16.418 5 12 5zm-1 3h2v2h-2V8zm4 0h2v2h-2V8zm-8 0h2v2H7V8z"/></svg>';
  
  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
  chatWindow.innerHTML = `
    <div class="chat-header">
      <h4>Live Support</h4>
      <button class="close-chat">&times;</button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input">
      <input type="text" placeholder="Type your message...">
      <button class="send-message">Send</button>
    </div>
  `;
  
  document.body.appendChild(chatTrigger);
  document.body.appendChild(chatWindow);
  
  let isOpen = false;
  const messages = [
    "Hello! How can we help you today?",
    "Would you like a free trial of our services?",
    "Our average turnaround time is 24-48 hours."
  ];
  
  chatTrigger.addEventListener('click', toggleChat);
  chatWindow.querySelector('.close-chat').addEventListener('click', toggleChat);
  chatWindow.querySelector('.send-message').addEventListener('click', sendMessage);
  
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'block' : 'none';
    chatTrigger.classList.toggle('active', isOpen);
    
    if (isOpen) {
      // Simulate initial messages
      const messagesContainer = chatWindow.querySelector('.chat-messages');
      messagesContainer.innerHTML = '';
      messages.forEach((msg, i) => {
        setTimeout(() => {
          addMessage(msg, 'support');
        }, i * 1000);
      });
    }
  }
  
  function sendMessage() {
    const input = chatWindow.querySelector('input');
    const message = input.value.trim();
    if (message) {
      addMessage(message, 'user');
      input.value = '';
      
      // Simulate response after delay
      setTimeout(() => {
        addMessage("Thank you for your message. A representative will respond shortly.", 'support');
      }, 1500);
    }
  }
  
  function addMessage(text, sender) {
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// 10. File Upload Preview
function initFileUploadPreview() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  
  fileInputs.forEach(input => {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'file-preview';
    input.parentNode.insertBefore(previewContainer, input.nextSibling);
    
    input.addEventListener('change', function() {
      previewContainer.innerHTML = '';
      
      if (this.files && this.files.length > 0) {
        const file = this.files[0];
        const fileType = file.type.split('/')[0];
        
        if (fileType === 'image') {
          const reader = new FileReader();
          reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewContainer.appendChild(img);
          };
          reader.readAsDataURL(file);
        } else if (fileType === 'audio') {
          const audio = document.createElement('audio');
          audio.controls = true;
          audio.src = URL.createObjectURL(file);
          previewContainer.appendChild(audio);
        } else {
          const fileInfo = document.createElement('div');
          fileInfo.className = 'file-info';
          fileInfo.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <div>
              <strong>${file.name}</strong>
              <span>${(file.size / 1024).toFixed(2)} KB</span>
            </div>
          `;
          previewContainer.appendChild(fileInfo);
        }
      }
    });
  });
}

// Helper function to create testimonial elements
function createTestimonialElement(testimonial) {
  const element = document.createElement('div');
  element.className = 'testimonial';
  element.innerHTML = `
    <div class="pic">
      <img src="${testimonial.photo}" alt="${testimonial.name}">
    </div>
    <blockquote>${testimonial.quote}</blockquote>
    <p>- ${testimonial.name}</p>
    <span class="client-title">${testimonial.title}</span>
  `;
  return element;
}
