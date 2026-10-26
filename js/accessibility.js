(() => {
  const header = document.querySelector('header.site');
  const search = document.querySelector('.hsearch');
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.burger');
  search.id = 'site-search';
  const searchButton = document.createElement('button');
  searchButton.type = 'button'; searchButton.className = 'iconbtn search-toggle';
  searchButton.setAttribute('aria-label','Открыть поиск'); searchButton.setAttribute('aria-controls','site-search');
  searchButton.innerHTML = I.search;
  header.querySelector('.tools').prepend(searchButton);
  searchButton.addEventListener('click', () => {nav.classList.remove('open');search.classList.toggle('mopen');});
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  const drawer = document.getElementById('drawer');
  drawer.setAttribute('role','dialog'); drawer.setAttribute('aria-modal','true'); drawer.setAttribute('tabindex','-1');
  const filters = document.getElementById('filt');
  const lightbox = document.querySelector('.lb');
  let active = null, returnFocus = null;
  const isMobile = () => matchMedia('(max-width:760px)').matches;
  const focusable = el => [...el.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex="0"]')].filter(e=>!e.disabled&&!e.closest('[inert]')&&e.getClientRects().length);
  const sync = () => {
    const cartOpen = drawer.classList.contains('open');
    drawer.inert = !cartOpen; drawer.setAttribute('aria-hidden',String(!cartOpen));
    if(filters){filters.inert=isMobile()&&!filters.classList.contains('open');if(isMobile()){filters.setAttribute('role','dialog');filters.setAttribute('aria-modal','true');}else{filters.removeAttribute('role');filters.removeAttribute('aria-modal');}}
    burger.setAttribute('aria-expanded',String(nav.classList.contains('open')));
    searchButton.setAttribute('aria-expanded',String(search.classList.contains('mopen')));
    const next = lightbox&&!lightbox.hidden ? lightbox : cartOpen ? drawer : filters&&isMobile()&&filters.classList.contains('open') ? filters : search.classList.contains('mopen') ? search : nav.classList.contains('open') ? nav : null;
    document.body.classList.toggle('overlay-active',Boolean(next));
    if(next!==active){
      if(next){if(!active)returnFocus=next===search?searchButton:next===lightbox?document.getElementById('gmain'):document.activeElement;active=next;if(!next.contains(document.activeElement))(focusable(next)[0]||next).focus();}
      else{active=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;}
    }
  };
  const observer = new MutationObserver(sync);
  [drawer,filters,lightbox,nav,search].filter(Boolean).forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class','hidden']}));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){nav.classList.remove('open');if(lightbox)lightbox.hidden=true;}
    if(event.key==='Tab'&&active){const items=focusable(active);if(!items.length){event.preventDefault();return}const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  document.addEventListener('click',event=>{if(nav.classList.contains('open')&&!nav.contains(event.target)&&!burger.contains(event.target))nav.classList.remove('open');});
  window.addEventListener('resize',()=>{if(innerWidth>1000)nav.classList.remove('open');sync();});
  // Do not leave an invisible dialog open after changing screen size.
  sync();
  if(lightbox){lightbox.querySelectorAll('.lb-p,.lb-n').forEach(button=>button.hidden=true);}
  document.querySelectorAll('.gthumbs').forEach(el=>el.hidden=true);
  document.querySelectorAll('.gal').forEach(el=>el.classList.add('single-photo'));
  const skip=document.createElement('a');skip.href='#main-content';skip.className='skip-link';skip.textContent='Перейти к содержимому';document.querySelector('main').id='main-content';document.body.prepend(skip);
})();
