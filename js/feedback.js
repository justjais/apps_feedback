/**
 * Feedback Form Handler
 * =====================
 * Handles form submission via Formspree AJAX
 * Includes client-side spam prevention with rate limiting
 */

/* ========================================
   CONFIGURATION
   Change the Formspree endpoint below to
   update where feedback is sent.
   ======================================== */
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjggvnzz';

/* ========================================
   Spam Prevention Configuration
   ======================================== */
var COOLDOWN_HOURS = 24;           // Hours between submissions from same browser
var MAX_SUBMISSIONS_PER_DAY = 3;   // Max submissions per day from same browser
var STORAGE_KEY = 'feedback_form_submissions';

/* ========================================
   Rate Limiting Functions
   ======================================== */

/**
 * Check if user can submit based on rate limits
 * @returns {Object} { allowed: boolean, reason?: string }
 */
function canSubmit() {
    try {
        var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"submissions": [], "lastSubmit": 0}');
        var now = Date.now();
        var cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;

        // Check cooldown from last submission
        if (data.lastSubmit && (now - data.lastSubmit) < cooldownMs) {
            var remainingHours = Math.ceil((cooldownMs - (now - data.lastSubmit)) / (60 * 60 * 1000));
            return {
                allowed: false,
                reason: APP_CONTENT.form.cooldownMessage.replace('{hours}', remainingHours)
            };
        }

        // Check daily submission limit
        var today = new Date().toDateString();
        var todaySubmissions = data.submissions.filter(function (s) {
            return new Date(s).toDateString() === today;
        });

        if (todaySubmissions.length >= MAX_SUBMISSIONS_PER_DAY) {
            return {
                allowed: false,
                reason: APP_CONTENT.form.dailyLimitMessage
            };
        }

        return { allowed: true };
    } catch (e) {
        // Allow submission if localStorage fails (e.g., private browsing)
        return { allowed: true };
    }
}

/**
 * Record a successful submission for rate limiting
 */
function recordSubmission() {
    try {
        var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"submissions": [], "lastSubmit": 0}');
        data.submissions.push(Date.now());
        data.lastSubmit = Date.now();

        // Keep only last 30 days of data to prevent localStorage bloat
        var thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        data.submissions = data.submissions.filter(function (s) {
            return s > thirtyDaysAgo;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        // Ignore localStorage errors (e.g., quota exceeded)
    }
}

/* ========================================
   Form Initialization
   ======================================== */
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('feedback-form');
    if (form) {
        initFeedbackForm(form);
    }
});

/**
 * Initialize the feedback form with Formspree AJAX submission
 * @param {HTMLFormElement} form - The feedback form element
 */
function initFeedbackForm(form) {
    var submitBtn = form.querySelector('.btn-submit');
    var formStatus = document.getElementById('form-status');
    var originalBtnText = submitBtn ? submitBtn.innerHTML : APP_CONTENT.form.submitButtonText;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check rate limiting first
        var submitCheck = canSubmit();
        if (!submitCheck.allowed) {
            showStatus(formStatus, 'warning', submitCheck.reason);
            return false;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = APP_CONTENT.form.submittingButtonText;
            submitBtn.disabled = true;
        }
        hideStatus(formStatus);

        // Get app name for subject prefix
        var appName = form.dataset.appName || 'App';
        var subjectField = form.querySelector('#subject');
        var originalSubject = subjectField ? subjectField.value : '';

        // Temporarily modify subject to include app name prefix
        if (subjectField && originalSubject) {
            subjectField.value = '[' + appName + ' App Feedback] ' + originalSubject;
        }

        // Prepare form data
        var formData = new FormData(form);

        // Track if submission was successful (to know whether to restore subject)
        var submissionSucceeded = false;

        // Send via AJAX to Formspree
        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ok) {
                    // Success - record submission and show message
                    submissionSucceeded = true;
                    recordSubmission();
                    showStatus(formStatus, 'success',
                        APP_CONTENT.form.successMessage);
                    form.reset();
                } else {
                    // Error from Formspree
                    throw new Error('Form submission failed');
                }
            })
            .catch(function (error) {
                // Error - show error message
                showStatus(formStatus, 'error',
                    APP_CONTENT.form.errorMessage);
            })
            .finally(function () {
                // Reset button state
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
                // Only restore original subject if submission failed
                // (on success, form.reset() already cleared it)
                if (!submissionSucceeded && subjectField) {
                    subjectField.value = originalSubject;
                }
            });
    });
}

/* ========================================
   Status Message Functions
   ======================================== */

/**
 * Show status message to user
 * @param {HTMLElement} statusEl - The status container element
 * @param {string} type - Message type: 'success', 'error', or 'warning'
 * @param {string} message - The message to display
 */
function showStatus(statusEl, type, message) {
    if (!statusEl) return;

    // Remove previous classes
    statusEl.classList.remove('status-success', 'status-error', 'status-warning');

    // Add appropriate class and show
    statusEl.classList.add('status-' + type, 'visible');
    statusEl.textContent = message;
    statusEl.style.display = 'block';

    // Scroll status into view
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide the status message
 * @param {HTMLElement} statusEl - The status container element
 */
function hideStatus(statusEl) {
    if (!statusEl) return;
    statusEl.style.display = 'none';
    statusEl.classList.remove('visible');
}
