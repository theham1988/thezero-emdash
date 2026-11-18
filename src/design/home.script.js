
  // Nav background on scroll
  const nav = document.getElementById('nav');
  const hero = document.getElementById('top');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - nav.offsetHeight);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Language switcher: Google Translate, the same engine behind the original site's GTranslate widget.
  // The choice is stored in Google's "googtrans" cookie, then the page reloads in that language.
  const lang = document.getElementById('lang');
  const langBtn = document.getElementById('langBtn');
  const langOptions = [...lang.querySelectorAll('[data-lang]')];
  const currentLang = (document.cookie.match(/googtrans=\/en\/([^;]+)/) || [])[1] || 'en';
  const shown = langOptions.find(o => o.dataset.lang === currentLang) || langOptions[0];
  document.getElementById('langFlag').src = shown.querySelector('img').src;
  document.getElementById('langCode').textContent = shown.dataset.code;
  langOptions.forEach(o => o.setAttribute('aria-selected', o === shown));
  const setLangMenu = open => { lang.classList.toggle('open', open); langBtn.setAttribute('aria-expanded', open); };
  langBtn.addEventListener('click', e => { e.stopPropagation(); setLangMenu(!lang.classList.contains('open')); });
  document.addEventListener('click', e => { if (!lang.contains(e.target)) setLangMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lang.classList.contains('open')) { setLangMenu(false); langBtn.focus(); } });
  const writeCookie = value => {
    const age = value ? '' : ';max-age=0';
    ['', `;domain=${location.hostname}`, `;domain=.${location.hostname}`].forEach(d => {
      document.cookie = `googtrans=${value}${age};path=/${d}`;
    });
  };
  langOptions.forEach(o => o.addEventListener('click', () => {
    setLangMenu(false);
    if (o.dataset.lang === currentLang) return;
    writeCookie(o.dataset.lang === 'en' ? '' : `/en/${o.dataset.lang}`);
    location.reload();
  }));
  window.googleTranslateElementInit = () => new google.translate.TranslateElement({
    pageLanguage: 'en', includedLanguages: 'en,th,pl,zh-CN,ru,ar', autoDisplay: false
  }, 'google_translate_element');

  // Swipeable menu row on small screens: drop the edge fade once scrolled to the end
  const menus = document.getElementById('menus');
  const onMenuScroll = () => menus.classList.toggle('end', menus.scrollLeft + menus.clientWidth >= menus.scrollWidth - 4);
  menus.addEventListener('scroll', onMenuScroll, {passive:true});
  window.addEventListener('resize', onMenuScroll);
  onMenuScroll();

  // Highlight the menu item for the section in view (and keep it visible in the swipe row)
  const spyLinks = document.querySelectorAll('[data-spy]');
  const spyIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    spyLinks.forEach(a => {
      const on = a.dataset.spy === e.target.id;
      a.classList.toggle('active', on);
      if (on && menus.scrollWidth > menus.clientWidth) {
        const r = a.getBoundingClientRect(), m = menus.getBoundingClientRect();
        menus.scrollBy({left: r.left - m.left - (m.width - r.width) / 2, behavior: 'smooth'});
      }
    });
  }), {rootMargin: '-45% 0px -50% 0px'});
  ['top', 'about', 'projects', 'lifestyle', 'contact'].forEach(id => spyIO.observe(document.getElementById(id)));
  
  // Hero slider
  const slides = [...document.querySelectorAll('.slide')];
  const sub = document.getElementById('heroSub');
  const cta = document.getElementById('heroCta');
  const dotsWrap = document.getElementById('heroDots');
  const load = s => { if (!s.style.backgroundImage) s.style.backgroundImage = `url("${s.dataset.bg}")`; };
  let current = 0, timer;
  const dots = slides.map((s, i) => {
    const d = document.createElement('button');
    d.className = 'dot'; d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(d);
    return d;
  });
  const go = i => {
    current = (i + slides.length) % slides.length;
    load(slides[current]); load(slides[(current + 1) % slides.length]);
    slides.forEach((s, j) => s.classList.toggle('active', j === current));
    dots.forEach((d, j) => d.classList.toggle('active', j === current));
    sub.classList.add('fade');
    setTimeout(() => { sub.textContent = slides[current].dataset.sub; sub.classList.remove('fade'); }, 250);
    cta.href = slides[current].dataset.href;
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(current + 1), 6000); };
  go(0); restart();

  // Reveal on scroll
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Count-up KPIs
  const countIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = el.dataset.prefix + v + el.dataset.suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); countIO.unobserve(el);
  }), {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  // Unit tabs
  const showTab = name => {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.units').forEach(u => u.classList.toggle('active', u.id === 'tab-' + name));
  };
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));

  // Pre-select project in the form
  document.querySelectorAll('[data-project]').forEach(a => a.addEventListener('click', () => {
    document.getElementById('project').value = a.dataset.project;
  }));

  // Investment: unit layouts slider
  const islides = document.getElementById('islides');
  const islideList = [...islides.children];
  const iprev = document.getElementById('iprev');
  const inext = document.getElementById('inext');
  const idots = document.getElementById('idots');
  idots.replaceChildren(...islideList.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', s.querySelector('img').alt.replace(' interior and floor plan', ''));
    b.addEventListener('click', () => islides.scrollTo({left: i * islides.clientWidth, behavior: 'smooth'}));
    return b;
  }));
  const syncI = () => {
    const i = Math.round(islides.scrollLeft / islides.clientWidth);
    [...idots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    iprev.disabled = i === 0;
    inext.disabled = i === islideList.length - 1;
  };
  iprev.addEventListener('click', () => islides.scrollBy({left: -islides.clientWidth, behavior: 'smooth'}));
  inext.addEventListener('click', () => islides.scrollBy({left: islides.clientWidth, behavior: 'smooth'}));
  islides.addEventListener('scroll', syncI, {passive: true});
  window.addEventListener('resize', syncI);
  syncI();

  // Testimonials: glass carousel with page dots and a "Read more" popup
  const ttrack = document.getElementById('ttrack');
  const tcards = [...ttrack.querySelectorAll('.tcard')];
  const tdots = document.getElementById('tdots');
  const tprev = document.getElementById('tprev');
  const tnext = document.getElementById('tnext');
  const perView = () => Math.max(1, Math.round(ttrack.clientWidth / tcards[0].offsetWidth));
  let tpages = 0;
  const buildDots = () => {
    const n = Math.ceil(tcards.length / perView());
    if (n === tpages) return;
    tpages = n;
    if (n > 8) { // one card per view on phones: a counter reads better than 18 dots
      const counter = document.createElement('span');
      counter.className = 'tcount';
      tdots.replaceChildren(counter);
      return;
    }
    tdots.replaceChildren(...Array.from({length: n}, (_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Testimonials page ${i + 1}`);
      b.addEventListener('click', () => {
        const card = tcards[Math.min(i * perView(), tcards.length - 1)];
        ttrack.scrollTo({left: card.offsetLeft - tcards[0].offsetLeft, behavior: 'smooth'});
      });
      return b;
    }));
  };
  const syncT = () => {
    const atEnd = ttrack.scrollLeft + ttrack.clientWidth >= ttrack.scrollWidth - 4;
    const first = Math.round(ttrack.scrollLeft / (tcards[0].offsetWidth + 24));
    const page = atEnd ? tpages - 1 : Math.floor(first / perView());
    const counter = tdots.querySelector('.tcount');
    if (counter) counter.textContent = `${page + 1} / ${tpages}`;
    else [...tdots.children].forEach((d, i) => d.classList.toggle('on', i === page));
    tprev.disabled = ttrack.scrollLeft <= 4;
    tnext.disabled = atEnd;
  };
  const markMore = () => tcards.forEach(c => {
    const t = c.querySelector('.tcard-text');
    c.querySelector('.tcard-more').hidden = t.scrollHeight <= t.clientHeight + 2;
  });
  tprev.addEventListener('click', () => ttrack.scrollBy({left: -ttrack.clientWidth, behavior: 'smooth'}));
  tnext.addEventListener('click', () => ttrack.scrollBy({left: ttrack.clientWidth, behavior: 'smooth'}));
  ttrack.addEventListener('scroll', syncT, {passive: true});
  window.addEventListener('resize', () => { buildDots(); markMore(); syncT(); });
  buildDots(); markMore(); syncT();
  if (document.fonts) document.fonts.ready.then(markMore);

  const tmodal = document.getElementById('tmodal');
  const tmodalBody = document.getElementById('tmodalBody');
  tcards.forEach(c => c.querySelector('.tcard-more').addEventListener('click', () => {
    tmodalBody.replaceChildren(...['.tcard-q', '.tcard-text', '.tcard-author'].map(s => c.querySelector(s).cloneNode(true)));
    tmodal.showModal();
    tmodalBody.scrollTop = 0;
  }));
  document.getElementById('tmodalClose').addEventListener('click', () => tmodal.close());
  tmodal.addEventListener('click', e => { if (e.target === tmodal) tmodal.close(); });
