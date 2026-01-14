# App Feedback Hub

A static website hosted on GitHub Pages for collecting feedback and support requests for iOS apps. Each app gets its own dedicated feedback page.

## Live Site

- **Homepage**: https://apps_feedback.io
- **TodoGuard Feedback**: https://apps_feedback.io/todoguard.html
- **XYZ App Feedback**: https://apps_feedback.io/xyz_app.html

## Purpose

This repository provides a simple, privacy-respecting way to collect user feedback for iOS apps. It's designed to be used as the **Support URL** in App Store Connect.

### Features

- ✅ Static HTML/CSS/JS (no backend required)
- ✅ Formspree integration for secure form submission
- ✅ Spam prevention with rate limiting (3/day, 24hr cooldown)
- ✅ Privacy-first: No analytics, cookies, or tracking
- ✅ Accessible: WCAG compliant with proper labels and keyboard navigation
- ✅ Responsive: Works on desktop and mobile
- ✅ App Store compliant: No Apple branding or impersonation

## Repository Structure

```
/apps_feedback.io
├── index.html           # Landing page listing all apps
├── todoguard.html       # TodoGuard feedback page
├── cleanupguard.html    # CleanupGuard App feedback page
├── css/
│   └── styles.css       # Shared styles
├── js/
│   ├── content.js       # Centralized content configuration
│   └── feedback.js      # Formspree AJAX handler with spam prevention
├── content/
│   └── Contact_page.md  # Design reference document
└── README.md            # This file
```

## How to Add a New App Feedback Page

1. **Add the app to `js/content.js`**:
   ```javascript
   // In the apps array:
   {
       id: 'myapp',           // URL slug (myapp.html)
       name: 'MyApp',         // Display name
       tagline: 'Your app description'
   }
   ```

2. **Copy an existing page** (e.g., `todoguard.html`)

3. **Rename it** to match the app id (e.g., `myapp.html`)

4. **Update only these items**:
   - `<title>` tag to "MyApp App Support"
   - `<meta name="description">` with your app description
   - `data-app-id` attribute on `<body>` to `"myapp"`

That's it! All other content (labels, intro text, etc.) is loaded dynamically from `content.js`.

## Spam Prevention Configuration

The form includes client-side rate limiting to prevent abuse:

**File**: `js/feedback.js`

```javascript
var COOLDOWN_HOURS = 24;           // Hours between submissions
var MAX_SUBMISSIONS_PER_DAY = 3;   // Max submissions per day
```

These settings are stored in `localStorage` and prevent excessive submissions from the same browser.

## Using as App Store Support URL

In **App Store Connect**:

1. Go to your app → **App Information**
2. Under **Support URL**, enter your feedback page URL:
   - `[https://apps_feedback/todoguard.html](https://justjais.github.io/apps_feedback/index.html)`
3. This URL will appear on your App Store listing

## Design Reference

All styling is based on the specifications in `content/Contact_page.md`. Key design elements:

- **Font**: Poppins (Google Fonts)
- **Primary Color**: `#1abc9c` (teal)
- **Layout**: Two-column on desktop, stacked on mobile
- **Form Style**: Clean inputs with focus states and dashed-border submit button

## Privacy

This website:
- Does **not** collect or store any personal data on this server
- Does **not** use cookies
- Uses `localStorage` only for spam prevention (rate limiting)
- Does **not** include any analytics or tracking scripts
- Submissions are sent to Formspree and forwarded to your email

## License

See [LICENSE](LICENSE) file for details.
