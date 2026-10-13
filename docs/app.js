(() => {
  'use strict';
  const words = {
    ru: { label: 'Русский', text: 'Я скучаю по тебе', meaning: 'Очень. И ещё немножко сильнее ♡', dir: 'ltr' },
    en: { label: 'English', text: 'I miss u', meaning: 'Я скучаю по тебе ♡', dir: 'ltr' },
    fr: { label: 'Français', text: 'Tu me manques', meaning: 'Мне тебя не хватает ♡', dir: 'ltr' },
    es: { label: 'Español', text: 'Te extraño', meaning: 'Я скучаю по тебе ♡', dir: 'ltr' },
    it: { label: 'Italiano', text: 'Mi manchi', meaning: 'Мне тебя не хватает ♡', dir: 'ltr' },
    de: { label: 'Deutsch', text: 'Du fehlst mir', meaning: 'Мне тебя не хватает ♡', dir: 'ltr' },
    tr: { label: 'Türkçe', text: 'Seni özledim', meaning: 'Я соскучился по тебе ♡', dir: 'ltr' },
    uz: { label: 'O‘zbekcha', text: 'Seni sog‘indim', meaning: 'Я соскучился по тебе ♡', dir: 'ltr' },
    ja: { label: '日本語', text: '会いたい', meaning: 'Так хочется тебя увидеть ♡', dir: 'ltr' },
    ko: { label: '한국어', text: '보고 싶어', meaning: 'Хочу тебя увидеть. Скучаю ♡', dir: 'ltr' },
    zh: { label: '中文', text: '想你了', meaning: 'Я скучаю по тебе ♡', dir: 'ltr' },
    ar: { label: 'العربية', text: 'أشتاق إليكِ', meaning: 'Я скучаю по тебе ♡', dir: 'rtl' },
  };
  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const collected = new Set();
  const dialog = $('letter-dialog');
  const page = $('page');
  let returnFocus = null;

  function hearts(x, y, amount = 12) {
    if (reducedMotion.matches) return;
    const layer = dialog.open && !dialog.classList.contains('fallback-open') ? $('letter-particles') : $('particle-layer');
    if (layer.childElementCount > 60) return;
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement('span');
      heart.className = 'particle';
      heart.textContent = i % 3 === 0 ? '♡' : '♥';
      heart.style.setProperty('--x', x + 'px');
      heart.style.setProperty('--y', y + 'px');
      heart.style.setProperty('--size', 12 + Math.random() * 15 + 'px');
      heart.style.setProperty('--dx', (Math.random() - .5) * 210 + 'px');
      heart.style.setProperty('--dy', -80 - Math.random() * 160 + 'px');
      heart.style.setProperty('--spin', (Math.random() - .5) * 70 + 'deg');
      heart.style.setProperty('--color', i % 2 === 0 ? '#a95f68' : '#b88d78');
      layer.append(heart);
      setTimeout(() => heart.remove(), 2300);
    }
  }

  function buttonHearts(button, event, amount = 12) {
    const bounds = button.getBoundingClientRect();
    const pointer = event && event.detail > 0 && Number.isFinite(event.clientX);
    hearts(pointer ? event.clientX : bounds.left + bounds.width / 2,
      pointer ? event.clientY : bounds.top + bounds.height / 2, amount);
  }

  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', event => {
      const language = button.dataset.language;
      const word = words[language];
      if (!word) return;
      $('translation-language').textContent = word.label;
      $('translation-text').textContent = word.text;
      $('translation-text').setAttribute('lang', language);
      $('translation-text').setAttribute('dir', word.dir);
      $('translation-meaning').textContent = word.meaning;
      button.setAttribute('aria-pressed', 'true');
      collected.add(language);
      const complete = collected.size === Object.keys(words).length;
      $('collection-status').textContent = complete
        ? 'Все языки говорят одно: я очень скучаю по тебе ♡'
        : 'Уже ' + collected.size + ' из 12 маленьких «скучаю» ♡';
      buttonHearts(button, event, complete ? 22 : 8);
    });
  });

  function finishClosing() {
    page.inert = false;
    document.body.classList.remove('modal-open');
    dialog.classList.remove('fallback-open');
    dialog.removeAttribute('role');
    dialog.removeAttribute('aria-modal');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }

  function openLetter(event) {
    if (dialog.open) return;
    returnFocus = event.currentTarget || document.activeElement;
    $('hug-message').textContent = '';
    document.body.classList.add('modal-open');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else {
      dialog.setAttribute('open', '');
      dialog.classList.add('fallback-open');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      page.inert = true;
    }
    $('close-letter').focus({ preventScroll: true });
  }

  function closeLetter() {
    if (!dialog.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      finishClosing();
    }
  }

  $('open-letter').addEventListener('click', openLetter);
  $('photo-letter').addEventListener('click', openLetter);
  $('close-letter').addEventListener('click', closeLetter);
  dialog.addEventListener('close', finishClosing);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeLetter(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeLetter();
  });

  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'Escape') { event.preventDefault(); closeLetter(); return; }
    if (event.key !== 'Tab') return;
    const buttons = Array.from(dialog.querySelectorAll('button:not([disabled])'));
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  $('send-hug').addEventListener('click', event => {
    $('hug-message').textContent = 'Обнимаю. Очень-очень ♡';
    buttonHearts(event.currentTarget, event, 26);
  });
})();
