  // Shared page script for pages that don't bring their own (media listings, posts, not-found).
  // Same behaviour as the designed pages: glass header, language switcher, swipeable menu, reveal on scroll.
  const nav = document.getElementById('nav');
  const hero = document.getElementById('top');
  if (hero) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - nav.offsetHeight);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  } else {
    nav.classList.add('scrolled');
  }

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

  const menus = document.getElementById('menus');
  const onMenuScroll = () => menus.classList.toggle('end', menus.scrollLeft + menus.clientWidth >= menus.scrollWidth - 4);
  menus.addEventListener('scroll', onMenuScroll, {passive:true});
  window.addEventListener('resize', onMenuScroll);
  onMenuScroll();

  // Media tabs (News / Blogs / Press), where the page has them as buttons
  const mtabs = [...document.querySelectorAll('button.mtab')];
  mtabs.forEach(t => t.addEventListener('click', () => mtabs.forEach(o => {
    const on = o === t;
    o.classList.toggle('on', on);
    o.setAttribute('aria-selected', on);
    document.getElementById('mpanel-' + o.dataset.mtab).hidden = !on;
  })));

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
