
  // Website lead forms: any <form data-lead-form="form_id"> posts to this site's
  // lead gateway (/api/lead), which checks reCAPTCHA and creates the Kommo lead.
  // Attribution comes from window.zpAttr; the Google Ads conversion fires on success.
  (function () {
    const KEY = '6Ldwts0sAAAAAJyCO0rUaBgYx5eiQM4voxaURbmV';
    const attr = key => (window.zpAttr ? window.zpAttr(key) : new URLSearchParams(location.search).get(key)) || '';
    document.querySelectorAll('form[data-lead-form]').forEach(f => f.addEventListener('submit', async e => {
      e.preventDefault();
      const card = f.closest('.form-card');
      const error = f.querySelector('.form-error');
      const submit = f.querySelector('button[type="submit"]');
      const bad = [...f.querySelectorAll('[required]')].filter(i => !i.checkValidity());
      f.querySelectorAll('input,select').forEach(i => i.style.borderColor = '');
      error.hidden = true;
      if (bad.length) { bad.forEach(i => i.style.borderColor = '#c0392b'); bad[0].focus(); return; }
      submit.disabled = true;
      try {
        let token = '';
        try { token = await grecaptcha.enterprise.execute(KEY, {action: 'submit_lead'}); } catch (rcErr) { console.warn('reCAPTCHA failed', rcErr); }
        const val = n => (f.elements[n] && f.elements[n].value) || '';
        const payload = {
          form_id: f.dataset.leadForm,
          name: val('name'), email: val('email'), phone: val('phone'),
          project: f.dataset.project || val('project'),
          goal: val('goal'),
          is_agent: (f.querySelector('input[name="is_agent"]:checked') || {}).value || 'No',
          company: val('company'),
          recaptcha_token: token,
          lang_code: (document.cookie.match(/googtrans=\/en\/([^;]+)/) || [])[1] || 'en',
          page_url: location.href, landing_page: attr('landing_page'), referrer: attr('referrer'),
          utm_source: attr('utm_source'), utm_medium: attr('utm_medium'), utm_campaign: attr('utm_campaign'),
          utm_content: attr('utm_content'), utm_term: attr('utm_term'), search_term: attr('search_term'),
          gclid: attr('gclid'), gbraid: attr('gbraid'), wbraid: attr('wbraid'), gad_source: attr('gad_source')
        };
        const res = await fetch('/api/lead', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) throw new Error(res.status);
        card.classList.add('sent');
        if (window.gtag) gtag('event', 'conversion', {'send_to': 'AW-16593439829/bgpKCNiXypocENWYr-g9'});
      } catch (err) {
        error.hidden = false;
        submit.disabled = false;
      }
    }));

    // Gallery lightbox: click a tile to enlarge, arrow keys to move
    const box = document.getElementById('lightbox');
    if (box) {
      const tiles = [...document.querySelectorAll('.gallery [data-full]')];
      const img = box.querySelector('img'), cap = box.querySelector('[data-caption]');
      let at = 0;
      const show = i => { at = (i + tiles.length) % tiles.length; img.src = tiles[at].dataset.full; img.alt = tiles[at].dataset.alt; cap.textContent = tiles[at].dataset.alt; };
      tiles.forEach((t, i) => t.addEventListener('click', () => { show(i); box.showModal(); }));
      box.querySelector('[data-prev]').addEventListener('click', () => show(at - 1));
      box.querySelector('[data-next]').addEventListener('click', () => show(at + 1));
      box.querySelector('[data-close]').addEventListener('click', () => box.close());
      box.addEventListener('click', e => { if (e.target === box) box.close(); });
      box.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    }
  })();
