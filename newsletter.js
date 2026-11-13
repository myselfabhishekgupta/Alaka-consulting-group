// Footer newsletter subscription.
// To collect sign-ups in a Google Form/Sheet, set data-endpoint on the form to the
// form's ".../formResponse" URL and NEWSLETTER_FIELD to its email entry name.
// Until an endpoint is set, subscribing opens a pre-filled email to the team.
(function () {
  const NEWSLETTER_FIELD = 'email';
  const FALLBACK_EMAIL = 'contact@alakacg.com';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('.newsletter-form').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.newsletter-status');

    const setStatus = (msg, color) => {
      status.textContent = msg;
      status.style.color = color;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        setStatus('Please enter a valid email address.', '#e0807a');
        input.focus();
        return;
      }

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const subject = encodeURIComponent('Newsletter Subscription');
        const body = encodeURIComponent('Please subscribe ' + email + ' to the Alaka Capital Group newsletter.');
        window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + body;
        setStatus('Thanks! Please send the email to complete your subscription.', '#8fd18f');
        form.reset();
        return;
      }

      const data = new FormData();
      data.append(NEWSLETTER_FIELD, email);
      button.disabled = true;
      setStatus('Subscribing…', '#8FA0B8');

      fetch(endpoint, { method: 'POST', mode: 'no-cors', body: data })
        .then(() => {
          setStatus("You're subscribed! Watch your inbox for our next update.", '#8fd18f');
          form.reset();
        })
        .catch(() => setStatus('Something went wrong. Please try again.', '#e0807a'))
        .finally(() => { button.disabled = false; });
    });
  });
})();
