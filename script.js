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

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
