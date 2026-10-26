(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.getElementById('finder-form');
  if (form) {
    const update = () => {
      const values = new FormData(form);
      const category = values.get('category');
      const palette = String(values.get('palette') || '').split(',').filter(Boolean);
      const budget = Number(values.get('budget'));
      const matches = PRODUCTS.filter(p => p.cat === category && (!palette.length || palette.includes(p.color)) && (!budget || p.price <= budget));
      const params = new URLSearchParams({cat: category});
      if (palette.length) params.set('color', palette.join(','));
      if (budget) params.set('max', String(budget));
      const status = document.getElementById('finder-status');
      const link = document.getElementById('finder-link');
      status.textContent = matches.length ? `Ваша подборка: ${matches.length} ${pl(matches.length)}. Можно уточнить выбор в каталоге.` : 'Такого сочетания пока нет. Попробуйте другой оттенок или увеличьте бюджет.';
      link.href = matches.length ? 'catalog.html?' + params : 'catalog.html?cat=' + encodeURIComponent(category);
      link.innerHTML = (matches.length ? 'Смотреть подборку' : 'Все модели категории') + ' <span aria-hidden="true">'+I.arR+'</span>';
    };
    form.addEventListener('change', update);
    form.addEventListener('submit', event => {event.preventDefault(); document.getElementById('finder-link').click();});
    update();
  }
  const pcol = document.querySelector('.pcol');
  if (pcol) pcol.insertAdjacentHTML('beforeend', `<aside class="product-advice"><strong>Представьте эту модель у себя дома</strong><p>Пришлите фото комнаты — обсудим цвет, пропорции и сочетающиеся предметы.</p><a href="${INSTAGRAM}" target="_blank" rel="noopener">Обсудить эту модель в Instagram</a></aside>`);
  const more = document.getElementById('more');
  if (more) more.insertAdjacentHTML('afterend', `<aside class="catalog-advice"><div><strong>Нравится несколько вариантов?</strong><p>Сохраните их в избранное и напишите нам. Поможем сравнить материалы, цвета и размеры.</p></div><a href="${INSTAGRAM}" target="_blank" rel="noopener">Помогите с выбором</a></aside>`);
  // Reveal once, with no hidden initial state, scroll interception or autoplay.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (!reducedMotion.matches) entry.target.animate([
          {opacity:0, transform:'translateY(14px)'},
          {opacity:1, transform:'translateY(0)'}
        ], {duration:520, easing:'cubic-bezier(.2,.7,.3,1)'});
      }
    }, {threshold:0.08});
    document.querySelectorAll('.home-rooms,.home-benefits,.style-finder,.home-collection,.home-popular,.home-guidance,.home-faq,.home-contact,.product-advice,.catalog-advice').forEach(el => observer.observe(el));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {observer.disconnect();document.getAnimations().forEach(animation => animation.cancel());}
    });
  }
  document.querySelectorAll('[data-slider="hero"]').forEach(button => button.addEventListener('click', () => {
    if (!reducedMotion.matches) document.getElementById('hero-image').animate([{opacity:.45},{opacity:1}],{duration:380,easing:'ease-out'});
  }));
})();
