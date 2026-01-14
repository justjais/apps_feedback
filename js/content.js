/**
 * App Feedback - Static Content Configuration
 * ============================================
 * All static text content is defined here in one place.
 * Update values here to change them across all pages.
 */

var APP_CONTENT = {

    /* ========================================
       Site-Wide Content
       ======================================== */
    site: {
        title: 'App Feedback Hub',
        subtitle: 'Submit feedback and support requests for our iOS apps',
        description: 'Central hub for app support and feedback.',

        // Index page intro paragraphs
        introLine1: 'Welcome to our app feedback hub. This site hosts support and feedback pages for our iOS applications. Select an app below to submit your feedback, report issues, or suggest improvements.',
        introLine2: 'We read every message and appreciate your input in making our apps better.',

        // Section headings
        availableAppsHeading: 'Available Apps',

        // Footer
        privacyNote: 'Your feedback is sent securely. We do not store your data on this website.',
        indexPrivacyNote: 'All feedback is sent securely via Formspree. No data is stored on this website.'
    },

    /* ========================================
       Form Labels & Placeholders
       ======================================== */
    form: {
        // Labels
        nameLabel: 'Name',
        emailLabel: 'Email',
        subjectLabel: 'Subject',
        messageLabel: 'Message',
        optionalText: '(optional)',
        requiredSymbol: '*',

        // Placeholders
        namePlaceholder: 'Your name',
        emailPlaceholder: 'your@email.com',
        subjectPlaceholder: 'Brief summary of your feedback',
        messagePlaceholder: 'Describe your feedback, issue, or suggestion in detail...',

        // Button text
        submitButtonText: 'Share Feedback',
        submittingButtonText: 'Sending...',

        // Status messages
        successMessage: 'Thank you! Your feedback has been shared successfully.',
        errorMessage: 'Something went wrong. Please try again later.',
        cooldownMessage: 'Please wait {hours} hour(s) before submitting again.',
        dailyLimitMessage: 'You have reached the daily submission limit. Please try again tomorrow.'
    },

    /* ========================================
       App-Specific Intro Text Template
       ======================================== */
    appIntro: {
        // Use {appName} as placeholder - will be replaced dynamically
        line1: 'This page is used to collect feedback and support requests for the {appName} iOS app.',
        line2: 'If you\'re using {appName} and would like to report an issue, suggest an improvement, or share feedback about the app experience, please use the form below.',
        line3: 'We read every message.'
    },

    /* ========================================
       Navigation
       ======================================== */
    navigation: {
        backToAppList: 'Back to App List'
    },

    /* ========================================
       App Registry
       Define all apps here. Each app needs:
       - id: URL slug (e.g., 'todoguard' for todoguard.html)
       - name: Display name
       - tagline: Short description shown in sidebar and app list
       ======================================== */
    apps: [
        {
            id: 'todoguard',
            name: 'TodoGuard',
            tagline: 'Daily TODOs management with smart reminders'
        },
        {
            id: 'cleanupguard',
            name: 'CleanupGuard',
            tagline: 'Smart cleanup for your iOS device'
        }
    ]
};

/* ========================================
   Helper Functions
   ======================================== */

/**
 * Get app configuration by ID
 * @param {string} appId - The app ID (slug)
 * @returns {Object|null} App configuration object or null
 */
function getAppById(appId) {
    for (var i = 0; i < APP_CONTENT.apps.length; i++) {
        if (APP_CONTENT.apps[i].id === appId) {
            return APP_CONTENT.apps[i];
        }
    }
    return null;
}

/**
 * Replace placeholders in text with app name
 * @param {string} text - Text containing {appName} placeholder
 * @param {string} appName - App name to substitute
 * @returns {string} Text with placeholder replaced
 */
function replaceAppName(text, appName) {
    return text.replace(/\{appName\}/g, appName);
}

/**
 * Get formatted intro text for an app
 * @param {string} appName - The app name
 * @returns {Object} Object with line1, line2, line3 properties
 */
function getAppIntroText(appName) {
    return {
        line1: replaceAppName(APP_CONTENT.appIntro.line1, appName),
        line2: replaceAppName(APP_CONTENT.appIntro.line2, appName),
        line3: APP_CONTENT.appIntro.line3
    };
}
