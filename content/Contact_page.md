# AI Prompt: Create a Contact/Feedback Page

## Overview
Create a professional contact/feedback page for a static GitHub Pages website with:
1. **Feedback Form** - Sends emails via Formspree with spam prevention
2. **Newsletter Subscription** - Collects emails via Buttondown
3. **Responsive design** with modern aesthetics

---

## Design Requirements

### Layout
- Two-column layout: Left sidebar (profile) + Right content area
- Mobile responsive (stacks vertically on small screens)
- Clean, minimal design with teal/turquoise accent color (#1abc9c)

### Color Palette
```css
--primary-accent: #1abc9c;     /* Teal - buttons, highlights */
--success-bg: #d4edda;         /* Light green - success messages */
--success-text: #155724;       /* Dark green - success text */
--error-bg: #f8d7da;           /* Light red - error messages */
--error-text: #721c24;         /* Dark red - error text */
--warning-bg: #fff3cd;         /* Light yellow - warning messages */
--warning-text: #856404;       /* Dark yellow - warning text */
--dark-input-bg: #2d2d2d;      /* Dark gray - newsletter input */
```

### Typography
- Font: Poppins (Google Fonts)
- Heading: Bold, large
- Body: Regular weight, readable

---

## Component 1: Feedback Form (Formspree)

### Features Required
- Fields: Name, Email, Location, Subject, Message
- AJAX submission (no page reload)
- Rate limiting: 24-hour cooldown, max 3 per day
- Success/error/warning messages
- Loading state on button

### HTML Structure
```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="text" name="location" placeholder="Where are You From?">
  <input type="text" name="_subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
  <div id="form-status"></div>
  <button type="submit" id="submit-btn">Send</button>
</form>
```

### JavaScript Logic
```javascript
// Rate limiting with localStorage
var COOLDOWN_HOURS = 24;
var MAX_SUBMISSIONS_PER_DAY = 3;
var STORAGE_KEY = 'contact_form_submissions';

function canSubmit() {
  var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"submissions":[],"lastSubmit":0}');
  var now = Date.now();
  var cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
  
  if (data.lastSubmit && (now - data.lastSubmit) < cooldownMs) {
    var remainingHours = Math.ceil((cooldownMs - (now - data.lastSubmit)) / 3600000);
    return { allowed: false, reason: 'Wait ' + remainingHours + ' hour(s)' };
  }
  
  var today = new Date().toDateString();
  var todayCount = data.submissions.filter(s => new Date(s).toDateString() === today).length;
  if (todayCount >= MAX_SUBMISSIONS_PER_DAY) {
    return { allowed: false, reason: 'Daily limit reached' };
  }
  return { allowed: true };
}

function recordSubmission() {
  var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"submissions":[],"lastSubmit":0}');
  data.submissions.push(Date.now());
  data.lastSubmit = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// AJAX submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  var check = canSubmit();
  if (!check.allowed) { showWarning(check.reason); return; }
  
  showLoading();
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      recordSubmission();
      showSuccess('Thank you! Message sent.');
      form.reset();
    } else throw new Error();
  })
  .catch(() => showError('Something went wrong.'));
});
```

---

## Component 2: Newsletter (Buttondown)

### HTML Structure
```html
<form id="newsletter-form">
  <input type="email" name="email" placeholder="Email Address" required>
  <button type="submit">Subscribe</button>
  <p style="text-align: center;">Subscribe to get notified about new posts</p>
  <div id="newsletter-status"></div>
</form>
```

### JavaScript Logic
```javascript
function handleNewsletterSubmit(e) {
  e.preventDefault();
  var email = document.getElementById('newsletter-email').value;
  
  if (!email.includes('@')) {
    showError('Invalid email'); return;
  }
  
  showLoading();
  fetch('https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'email=' + encodeURIComponent(email)
  })
  .then(response => {
    if (response.ok) showSuccess('Check email to confirm!');
    else if (response.status === 409) showWarning('Already subscribed!');
    else throw new Error();
  })
  .catch(() => window.open('https://buttondown.email/YOUR_USERNAME'));
}
```

---

## CSS Patterns

### Form Input Styling
```css
.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}
.form-control:focus {
  border-color: #1abc9c;
  outline: none;
}
```

### Submit Button
```css
.load-more-button {
  background: transparent;
  border: 2px dashed #1abc9c;
  color: #1abc9c;
  padding: 12px 40px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}
.load-more-button:hover {
  background: #1abc9c;
  color: white;
  border-style: solid;
}
```

### Newsletter Subscribe Bar
```css
.subscribe-form {
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
}
.subscribe-form .text-input {
  flex: 1;
  background: #2d2d2d;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 50px 0 0 50px;
}
.subscribe-form .submit-btn {
  background: #1abc9c;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
}
```

### Status Messages
```css
.status-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}
.status-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.status-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}
```

---

## Setup Requirements

### 1. Formspree (Contact Form)
1. Create account at https://formspree.io
2. Create new form, get endpoint URL
3. Replace `YOUR_FORM_ID` in form action

### 2. Buttondown (Newsletter)
1. Create account at https://buttondown.email
2. Get your username
3. Replace `YOUR_USERNAME` in JavaScript

### 3. Dependencies
- Font Awesome (for icons)
- Google Fonts (Poppins)
- Bootstrap grid (optional, for responsive layout)
