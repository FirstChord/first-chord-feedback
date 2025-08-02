// Music Sch    this.errorElement = document.getElementById('feedback-error');k System
// Clean, working implementation based on successful basic test

class FeedbackForm {
  constructor() {
    // Get DOM elements
    this.form = document.getElementById('feedbackForm');
    this.nameInput = document.getElementById('name');
    this.feedbackTextarea = document.getElementById('feedback');
    this.submitButton = document.getElementById('submitButton');
    this.buttonText = this.submitButton?.querySelector('.button-text');
    this.charCountElement = document.getElementById('charCount');
    this.errorElement = document.getElementById('feedback-error');
    this.successMessage = document.getElementById('successMessage');
    
    // Animation elements
    this.pencilAnimation = document.getElementById('pencilAnimation');
    this.animatedPencil = null;
    
    // Modal elements
    this.paperOverlay = document.getElementById('paperOverlay');
    this.feedbackPaper = document.getElementById('feedbackPaper');
    this.paperClose = document.getElementById('paperClose');
    this.handwrittenText = document.getElementById('handwrittenText');
    
    // Configuration
    this.minCharacters = window.FeedbackConfig?.MIN_CHARACTERS || 10;
    this.isSubmitting = false;
    this.maxRetries = window.FeedbackConfig?.MAX_RETRIES || 3;
    this.retryDelay = window.FeedbackConfig?.RETRY_DELAY || 2000;
    
    // Animation state
    this.typingTimer = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    if (!this.feedbackTextarea) {
      console.error('Critical error: feedback textarea not found');
      return;
    }
    
    this.setupEventListeners();
    this.setupPencilAnimation();
    this.setupPaperModal();
    this.updateCharacterCount();
    this.setupOfflineDetection();
    
    // Initialization complete
  }
  
  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Textarea events - single handlers to avoid conflicts
    this.feedbackTextarea.addEventListener('input', () => {
      this.updateCharacterCount();
      this.handleInput();
      this.animatePencilTyping();
    });
    
    this.feedbackTextarea.addEventListener('focus', () => {
      this.clearValidationState();
      this.startPencilAnimation();
    });
    
    this.feedbackTextarea.addEventListener('blur', () => {
      this.validateFeedback();
      this.pausePencilAnimation();
    });
  }
  
  setupPencilAnimation() {
    if (!this.pencilAnimation) return;
    
    this.animatedPencil = this.pencilAnimation.querySelector('.animated-pencil');
    if (this.animatedPencil) {
      // Start in floating state
      this.pencilAnimation.classList.add('floating');
    }
  }
  
  setupPaperModal() {
    if (this.paperClose) {
      this.paperClose.addEventListener('click', () => this.closePaper());
    }
    if (this.paperOverlay) {
      this.paperOverlay.addEventListener('click', () => this.closePaper());
    }
  }
  
  handleInput() {
    // Clear errors while typing
    this.clearError();
    this.clearValidationState();
    
    // Show success state if meets minimum requirements
    if (this.feedbackTextarea.value.trim().length >= this.minCharacters) {
      this.feedbackTextarea.classList.add('success');
    }
  }
  
  updateCharacterCount() {
    if (!this.charCountElement) return;
    
    const currentLength = this.feedbackTextarea.value.length;
    this.charCountElement.textContent = currentLength;
    
    // Color coding
    if (currentLength >= this.minCharacters) {
      this.charCountElement.style.color = 'var(--success-color)';
    } else {
      this.charCountElement.style.color = 'var(--text-muted)';
    }
  }
  
  startPencilAnimation() {
    if (!this.pencilAnimation) return;
    this.pencilAnimation.classList.add('floating');
  }
  
  pausePencilAnimation() {
    if (!this.pencilAnimation) return;
    
    setTimeout(() => {
      if (document.activeElement !== this.feedbackTextarea) {
        this.pencilAnimation.classList.remove('floating');
        if (this.animatedPencil) {
          this.animatedPencil.style.left = '20px';
        }
      }
    }, 100);
  }
  
  animatePencilTyping() {
    if (!this.animatedPencil) return;
    
    // Move pencil based on text length
    const textLength = this.feedbackTextarea.value.length;
    const maxLength = 200;
    const maxMovement = 200;
    
    const progress = Math.min(textLength / maxLength, 1);
    const newLeft = 20 + (progress * maxMovement);
    
    this.animatedPencil.style.left = `${newLeft}px`;
    
    // Remove floating while typing
    this.pencilAnimation.classList.remove('floating');
    
    // Clear existing timer
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    
    // Return to floating after typing stops
    this.typingTimer = setTimeout(() => {
      this.pencilAnimation.classList.add('floating');
    }, 1000);
  }
  
  validateFeedback() {
    const feedback = this.feedbackTextarea.value.trim();
    
    if (feedback.length === 0) {
      this.showError('Please share your feedback with us.');
      return false;
    }
    
    if (feedback.length < this.minCharacters) {
      this.showError(`Please provide at least ${this.minCharacters} characters of feedback.`);
      return false;
    }
    
    this.clearError();
    return true;
  }
  
  validateForm() {
    const isValid = this.validateFeedback();
    
    if (isValid) {
      this.clearValidationState();
      this.feedbackTextarea.classList.add('success');
    }
    
    return isValid;
  }
  
  showError(message) {
    if (!this.errorElement) return;
    
    this.errorElement.textContent = message;
    this.errorElement.classList.add('show');
    this.feedbackTextarea.classList.add('error');
    this.feedbackTextarea.classList.remove('success');
    this.feedbackTextarea.focus();
  }
  
  clearError() {
    if (!this.errorElement) return;
    
    this.errorElement.classList.remove('show');
    this.feedbackTextarea.classList.remove('error');
  }
  
  clearValidationState() {
    this.feedbackTextarea.classList.remove('error', 'success');
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.validateForm()) {
      return;
    }
    
    this.setLoadingState(true);
    
    try {
      if (!this.isOnline()) {
        this.showError('You appear to be offline. Please check your internet connection and try again.');
        return;
      }
      
      const formData = {
        name: this.nameInput.value.trim() || '',
        feedback: this.feedbackTextarea.value.trim(),
        source: this.getFormSource(),
        timestamp: new Date().toISOString()
      };
      
      await this.submitWithRetry(formData);
      this.showSuccess();
      
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.message === 'SETUP_REQUIRED') {
        this.showSetupMessage();
      } else {
        this.showError('Sorry, there was a problem submitting your feedback. Please try again.');
      }
    } finally {
      this.setLoadingState(false);
    }
  }
  
  getFormSource() {
    const title = document.title;
    return title.includes('Tutor') ? 'Tutor' : 'Community';
  }
  
  async submitToGoogleSheets(formData) {
    const GOOGLE_APPS_SCRIPT_URL = window.FeedbackConfig?.GOOGLE_APPS_SCRIPT_URL;
    
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
      throw new Error('SETUP_REQUIRED');
    }
    
    formData.category = this.categorizeMessage(formData.feedback);
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    return { success: true, message: 'Feedback submitted successfully' };
  }
  
  categorizeMessage(message) {
    const text = message.toLowerCase();
    
    const categories = {
      'Teaching/Curriculum': ['teaching', 'teacher', 'lesson', 'curriculum', 'method', 'technique', 'practice', 'theory', 'homework', 'assignment', 'instructor', 'tutor'],
      'Facilities/Operations': ['room', 'building', 'space', 'equipment', 'piano', 'instrument', 'schedule', 'timing', 'booking', 'admin', 'office', 'staff'],
      'Community/Events': ['community', 'event', 'concert', 'recital', 'performance', 'social', 'group', 'ensemble', 'collaboration', 'network', 'friend', 'atmosphere'],
      'Business/Collaboration': ['business', 'partnership', 'collaborate', 'opportunity', 'revenue', 'marketing', 'promotion', 'expansion', 'growth', 'investment']
    };
    
    let maxScore = 0;
    let bestCategory = 'General/Other';
    
    for (const [category, keywords] of Object.entries(categories)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }
    
    return bestCategory;
  }
  
  async submitWithRetry(formData, retryCount = 0) {
    try {
      return await this.submitToGoogleSheets(formData);
    } catch (error) {
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        await this.delay(this.retryDelay);
        return this.submitWithRetry(formData, retryCount + 1);
      }
      throw error;
    }
  }
  
  shouldRetry(error) {
    return error.name === 'TypeError' || 
           error.message.includes('HTTP error! status: 5') || 
           error.message.includes('timeout');
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  setupOfflineDetection() {
    window.addEventListener('online', () => this.clearError());
    window.addEventListener('offline', () => {
      this.showError('You appear to be offline. Your feedback will be submitted when connection is restored.');
    });
  }
  
  isOnline() {
    return navigator.onLine;
  }
  
  showSetupMessage() {
    this.form.style.display = 'none';
    
    let setupMessage = document.getElementById('setupMessage');
    if (!setupMessage) {
      setupMessage = document.createElement('div');
      setupMessage.id = 'setupMessage';
      setupMessage.className = 'setup-message';
      setupMessage.innerHTML = `
        <h3>Setup Required</h3>
        <p>To start collecting feedback, you need to deploy the Google Apps Script backend.</p>
        <button onclick="location.reload()" class="retry-button">↻ Retry After Setup</button>
      `;
      this.form.parentNode.appendChild(setupMessage);
    }
    
    setupMessage.style.display = 'block';
  }
  
  showPaper(feedbackText) {
    if (!this.feedbackPaper || !this.handwrittenText || !this.paperOverlay) return;
    
    this.handwrittenText.textContent = feedbackText;
    this.paperOverlay.classList.add('show');
    this.feedbackPaper.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  closePaper() {
    if (!this.feedbackPaper || !this.paperOverlay) return;
    
    // Simple close animation
    this.feedbackPaper.classList.add('folding');
    
    setTimeout(() => {
      this.paperOverlay.classList.remove('show');
      this.feedbackPaper.classList.remove('show', 'folding');
      document.body.style.overflow = '';
      document.body.classList.remove('submitting');
      this.resetForm();
    }, 500);
  }
  
  setLoadingState(isLoading) {
    this.isSubmitting = isLoading;
    
    // Add/remove submitting class for CSS layering control
    if (isLoading) {
      document.body.classList.add('submitting');
    } else {
      document.body.classList.remove('submitting');
    }
    
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      
      if (isLoading) {
        this.submitButton.classList.add('loading');
        if (this.buttonText) this.buttonText.textContent = 'Sending...';
      } else {
        this.submitButton.classList.remove('loading');
        if (this.buttonText) this.buttonText.textContent = 'Send Feedback';
      }
    }
  }
  
  showSuccess() {
    const feedbackText = this.feedbackTextarea.value;
    
    // Trigger rocket launch animation
    this.launchRocket();
  }
  
  resetForm() {
    this.form.reset();
    this.updateCharacterCount();
    this.clearError();
    this.clearValidationState();
    
    if (this.successMessage) {
      this.successMessage.classList.remove('show');
    }
    
    this.form.style.display = 'flex';
    this.feedbackTextarea.focus();
  }
  
  // TEST METHOD - Remove after debugging
  testMethod() {
    console.log('Test method works!');
    return 'success';
  }
  
  launchRocket() {
    // Create rocket launch sequence
    this.createRocketFromButton(() => {
      // After rocket launches, show success and reset
      this.showRocketSuccessMessage();
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    });
  }
  
  createRocketFromButton(onComplete) {
    const submitButton = this.submitButton;
    if (!submitButton) return;
    
    // Get button position and size
    const buttonRect = submitButton.getBoundingClientRect();
    
    // Create rocket element
    const rocket = document.createElement('div');
    rocket.className = 'rocket-launch';
    rocket.innerHTML = `
      <div class="rocket-body">
        <svg viewBox="0 0 24 24" width="160" height="160">
          <!-- Rocket body -->
          <path d="M12 2c-1.5 0-3 3-3 6v5c0 1 .5 2 1.5 2h3c1 0 1.5-1 1.5-2V8c0-3-1.5-6-3-6z" fill="#F59E0B"/>
          <!-- Rocket nose -->
          <path d="M12 2c-1 0-2 1.5-2.5 3h5c-.5-1.5-1.5-3-2.5-3z" fill="#EF4444"/>
          <!-- Rocket fins -->
          <path d="M8 11l-2 2v3l2-2M16 11l2 2v3l-2-2" fill="#6366F1"/>
          <!-- Rocket window -->
          <circle cx="12" cy="8" r="1.5" fill="white"/>
          <!-- Rocket flame -->
          <path d="M10 15l2 5 2-5" fill="#EF4444" opacity="0.8"/>
          <path d="M11 16l1 3 1-3" fill="#F59E0B"/>
        </svg>
      </div>
      <div class="rocket-trail"></div>
    `;
    
    // Position rocket at button location
    rocket.style.position = 'fixed';
    rocket.style.left = buttonRect.left + (buttonRect.width / 2) + 'px';
    rocket.style.top = buttonRect.top + (buttonRect.height / 2) + 'px';
    rocket.style.transform = 'translate(-50%, -50%)';
    rocket.style.zIndex = '100000';
    
    document.body.appendChild(rocket);
    
    // Hide original button
    submitButton.style.opacity = '0';
    submitButton.style.transform = 'scale(0.8)';
    
    // Add launch effects
    this.createLaunchEffects(rocket);
    
    // Add vibration feedback for mobile devices
    this.triggerVibration();
    
    // Start rocket animation
    setTimeout(() => {
      rocket.classList.add('launching');
      
      // Complete callback after launch
      setTimeout(() => {
        if (rocket.parentNode) {
          rocket.parentNode.removeChild(rocket);
        }
        // Reset button
        submitButton.style.opacity = '';
        submitButton.style.transform = '';
        
        if (onComplete) onComplete();
      }, 2500); // Faster rocket flight duration
      
    }, 200); // Quicker launch delay
  }
  
  triggerVibration() {
    // Check if device supports vibration
    if ('vibrate' in navigator) {
      try {
        // Pattern: short buzz, pause, longer buzz for launch effect
        // [vibrate duration, pause, vibrate duration, pause, ...]
        navigator.vibrate([100, 50, 200]); // 100ms buzz, 50ms pause, 200ms buzz
      } catch (error) {
        // Vibration not supported or failed, silently continue
        console.log('Vibration not supported or failed');
      }
    }
  }
  
  createLaunchEffects(rocket) {
    // Create launch particles/smoke
    const launchPad = document.createElement('div');
    launchPad.className = 'rocket-launch-pad';
    
    // Position at rocket's starting location
    launchPad.style.position = 'fixed';
    launchPad.style.left = rocket.style.left;
    launchPad.style.top = rocket.style.top;
    launchPad.style.transform = 'translate(-50%, -50%)';
    launchPad.style.zIndex = '99999';
    
    document.body.appendChild(launchPad);
    
    // Create smoke particles
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const smoke = document.createElement('div');
        smoke.className = 'rocket-smoke';
        smoke.style.left = `${Math.random() * 40 - 20}px`;
        smoke.style.top = `${Math.random() * 20}px`;
        
        launchPad.appendChild(smoke);
        
        // Remove smoke after animation
        setTimeout(() => {
          if (smoke.parentNode) {
            smoke.parentNode.removeChild(smoke);
          }
        }, 2000);
      }, i * 100);
    }
    
    // Clean up launch pad
    setTimeout(() => {
      if (launchPad.parentNode) {
        launchPad.parentNode.removeChild(launchPad);
      }
    }, 4000);
  }
  
  showRocketSuccessMessage() {
    // Create success message with rocket theme
    const messageDiv = document.createElement('div');
    messageDiv.className = 'rocket-success-message';
    messageDiv.innerHTML = `
      <div style="font-size: 1.4em; color: #ff6b35; margin-bottom: 1rem;">
        🚀 Your Feedback Has Been Launched To Our CEO (Finn's dog Vince)!
      </div>
      <p style="color: #666; font-style: italic;">
        Vince will delicately pass it on to us with his very tiny paws. Thank you so much for taking the time and we use all feedback to make First Chord the best community it can be!
      </p>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Make message linger longer for more satisfaction
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 8000); // Doubled the display time for more finality
  }
}

// Accessibility enhancements
class AccessibilityManager {
  constructor() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderAnnouncements();
  }
  
  setupKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'input, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      element.setAttribute('tabindex', index + 1);
    });
  }
  
  setupScreenReaderAnnouncements() {
    const charCountElement = document.getElementById('charCount');
    if (charCountElement) {
      charCountElement.setAttribute('aria-live', 'polite');
    }
  }
}

// Performance optimizations
class PerformanceManager {
  constructor() {
    this.optimizeAnimations();
    this.setupIntersectionObserver();
  }
  
  optimizeAnimations() {
    if (this.isLowEndDevice()) {
      document.body.classList.add('reduced-motion');
    }
  }
  
  isLowEndDevice() {
    return navigator.hardwareConcurrency <= 2 || 
           navigator.deviceMemory <= 2 ||
           /Android.*Chrome/.test(navigator.userAgent);
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
    
    const lazyElements = document.querySelectorAll('.lazy-load');
    lazyElements.forEach(el => observer.observe(el));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    new FeedbackForm();
  } catch (error) {
    console.error('Error creating FeedbackForm:', error);
  }
  
  try {
    new AccessibilityManager();
  } catch (error) {
    console.error('Error creating AccessibilityManager:', error);
  }
  
  try {
    new PerformanceManager();
  } catch (error) {
    console.error('Error creating PerformanceManager:', error);
  }
  
  // Mobile enhancements
  if (window.innerWidth <= 768) {
    document.body.classList.add('mobile');
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      });
      
      input.addEventListener('blur', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        viewport.content = 'width=device-width, initial-scale=1.0';
      });
    });
  }
});
