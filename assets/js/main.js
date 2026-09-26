(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');
  var navLinks = nav.querySelectorAll('a[href^="#"]');
  var waFloat = document.querySelector('.wa-float');

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Sombra do cabeçalho ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  /* ---------- Animação de entrada ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Link ativo no menu ---------- */
  var linkById = {};
  navLinks.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.remove('is-active'); });
      var link = linkById[entry.target.id];
      if (link) link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Botão flutuante: esconde quando já há CTA visível ---------- */
  var ctaVisible = new Set();
  var ctaObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) ctaVisible.add(entry.target);
      else ctaVisible.delete(entry.target);
    });
    waFloat.classList.toggle('is-hidden', ctaVisible.size > 0);
  });
  ['.hero-actions', '.contact-list'].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) ctaObserver.observe(el);
  });
})();
