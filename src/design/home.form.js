
  // Lead form: sent to Kommo through the same webhook, pipeline and field
  // mapping as the /invest-sati landing page, with the same reCAPTCHA check,
  // attribution (window.zpAttr) and Google Ads conversion on success.
  const LEAD_WEBHOOK = 'https://data.widgets.wearekwid.com/api/webhook/33730819/374a68ae75fbccee3f35a0f97f0c0d84e28a7d66699039acf73823192c17743e';
  const LEAD_PIPELINE = 9914723;
  const LEAD_RECAPTCHA_KEY = '6Ldwts0sAAAAAJyCO0rUaBgYx5eiQM4voxaURbmV';
  const LEAD_PROJECTS = {
    'Silhouette by The Zero': {property: 'The Zero Nai Yang', tag: 'Pref Nai Yang', key: 'naiyang'},
    'The Zero Bang Tao': {property: 'The Zero Bangtao', tag: 'Pref Bang Tao', key: 'bangtao'},
    'Both / not sure yet': {property: 'Both Projects', tag: 'Pref Both', key: 'both'}
  };
  const attr = key => (window.zpAttr ? window.zpAttr(key) : new URLSearchParams(location.search).get(key)) || '';
  document.getElementById('leadForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const error = document.getElementById('formError');
    const submit = f.querySelector('button[type="submit"]');
    const bad = [...f.querySelectorAll('[required]')].filter(i => !i.checkValidity());
    f.querySelectorAll('input').forEach(i => i.style.borderColor = '');
    error.hidden = true;
    if (bad.length) { bad.forEach(i => i.style.borderColor = '#c0392b'); bad[0].focus(); return; }
    if (f.company.value) { document.getElementById('formCard').classList.add('sent'); return; } // spam trap
    submit.disabled = true;
    try {
      let recaptchaToken = '';
      try { recaptchaToken = await grecaptcha.enterprise.execute(LEAD_RECAPTCHA_KEY, {action: 'submit_lead'}); }
      catch (rcErr) { console.warn('reCAPTCHA failed', rcErr); }
      const project = LEAD_PROJECTS[f.project.value] || LEAD_PROJECTS['Both / not sure yet'];
      const goal = (f.querySelector('input[name="goal"]:checked') || {}).value || '';
      const campaign = attr('utm_campaign');
      const payload = {
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        pipeline_id: LEAD_PIPELINE,
        tags: ['Website', 'Homepage', project.tag, campaign || 'direct'].join(','),
        recaptcha_token: recaptchaToken,
        custom_fields: {
          '1313037': project.property,
          '1313039': '',
          '1313041': goal,
          '1313043': 'website_home',
          '1313045': campaign,
          '1313047': attr('utm_source'),
          'is_agent': 'No',
          'language': 'English'
        },
        metadata: {
          form_id: 'website_home',
          form_name: 'The Zero Phuket - Website Homepage',
          project_preference: project.key,
          page_url: location.href,
          gclid: attr('gclid'), gbraid: attr('gbraid'), wbraid: attr('wbraid'), gad_source: attr('gad_source'),
          utm_source: attr('utm_source'), utm_medium: attr('utm_medium'), utm_campaign: campaign,
          utm_content: attr('utm_content'), utm_term: attr('utm_term'), landing_page: attr('landing_page'),
          submitted_at: new Date().toISOString(),
          language: (document.cookie.match(/googtrans=\/en\/([^;]+)/) || [])[1] || 'en'
        }
      };
      const res = await fetch(LEAD_WEBHOOK, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
      if (!res.ok) throw new Error(res.status);
      document.getElementById('formCard').classList.add('sent');
      if (window.gtag) gtag('event', 'conversion', {'send_to': 'AW-16593439829/bgpKCNiXypocENWYr-g9'});
    } catch (err) {
      error.hidden = false;
      submit.disabled = false;
    }
  });
