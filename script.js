// TraducAI website: hero captions, language list, scroll effects.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- hero phone: the same sentence interpreted into one language after another ----
  var lines = [
    ['French', 'Merci de nous avoir rejoints ce matin.', 'Bienvenue à tous. Commençons par les résultats de Nairobi.', 'ltr'],
    ['Portuguese', 'Obrigado por se juntarem a nós esta manhã.', 'Bem-vindos a todos. Vamos começar pelos resultados de Nairobi.', 'ltr'],
    ['Arabic', 'شكرًا لانضمامكم إلينا هذا الصباح.', 'مرحبًا بالجميع. لنبدأ بنتائج نيروبي.', 'rtl'],
    ['Spanish', 'Gracias por acompañarnos esta mañana.', 'Bienvenidos a todos. Empecemos con los resultados de Nairobi.', 'ltr'],
    ['Swahili', 'Asanteni kwa kujiunga nasi asubuhi hii.', 'Karibuni nyote. Tuanze na matokeo ya Nairobi.', 'ltr'],
    ['Chinese', '感谢大家今天上午的到来。', '欢迎大家。我们先来看内罗毕的结果。', 'ltr']
  ];
  var langEl = document.getElementById('ph-lang'), prevEl = document.getElementById('ph-prev'), nowEl = document.getElementById('ph-now');
  var i = 0;
  function show(n, text) {
    var l = lines[n];
    langEl.textContent = l[0];
    prevEl.textContent = l[1]; prevEl.dir = l[3];
    nowEl.dir = l[3]; nowEl.textContent = text;
  }
  function play() {
    var l = lines[i], full = l[2], k = 0;
    show(i, '');
    if (reduce) { nowEl.textContent = full; i = (i + 1) % lines.length; setTimeout(play, 4000); return; }
    // words arrive a few at a time, like a live caption
    var words = full.split(/(\s+)/);
    if (l[0] === 'Chinese') words = Array.from(full);
    (function step() {
      k++;
      nowEl.textContent = words.slice(0, k).join('');
      if (k < words.length) setTimeout(step, l[0] === 'Chinese' ? 120 : 160 + Math.random() * 120);
      else { i = (i + 1) % lines.length; setTimeout(play, 2600); }
    })();
  }
  if (langEl && nowEl) play();

  // ---- languages (from the live service; * = captions only) ----
  var LANGS = 'English,French,Arabic,Portuguese,Swahili*,Spanish,Chinese,German,Italian,Russian,Afrikaans*,Hindi,Japanese,Korean,Turkish,Indonesian,Malay,Dutch,Urdu,Persian,Hebrew,Thai,Vietnamese,Filipino,Polish,Czech,Swedish,Danish,Norwegian,Finnish,Icelandic,Cantonese*,Greek*,Ukrainian*,Romanian*,Hungarian*,Bulgarian*,Croatian*,Slovak*,Slovenian*,Bengali*,Gujarati*,Kannada*,Malayalam*,Marathi*,Punjabi*,Catalan*,Galician*,Estonian*,Latvian*,Macedonian*,Bosnian*,Belarusian*,Azerbaijani*,Kazakh*,Kyrgyz*,Tajik*,Javanese*,Cebuano*,Asturian*'
    .split(',').map(function (s) { return { name: s.replace('*', ''), voice: s.indexOf('*') < 0 }; });
  var list = document.getElementById('langs'), q = document.getElementById('lang-q'), none = document.getElementById('lang-none');
  var filter = 'all';
  function render() {
    var t = (q.value || '').trim().toLowerCase(), html = '', n = 0;
    LANGS.forEach(function (l) {
      if (filter === 'voice' && !l.voice) return;
      if (filter === 'captions' && l.voice) return;
      if (t && l.name.toLowerCase().indexOf(t) < 0) return;
      n++;
      html += '<li class="lg' + (l.voice ? ' voice' : '') + '" title="' + l.name + (l.voice ? ': voice and captions' : ': captions') + '">' + l.name + '</li>';
    });
    list.innerHTML = html;
    none.hidden = n > 0;
  }
  if (list) {
    q.addEventListener('input', render);
    document.querySelectorAll('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-f');
        document.querySelectorAll('.seg button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        render();
      });
    });
    render();
  }

  // ---- nav border once scrolled; reveal on scroll ----
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var targets = document.querySelectorAll('.reveal, .mock');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el, n) { el.style.transitionDelay = (n % 3) * 80 + 'ms'; io.observe(el); });
  } else targets.forEach(function (el) { el.classList.add('in'); });

  // ---- prices in the visitor's currency (charged in US dollars; local amounts are approximate) ----
  // The country is guessed from the time zone, then the browser language. No location lookup.
  var TZ = {
    Nairobi: 'KE', Kampala: 'UG', Dar_es_Salaam: 'TZ', Kigali: 'RW', Bujumbura: 'BI', Addis_Ababa: 'ET', Mogadishu: 'SO',
    Djibouti: 'DJ', Asmara: 'ER', Khartoum: 'SD', Juba: 'SS', Lagos: 'NG', Accra: 'GH', Abidjan: 'CI', Dakar: 'SN',
    Bamako: 'ML', Ouagadougou: 'BF', Niamey: 'NE', Lome: 'TG', 'Porto-Novo': 'BJ', Conakry: 'GN', Freetown: 'SL',
    Monrovia: 'LR', Banjul: 'GM', Bissau: 'GW', Nouakchott: 'MR', Douala: 'CM', Libreville: 'GA', Malabo: 'GQ',
    Brazzaville: 'CG', Kinshasa: 'CD', Lubumbashi: 'CD', Bangui: 'CF', Ndjamena: 'TD', Luanda: 'AO', Lusaka: 'ZM',
    Harare: 'ZW', Maputo: 'MZ', Blantyre: 'MW', Gaborone: 'BW', Windhoek: 'NA', Johannesburg: 'ZA', Maseru: 'LS',
    Mbabane: 'SZ', Cairo: 'EG', Tripoli: 'LY', Tunis: 'TN', Algiers: 'DZ', Casablanca: 'MA', El_Aaiun: 'MA',
    Sao_Tome: 'ST', Cape_Verde: 'CV', Mauritius: 'MU', Antananarivo: 'MG', Comoro: 'KM', Mahe: 'SC',
    London: 'GB', Dublin: 'IE', Paris: 'FR', Berlin: 'DE', Madrid: 'ES', Lisbon: 'PT', Rome: 'IT', Amsterdam: 'NL',
    Brussels: 'BE', Vienna: 'AT', Zurich: 'CH', Stockholm: 'SE', Oslo: 'NO', Copenhagen: 'DK', Helsinki: 'FI',
    Warsaw: 'PL', Prague: 'CZ', Budapest: 'HU', Bucharest: 'RO', Athens: 'GR', Istanbul: 'TR', Kyiv: 'UA', Kiev: 'UA',
    Moscow: 'RU', Dubai: 'AE', Riyadh: 'SA', Qatar: 'QA', Kuwait: 'KW', Bahrain: 'BH', Muscat: 'OM', Amman: 'JO',
    Beirut: 'LB', Jerusalem: 'IL', Tel_Aviv: 'IL', Baghdad: 'IQ', Tehran: 'IR', Karachi: 'PK', Kolkata: 'IN',
    Calcutta: 'IN', Dhaka: 'BD', Kathmandu: 'NP', Colombo: 'LK', Bangkok: 'TH', Jakarta: 'ID', Kuala_Lumpur: 'MY',
    Singapore: 'SG', Manila: 'PH', Ho_Chi_Minh: 'VN', Saigon: 'VN', Hong_Kong: 'HK', Shanghai: 'CN', Taipei: 'TW',
    Seoul: 'KR', Tokyo: 'JP', Sydney: 'AU', Melbourne: 'AU', Brisbane: 'AU', Perth: 'AU', Adelaide: 'AU',
    Auckland: 'NZ', Toronto: 'CA', Vancouver: 'CA', Edmonton: 'CA', Winnipeg: 'CA', Halifax: 'CA', Mexico_City: 'MX',
    Sao_Paulo: 'BR', Buenos_Aires: 'AR', Santiago: 'CL', Bogota: 'CO', Lima: 'PE', Caracas: 'VE', Jamaica: 'JM'
  };
  var CUR = {
    KE: 'KES', UG: 'UGX', TZ: 'TZS', RW: 'RWF', BI: 'BIF', ET: 'ETB', SO: 'SOS', DJ: 'DJF', ER: 'ERN', SD: 'SDG',
    SS: 'SSP', NG: 'NGN', GH: 'GHS', CI: 'XOF', SN: 'XOF', ML: 'XOF', BF: 'XOF', NE: 'XOF', TG: 'XOF', BJ: 'XOF',
    GW: 'XOF', GN: 'GNF', SL: 'SLE', LR: 'LRD', GM: 'GMD', MR: 'MRU', CM: 'XAF', GA: 'XAF', GQ: 'XAF', CG: 'XAF',
    CF: 'XAF', TD: 'XAF', CD: 'CDF', AO: 'AOA', ZM: 'ZMW', ZW: 'USD', MZ: 'MZN', MW: 'MWK', BW: 'BWP', NA: 'NAD',
    ZA: 'ZAR', LS: 'LSL', SZ: 'SZL', EG: 'EGP', LY: 'LYD', TN: 'TND', DZ: 'DZD', MA: 'MAD', ST: 'STN', CV: 'CVE',
    MU: 'MUR', MG: 'MGA', KM: 'KMF', SC: 'SCR', GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', ES: 'EUR', PT: 'EUR',
    IT: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK',
    PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', TR: 'TRY', UA: 'UAH', RU: 'RUB', AE: 'AED', SA: 'SAR', QA: 'QAR',
    KW: 'KWD', BH: 'BHD', OM: 'OMR', JO: 'JOD', LB: 'LBP', IL: 'ILS', IQ: 'IQD', IR: 'IRR', PK: 'PKR', IN: 'INR',
    BD: 'BDT', NP: 'NPR', LK: 'LKR', TH: 'THB', ID: 'IDR', MY: 'MYR', SG: 'SGD', PH: 'PHP', VN: 'VND', HK: 'HKD',
    CN: 'CNY', TW: 'TWD', KR: 'KRW', JP: 'JPY', AU: 'AUD', NZ: 'NZD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS',
    CL: 'CLP', CO: 'COP', PE: 'PEN', VE: 'USD', JM: 'JMD', US: 'USD'
  };
  var CHOICES = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS', 'UGX', 'TZS', 'RWF', 'ETB', 'EGP', 'MAD', 'XOF', 'XAF', 'INR', 'AED', 'CAD', 'AUD'];
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function guessCurrency() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
    var city = tz.split('/').pop(), country = TZ[city];
    if (!country && /^America\//.test(tz)) country = 'US';
    if (!country) (navigator.languages || [navigator.language]).some(function (l) {
      var m = /-([A-Z]{2})$/i.exec(l || ''); if (m && CUR[m[1].toUpperCase()]) { country = m[1].toUpperCase(); return true; }
    });
    return CUR[country] || 'USD';
  }
  function loadRates(done) {
    var cached = null;
    try { cached = JSON.parse(store('fx') || 'null'); } catch (e) { /* ignore */ }
    if (cached && cached.rates && Date.now() - cached.t < 12 * 3600 * 1000) return done(cached.rates);
    fetch('https://open.er-api.com/v6/latest/USD').then(function (r) { return r.json(); }).then(function (d) {
      if (d.result !== 'success' || !d.rates) throw new Error('no rates');
      store('fx', JSON.stringify({ t: Date.now(), rates: d.rates }));
      done(d.rates);
    }).catch(function () { done(cached && cached.rates); });
  }
  var priceEls = document.querySelectorAll('[data-usd]'), curBox = document.getElementById('currency');
  if (priceEls.length && curBox) loadRates(function (rates) {
    if (!rates) return; // no rates: the page keeps its US dollar prices
    var sel = document.getElementById('cur'), note = document.getElementById('cur-note');
    var lang = navigator.language || 'en';
    var usd = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    var chosen = store('cur') || guessCurrency();
    if (!rates[chosen]) chosen = 'USD';
    var list = CHOICES.filter(function (c) { return rates[c]; });
    if (list.indexOf(chosen) < 0) list.push(chosen);
    var names = null;
    try { names = new Intl.DisplayNames([lang], { type: 'currency' }); } catch (e) { /* old browser */ }
    sel.innerHTML = list.map(function (c) {
      return '<option value="' + c + '">' + c + (names ? ' (' + names.of(c) + ')' : '') + '</option>';
    }).join('');
    function apply(c) {
      var nf = new Intl.NumberFormat(lang, { style: 'currency', currency: c, minimumFractionDigits: 0, maximumFractionDigits: 0 });
      var fmt = { format: function (v) { // whole units; big amounts to 3 figures (KES 4,520, not KES 4,517.85)
        var p = v >= 1000 ? Math.pow(10, Math.floor(Math.log10(v)) - 2) : 1;
        return nf.format(Math.round(v / p) * p);
      } };
      priceEls.forEach(function (el) {
        var n = +el.getAttribute('data-usd');
        if (c === 'USD' || !n) { el.textContent = c === 'USD' ? usd.format(n) : nf.format(0); el.removeAttribute('title'); el.classList.toggle('local', c !== 'USD'); }
        else {
          // headline prices show the local amount big and the dollar price under it; prices in a sentence get it in brackets
          el.textContent = fmt.format(n * rates[c]) + (el.tagName === 'B' ? '' : ' (' + usd.format(n) + ')');
          el.classList.toggle('local', el.tagName === 'B');
          el.title = usd.format(n) + ' (US dollars)';
        }
        var ref = el.parentNode.parentNode.querySelector('.usd-ref');
        if (el.tagName === 'B') {
          if (!ref) { ref = document.createElement('div'); ref.className = 'usd-ref'; el.parentNode.after(ref); }
          ref.textContent = c === 'USD' || !n ? '' : usd.format(n) + ' in US dollars';
        }
      });
      note.textContent = c === 'USD' ? 'Plans are charged in US dollars.'
        : 'Plans are charged in US dollars. Amounts in ' + c + ' are approximate, at today\'s exchange rate.';
    }
    sel.value = chosen;
    sel.addEventListener('change', function () { store('cur', sel.value); apply(sel.value); });
    apply(chosen);
    curBox.hidden = false;
  });

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
