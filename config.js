// Configuration for the Music School Feedback System
window.FeedbackConfig = {
  // 🚨 IMPORTANT: Replace this with your actual Google Apps Script Web App URL
  // 
  // DEPLOYMENT STEPS:
  // 1. Go to script.google.com
  // 2. Create new project with google-apps-script.js
  // 3. Run setupSpreadsheet() function
  // 4. Deploy as Web App
  // 5. Copy the Web App URL and paste it below
  // 
  // The URL should look like:
  // https://script.google.com/macros/s/AKfycbz.../exec
  
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyPY0a0wGepuEkCm0FhDf93jV_DiBwwflqzaKScZ-s99Is-wKOcOgJ7WQiJNt3n8nmkHA/exec',
  
  // Form settings
  MIN_CHARACTERS: 10,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  
  // Success messages
  SUCCESS_MESSAGES: {
    tutor: 'Your input helps us provide better support and teaching for all our tutors.',
    community: 'Your voice helps us create a vibrant and supportive music community for everyone.',
    default: 'Thank you for helping us improve!'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    offline: 'You appear to be offline. Please check your internet connection and try again.',
    server: 'The server is temporarily unavailable. Please try again in a few moments.',
    network: 'Please check your internet connection and try again.',
    config: 'There was a configuration issue. Please contact support.',
    generic: 'Please try again, or contact us directly if the problem persists.'
  }
};
