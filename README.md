# First Chord Music School - Feedback Tool 🎵

A beautiful, interactive feedback form designed for First Chord Music School featuring rocket launch animations and mobile-first design.

![First Chord Music School](https://live.staticflickr.com/65535/52772228045_de8eac47f2_k.jpg)

## ✨ Features

- **🎨 Beautiful Design**: Full-width header image with bold Poppins typography
- **📱 Mobile-First**: Responsive design optimized for mobile devices
- **🚀 Rocket Animation**: Custom SVG rocket with smooth launch animation and mobile vibration
- **🎵 Brand Colors**: Integrated First Chord color palette throughout
- **⚡ Fast & Smooth**: 2.5s rocket launch with 8s success message
- **♿ Accessible**: ARIA labels, keyboard navigation, and screen reader support
- **🔐 Secure**: Google Apps Script backend integration

## 🎯 User Experience

1. **Hero Image**: Immediate brand recognition with full-width school photo
2. **Simple Question**: "What's On Your Mind?" in bold, friendly typography  
3. **Clean Form**: Optional name field and spacious feedback textarea
4. **Rocket Launch**: Submit button transforms into animated rocket
5. **Mobile Haptics**: Phone vibration feedback on launch
6. **Success Message**: Branded confirmation with school mission

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Typography**: Poppins (headings), Inter (body text)
- **Animation**: CSS keyframes with cubic-bezier easing
- **Backend**: Google Apps Script (configured separately)
- **Mobile**: Vibration API, responsive viewport
- **Accessibility**: WCAG 2.1 compliant

## 🚀 Quick Start

1. Clone this repository
2. Configure `config.js` with your Google Apps Script URL
3. Open `community-feedback.html` in a web browser
4. For mobile testing, serve locally and access via IP address

## 📁 File Structure

```
feedback-tool/
├── community-feedback.html    # Main feedback form
├── styles.css                # Base styles and responsive design  
├── script.js                 # Form logic and rocket animation
├── config.js                 # Backend configuration
├── .gitignore                # Git ignore patterns
└── README.md                 # This file
```

## 🎨 Brand Integration

- **Primary Color**: #6366F1 (Indigo)
- **Warning Color**: #F59E0B (Amber) 
- **Danger Color**: #EF4444 (Red)
- **Success Color**: #10B981 (Emerald)
- **Typography**: Poppins 800 weight for headers
- **Logo**: Full-width hero image integration

## 🔧 Customization

The feedback form is highly customizable:

- **Colors**: Update CSS custom properties in `:root`
- **Animation**: Modify keyframes in CSS or timing in JavaScript
- **Content**: Change text, placeholders, and success messages
- **Branding**: Replace hero image and school information

## 🌟 First Chord Music School

**Mission**: Exploring Music Together

This feedback tool embodies our commitment to community, creativity, and musical excellence. Every submission helps us build a stronger, more vibrant learning environment for students of all ages.

---

Built with ❤️ for the First Chord Music School community
