/* ========================================
   Contact Form Handler with Supabase Integration
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  const submitButton = document.getElementById('submitButton');
  const spinner = document.getElementById('formSpinner');
  const errorMessage = document.getElementById('errorMessage');

  if (!contactForm) return;

  function isFilePreview() {
    return window.location.protocol === 'file:';
  }

  function showLocalServerError() {
    if (!errorMessage) return;
    errorMessage.textContent = 'The contact form requires a web server or Netlify deployment. Do not open contact.html directly from the file system.';
    errorMessage.hidden = false;
    submitButton.disabled = true;
  }

  if (isFilePreview()) {
    showLocalServerError();
    return;
  }

  function setLoading(isLoading) {
    if (isLoading) {
      spinner.classList.remove('spinner--hidden');
      submitButton.disabled = true;
      const label = submitButton.querySelector('.btn__text');
      if (label) label.textContent = 'Sending...';
    } else {
      spinner.classList.add('spinner--hidden');
      submitButton.disabled = false;
      const label = submitButton.querySelector('.btn__text');
      if (label) label.textContent = 'Send Message';
    }
  }

  function showError(text) {
    if (!errorMessage) return;
    errorMessage.textContent = text;
    errorMessage.hidden = false;
  }

  function clearError() {
    if (!errorMessage) return;
    errorMessage.textContent = '';
    errorMessage.hidden = true;
  }

  // Form submission handler
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    clearError();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Validate form fields
    if (!fullName || !email || !subject || !message) {
      showError('Please fill out all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    // Prepare form data (do not include columns that may not exist server-side)
    const formData = {
      full_name: fullName,
      email: email,
      subject: subject,
      message: message
    };

    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/submitContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server function error:', result);
        const errorText = result.error || 'There was an error sending your message. Please try again later.';
        showError(errorText);
        setLoading(false);
        return;
      }

      showSuccessMessage();
      contactForm.reset();
      setLoading(false);
      clearError();
      submitButton.blur();

    } catch (err) {
      console.error('Unexpected error:', err);
      showError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  });

  // Show success message function
  function showSuccessMessage() {
    successMessage.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(function() {
      successMessage.classList.remove('show');
    }, 5000);
  }

  // Add focus effects to form inputs
  const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('form-group--focused');
    });

    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('form-group--focused');
    });
  });

  // Real-time validation
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.classList.add('form-input--error');
      } else {
        this.classList.remove('form-input--error');
      }
    });

    emailInput.addEventListener('input', function() {
      this.classList.remove('form-input--error');
    });
  }
});
