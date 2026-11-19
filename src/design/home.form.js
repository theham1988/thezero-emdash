
  // Lead forms (hero and contact section): post to this site's lead gateway
  // (/api/lead, src/lead-gateway), which checks reCAPTCHA and creates the Kommo
  // lead. Attribution comes from window.zpAttr; the Google Ads conversion fires
  // on success, as on /invest-sati.
  const LEAD_RECAPTCHA_KEY = '6Ldwts0sAAAAAJyCO0rUaBgYx5eiQM4voxaURbmV';
  const attr = key => (window.zpAttr ? window.zpAttr(key) : new URLSearchParams(location.search).get(key)) || '';
  document.querySelectorAll('form[data-zlead]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const error = f.querySelector('.form-error');
    const submit = f.querySelector('button[type="submit"]');
    const bad = [...f.querySelectorAll('[required]')].filter(i => !i.checkValidity());
    f.querySelectorAll('input').forEach(i => i.style.borderColor = '');
    error.hidden = true;
    if (bad.length) { bad.forEach(i => i.style.borderColor = '#c0392b'); bad[0].focus(); return; }
    submit.disabled = true;
    try {
      let recaptchaToken = '';
      try { recaptchaToken = await grecaptcha.enterprise.execute(LEAD_RECAPTCHA_KEY, {action: 'submit_lead'}); }
      catch (rcErr) { console.warn('reCAPTCHA failed', rcErr); }
      const payload = {
        form_id: 'website_home',
        name: f.elements.name.value, email: f.elements.email.value, phone: f.elements.phone.value,
        project: f.elements.project ? f.elements.project.value : '',
        goal: (f.querySelector('input[name="goal"]:checked') || {}).value || '',
        company: f.elements.company.value,
        recaptcha_token: recaptchaToken,
        lang_code: (document.cookie.match(/googtrans=\/en\/([^;]+)/) || [])[1] || 'en',
        page_url: location.href, landing_page: attr('landing_page'), referrer: attr('referrer'),
        utm_source: attr('utm_source'), utm_medium: attr('utm_medium'), utm_campaign: attr('utm_campaign'),
        utm_content: attr('utm_content'), utm_term: attr('utm_term'), search_term: attr('search_term'),
        gclid: attr('gclid'), gbraid: attr('gbraid'), wbraid: attr('wbraid'), gad_source: attr('gad_source')
      };
      const res = await fetch('/api/lead', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(res.status);
      f.closest('.form-card').classList.add('sent');
      if (window.gtag) gtag('event', 'conversion', {'send_to': 'AW-16593439829/bgpKCNiXypocENWYr-g9'});
    } catch (err) {
      error.hidden = false;
      submit.disabled = false;
    }
  }));
