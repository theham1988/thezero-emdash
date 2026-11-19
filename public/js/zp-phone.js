/*
 * Phone field with a country-code picker, for the website lead forms.
 * Same behaviour as the picker on /invest-sati and /live-sati: the country is
 * pre-selected from the visitor's location, the number is checked against that
 * country's length, and the form sends one full international number (+66812345678).
 *
 * Any <input type="tel" name="phone"> inside form[data-zlead] or form[data-lead-form]
 * is upgraded. The form scripts call window.zpPhone.check(form) before sending.
 */
(function () {
  const COUNTRIES=[['AF','Afghanistan','+93'],['AL','Albania','+355'],['DZ','Algeria','+213'],['AD','Andorra','+376'],['AO','Angola','+244'],['AR','Argentina','+54'],['AM','Armenia','+374'],['AU','Australia','+61'],['AT','Austria','+43'],['AZ','Azerbaijan','+994'],['BH','Bahrain','+973'],['BD','Bangladesh','+880'],['BY','Belarus','+375'],['BE','Belgium','+32'],['BZ','Belize','+501'],['BO','Bolivia','+591'],['BA','Bosnia & Herzegovina','+387'],['BR','Brazil','+55'],['BN','Brunei','+673'],['BG','Bulgaria','+359'],['KH','Cambodia','+855'],['CM','Cameroon','+237'],['CA','Canada','+1'],['CL','Chile','+56'],['CN','China','+86'],['CO','Colombia','+57'],['CR','Costa Rica','+506'],['HR','Croatia','+385'],['CU','Cuba','+53'],['CY','Cyprus','+357'],['CZ','Czechia','+420'],['DK','Denmark','+45'],['EC','Ecuador','+593'],['EG','Egypt','+20'],['EE','Estonia','+372'],['ET','Ethiopia','+251'],['FI','Finland','+358'],['FR','France','+33'],['GE','Georgia','+995'],['DE','Germany','+49'],['GH','Ghana','+233'],['GR','Greece','+30'],['GT','Guatemala','+502'],['HK','Hong Kong','+852'],['HU','Hungary','+36'],['IS','Iceland','+354'],['IN','India','+91'],['ID','Indonesia','+62'],['IR','Iran','+98'],['IQ','Iraq','+964'],['IE','Ireland','+353'],['IL','Israel','+972'],['IT','Italy','+39'],['JP','Japan','+81'],['JO','Jordan','+962'],['KZ','Kazakhstan','+7'],['KE','Kenya','+254'],['KR','South Korea','+82'],['KW','Kuwait','+965'],['KG','Kyrgyzstan','+996'],['LA','Laos','+856'],['LV','Latvia','+371'],['LB','Lebanon','+961'],['LY','Libya','+218'],['LT','Lithuania','+370'],['LU','Luxembourg','+352'],['MO','Macao','+853'],['MY','Malaysia','+60'],['MV','Maldives','+960'],['MT','Malta','+356'],['MX','Mexico','+52'],['MD','Moldova','+373'],['MC','Monaco','+377'],['MN','Mongolia','+976'],['ME','Montenegro','+382'],['MA','Morocco','+212'],['MZ','Mozambique','+258'],['MM','Myanmar','+95'],['NA','Namibia','+264'],['NP','Nepal','+977'],['NL','Netherlands','+31'],['NZ','New Zealand','+64'],['NI','Nicaragua','+505'],['NG','Nigeria','+234'],['MK','North Macedonia','+389'],['NO','Norway','+47'],['OM','Oman','+968'],['PK','Pakistan','+92'],['PA','Panama','+507'],['PY','Paraguay','+595'],['PE','Peru','+51'],['PH','Philippines','+63'],['PL','Poland','+48'],['PT','Portugal','+351'],['QA','Qatar','+974'],['RO','Romania','+40'],['RU','Russia','+7'],['SA','Saudi Arabia','+966'],['RS','Serbia','+381'],['SG','Singapore','+65'],['SK','Slovakia','+421'],['SI','Slovenia','+386'],['ZA','South Africa','+27'],['ES','Spain','+34'],['LK','Sri Lanka','+94'],['SE','Sweden','+46'],['CH','Switzerland','+41'],['TW','Taiwan','+886'],['TJ','Tajikistan','+992'],['TZ','Tanzania','+255'],['TH','Thailand','+66'],['TN','Tunisia','+216'],['TR','Turkey','+90'],['TM','Turkmenistan','+993'],['UA','Ukraine','+380'],['AE','United Arab Emirates','+971'],['GB','United Kingdom','+44'],['US','United States','+1'],['UY','Uruguay','+598'],['UZ','Uzbekistan','+998'],['VE','Venezuela','+58'],['VN','Vietnam','+84'],['YE','Yemen','+967'],['ZM','Zambia','+260'],['ZW','Zimbabwe','+263']];const POPULAR=['TH','GB','US','AU','RU','AE','SA','SG','HK','IN','KZ','CN','DE','FR','CA'];const PHONE_LEN={'+66':[8,9],'+44':[9,10],'+1':[10,10],'+61':[8,9],'+7':[10,10],'+972':[8,9],'+65':[8,8],'+852':[8,8],'+91':[10,10],'+971':[8,9],'+86':[11,11],'+49':[9,11],'+33':[9,9],'+39':[8,11],'+34':[9,9],'+31':[9,9],'+48':[9,9],'+46':[7,10],'+47':[8,8],'+45':[8,8],'+41':[9,9],'+43':[9,11],'+32':[8,9],'+353':[9,9],'+64':[8,10],'+81':[10,10],'+82':[9,10],'+60':[9,10],'+62':[9,12],'+84':[9,10],'+63':[10,10],'+90':[10,10],'+380':[9,9],'+420':[9,9],'+351':[9,9],'+30':[10,10],'+36':[9,9],'+40':[9,9],'+27':[9,9],'+20':[10,10],'+966':[9,9],'+974':[8,8],'+965':[8,8],'+968':[8,8],'+973':[8,8],'+55':[10,11],'+52':[10,10]};
  const flag = iso => [...iso].map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join('');
  const country = iso => COUNTRIES.find(c => c[0] === iso);
  const fields = [];
  let touched = false;

  function build(input) {
    const form = input.form;
    const uid = 'cc' + fields.length;
    const row = document.createElement('div');
    row.className = 'phone-row';
    input.parentNode.insertBefore(row, input);
    row.innerHTML =
      '<button type="button" class="cc-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="' + uid + '" aria-label="Country code">' +
      '<span class="cc-flag notranslate" translate="no"></span><span class="cc-dial notranslate" translate="no"></span><span class="cc-caret"></span></button>' +
      '<div class="cc-dd" id="' + uid + '" role="listbox"><div class="cc-grab"></div>' +
      '<div class="cc-search-wrap"><input type="text" placeholder="Search country..." autocomplete="off" aria-label="Search country"></div>' +
      '<div class="cc-list"></div></div>';
    row.insertBefore(input, row.children[1]);
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('autocomplete', 'tel-national');
    if (!input.placeholder) input.placeholder = 'Phone number';
    const hint = document.createElement('p'); hint.className = 'phone-hint';
    const err = document.createElement('p'); err.className = 'phone-error'; err.setAttribute('role', 'alert'); err.hidden = true;
    row.after(hint, err);
    const f = {form, input, row, hint, err, iso: 'TH', btn: row.querySelector('.cc-btn'), dd: row.querySelector('.cc-dd'), list: row.querySelector('.cc-list'), search: row.querySelector('.cc-search-wrap input')};
    fields.push(f);

    const render = q => {
      q = (q || '').trim().toLowerCase();
      const item = c => '<div class="cc-item' + (c[0] === f.iso ? ' selected' : '') + '" role="option" data-iso="' + c[0] + '"><span class="cc-flag notranslate" translate="no">' + flag(c[0]) + '</span><span class="cc-name">' + c[1] + '</span><span class="cc-code notranslate" translate="no">' + c[2] + '</span></div>';
      const match = c => !q || c[1].toLowerCase().includes(q) || c[2].includes(q.replace(/^\+?/, '+')) || c[0].toLowerCase() === q;
      let html = '';
      if (!q) { html += '<div class="cc-group">Most used</div>' + POPULAR.map(country).filter(Boolean).map(item).join('') + '<div class="cc-group">A to Z</div>'; }
      const rows = COUNTRIES.filter(match);
      f.list.innerHTML = html + (rows.length ? rows.map(item).join('') : '<div class="cc-empty">No country found</div>');
    };
    const close = () => { f.dd.classList.remove('open'); f.btn.setAttribute('aria-expanded', 'false'); };
    const open = () => {
      fields.forEach(o => o.dd.classList.remove('open'));
      render(''); f.search.value = ''; f.dd.classList.add('open'); f.btn.setAttribute('aria-expanded', 'true');
      if (window.innerWidth > 600) f.search.focus();
      const sel = f.list.querySelector('.cc-item.selected'); if (sel) sel.scrollIntoView({block: 'nearest'});
    };
    f.close = close;
    f.btn.addEventListener('click', e => { e.stopPropagation(); f.dd.classList.contains('open') ? close() : open(); });
    f.search.addEventListener('input', () => render(f.search.value));
    f.search.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    f.list.addEventListener('click', e => {
      const it = e.target.closest('.cc-item'); if (!it) return;
      touched = true; setAll(it.dataset.iso); close(); input.focus();
    });
    // A number pasted with its own country code (+44..., 0044...) selects that country.
    input.addEventListener('input', () => {
      err.hidden = true; input.style.borderColor = '';
      let v = input.value.trim();
      if (!(v.startsWith('+') || v.startsWith('00'))) return;
      if (v.startsWith('00')) v = '+' + v.slice(2);
      const digits = v.slice(1).replace(/\D/g, '');
      let best = null;
      COUNTRIES.forEach(c => { const d = c[2].slice(1); if (digits.startsWith(d) && (!best || d.length > best[2].length - 1)) best = c; });
      if (best) { touched = true; setAll(best[0]); input.value = digits.slice(best[2].length - 1); }
    });
  }

  function setAll(iso) {
    const c = country(iso); if (!c) return;
    fields.forEach(f => {
      f.iso = iso;
      f.btn.querySelector('.cc-flag').textContent = flag(iso);
      f.btn.querySelector('.cc-dial').textContent = c[2];
      f.hint.innerHTML = 'Your number will start with <b class="notranslate" translate="no">' + flag(iso) + ' ' + c[2] + '</b> (' + c[1] + '). Tap the flag to change country.';
    });
  }

  function check(form) {
    const f = fields.find(x => x.form === form);
    if (!f) return null;
    const raw = f.input.value.trim();
    const c = country(f.iso);
    const stripped = raw.replace(/[\s\-().]/g, '');
    const digits = stripped.replace(/^0+/, '');
    let message = '';
    if (!raw) message = 'Please enter your phone number';
    else if (!/^\d+$/.test(stripped)) message = 'Digits only, please';
    else if (/^(\d)\1+$/.test(digits)) message = 'Please enter a valid number';
    else {
      const len = PHONE_LEN[c[2]];
      if (len) { if (digits.length < len[0] || digits.length > len[1]) message = 'A ' + c[1] + ' number has ' + (len[0] === len[1] ? len[0] : len[0] + ' to ' + len[1]) + ' digits after ' + c[2]; }
      else if (digits.length < 5 || digits.length > 15) message = 'Please enter a valid number';
    }
    f.err.textContent = message; f.err.hidden = !message;
    f.input.style.borderColor = message ? '#c0392b' : '';
    if (message) f.input.focus();
    return {ok: !message, full: c[2] + digits, message};
  }

  function init() {
    document.querySelectorAll('form[data-zlead] input[type="tel"][name="phone"], form[data-lead-form] input[type="tel"][name="phone"]').forEach(build);
    if (!fields.length) return;
    document.addEventListener('click', e => fields.forEach(f => { if (f.dd.classList.contains('open') && !f.row.contains(e.target)) f.close(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fields.forEach(f => f.close()); });
    const region = ((navigator.language || '').split('-')[1] || '').toUpperCase();
    setAll(country(region) ? region : 'TH');
    // The visitor's country as Cloudflare sees it, from this site's own endpoint.
    fetch('/api/geo').then(r => r.json()).then(j => { if (!touched && j && country(j.country)) setAll(j.country); }).catch(() => {});
  }
  window.zpPhone = {check};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
