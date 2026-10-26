/* Homepage uses the catalog's product renderer, storage and cart. */
(() => {
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = I[el.dataset.icon] || ''; });
  document.getElementById('home-products').innerHTML = [18,22,20,14].map(id => card(byId(id))).join('');
  const slides = [
    {image:'images/home-hero.webp',alt:'Светлая гостиная с округлым диваном и деревянным столиком',kicker:'МК Мебель · мебель для вашего дома',heading:'Ваш дом.<br>Ваш характер.',intro:'Спокойные оттенки, мягкие линии и любимые детали. Мебель для жизни, в которой хорошо быть собой.',link:'catalog.html',button:'Найти свою мебель'},
    {image:'images/home-collection.webp',alt:'Оливковый диван в тёплом современном интерьере',kicker:'Природные оттенки · мягкие формы',heading:'Ближе к природе.<br>Ближе к себе.',intro:'Шалфей, лён и тёплое дерево. Соберите интерьер, который помогает замедлиться и почувствовать себя дома.',link:'catalog.html?color=Лён,Песок,Шалфей',button:'Открыть подборку'}
  ];
  let active = 0;
  document.querySelectorAll('[data-slider="hero"]').forEach(button => button.addEventListener('click', () => {
    active = (active + Number(button.dataset.direction) + slides.length) % slides.length;
    const slide = slides[active];
    const image = document.getElementById('hero-image'); image.src = slide.image; image.alt = slide.alt;
    document.getElementById('hero-kicker').textContent = slide.kicker;
    document.getElementById('hero-heading').innerHTML = slide.heading;
    document.getElementById('hero-intro').textContent = slide.intro;
    const link = document.getElementById('hero-link'); link.href = slide.link; link.innerHTML = slide.button+' <span aria-hidden="true">'+I.arR+'</span>';
    document.getElementById('hero-count').innerHTML = '0'+(active+1)+' <i>/ 02</i>';
  }));
  const footer = document.querySelector('footer.site');
  footer.innerHTML = `<div class="wrap"><div class="home-footer-row"><a class="home-footer-logo" href="index.html"><img class="brand-logo" src="images/brand-logo.png" alt="Мебель в дом — главная" width="280" height="124"></a><span class="home-footer-caption">Мебель, с которой начинается дом.</span><nav class="home-footer-nav" aria-label="Навигация в подвале"><a href="catalog.html">Каталог</a><a href="#rooms">Комнаты</a><a href="#collections">Коллекции</a><a href="#custom">О нас</a><a href="contacts.html">Контакты</a></nav><a class="home-footer-social" href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram ${I.arR}</a></div><div class="home-footer-bottom"><span>© ${new Date().getFullYear()} МК Мебель</span><span>Демонстрационный каталог. Наличие и условия уточняйте у менеджера.</span></div></div>`;
  document.querySelectorAll('.home-button span,.round-arrow,.home-section-head>a span').forEach(el => {el.innerHTML=I.arR;});
})();
