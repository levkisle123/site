const INSTAGRAM="https://www.instagram.com/mkmebelvdom";
const CURRENCY="₽", PAGE_SIZE=24;
const fmt=n=>n.toLocaleString("ru-RU")+" "+CURRENCY;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const page=document.body.dataset.page;
const catOf=id=>CATEGORIES.find(c=>c.id===id);
const byId=id=>PRODUCTS.find(p=>p.id===id);
// Each studio sheet contains twelve product photos in a strict 3 × 4 grid.
const STUDIO_CATEGORIES=["sofas","chairs","tables","beds","storage","light"];
const studioSheet=p=>"images/studio-"+STUDIO_CATEGORIES[Math.floor((p.id-1)/12)]+".webp";
const imgs=p=>[studioSheet(p)];
const store=(k,d)=>{try{const value=JSON.parse(localStorage.getItem(k));return Array.isArray(d)?(Array.isArray(value)?value:d):(value??d)}catch(e){return d}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

const PHOTOS=true; /* true — показывать фото из images/, false — заглушки */
const SHOP={delivery:"Условия доставки уточняйте у менеджера",warranty:"Гарантия — по условиям магазина"};
const stub=(label,c="")=>`<div class="ph stub ${c}" role="img" aria-label="Заглушка фото"><svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="34" height="30" rx="5"/><circle cx="18" cy="20" r="3"/><path d="m9 36 11-10 7 6 6-5 8 7"/></svg>${label?`<span>${label}</span>`:""}</div>`;
function ph(p,label,i=0){
  const tile=(p.id-1)%12, x=(tile%3)*50, y=Math.floor(tile/3)*100/3;
  const alt=(p.name+" — "+p.color).replace(/&/g,"&amp;").replace(/"/g,"&quot;");
  return `<div class="ph has-img product-photo" role="img" aria-label="${alt}" data-product-photo="${p.id}" style="background-image:url('${studioSheet(p)}');background-size:300% 400%;background-position:${x}% ${y}%;background-repeat:no-repeat"></div>`;
}

/* ---------- корзина и избранное ---------- */
let cart=store("mk_cart",[]).filter(x=>x&&byId(x.id)&&Number.isSafeInteger(x.q)&&x.q>0&&x.q<=99),favs=[...new Set(store("mk_fav",[]).filter(id=>byId(id)))];
function add(id){if(!byId(id))return;const i=cart.find(x=>x.id===id);i?i.q=Math.min(99,i.q+1):cart.push({id,q:1});put("mk_cart",cart);drawCart();openCart()}
function change(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.q=Math.min(99,i.q+d);if(i.q<1)cart=cart.filter(x=>x.id!==id);put("mk_cart",cart);drawCart()}
function drawCart(){
  $$(".cnt").forEach(e=>e.textContent=cart.reduce((s,x)=>s+x.q,0));
  const total=cart.reduce((s,x)=>s+byId(x.id).price*x.q,0);
  $("#clist").innerHTML=cart.length?cart.map(x=>{const p=byId(x.id);
    return `<div class="row">${ph(p,"")}<div><a href="product.html?id=${p.id}">${p.name}</a><br><small>${fmt(p.price)} × ${x.q}</small></div>
    <div><button aria-label="Убрать один" onclick="change(${p.id},-1)">−</button><button aria-label="Добавить ещё один" onclick="change(${p.id},1)">+</button><button class="rm" aria-label="Удалить: ${p.name}" onclick="removeItem(${p.id})">Удалить</button></div></div>`}).join("")
    :`<p class="lead">В корзине пока пусто. Выберите товары в каталоге.</p>`;
  $("#ctotal").textContent=fmt(total);
  const orderText=cart.map(x=>{const p=byId(x.id);return p?`${p.name} × ${x.q} — ${fmt(p.price*x.q)}`:""}).filter(Boolean).join("\n");
  $("#corder").href="contacts.html?order="+encodeURIComponent((orderText?orderText+"\n\n":"")+"Итого: "+fmt(total));
  $("#corder").style.display=cart.length?"inline-flex":"none";
}
const openCart=()=>{$("#drawer").classList.add("open");$("#veil").classList.add("on")};
const closeCart=()=>{$("#drawer").classList.remove("open");$("#veil").classList.remove("on")};
function toggleFav(id){if(!byId(id))return;const on=!favs.includes(id);favs=on?[...favs,id]:favs.filter(x=>x!==id);put("mk_fav",favs);
  $$('.fav[data-id="'+id+'"]').forEach(b=>{b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
  $$(".fcnt").forEach(e=>e.textContent=favs.length);if(window.redraw)redraw()}

/* ---------- карточка ---------- */
function card(p){const fav=favs.includes(p.id),u="product.html?id="+p.id;
  return `<article class="card"><div class="card-img"><button class="fav ${fav?"on":""}" data-id="${p.id}" aria-label="Избранное: ${p.name}" aria-pressed="${fav}" onclick="toggleFav(${p.id})">${I.heart}</button>
  <a href="${u}" aria-label="Открыть ${p.name}">${ph(p)}</a></div>
  <div class="card-b"><h3><a href="${u}">${p.name}</a></h3>${p.brand?`<small>${p.brand}</small>`:""}
  <div class="price"><strong>${fmt(p.price)}</strong>${p.old?`<s>${fmt(p.old)}</s>`:""}</div>${p.color?`<span class="sw-dot" style="--c:${CLR[p.color]||"#ccc"}" title="${p.color}" role="img" aria-label="Цвет: ${p.color}"></span>`:""}</div></article>`}

/* ---------- шапка и подвал ---------- */
const ic=d=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I={heart:ic('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>'),search:ic('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),cart:ic('<path d="M4 5h2l2 10h9.5l1.8-7H7"/><circle cx="10" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/>'),arL:ic('<path d="M19 12H5m6-6-6 6 6 6"/>'),arR:ic('<path d="M5 12h14m-6-6 6 6-6 6"/>'),chev:ic('<path d="m7 10 5 5 5-5"/>'),user:ic('<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4"/>'),chevR:ic('<path d="m9 6 6 6-6 6"/>'),check:ic('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.6-4.8"/>'),truck:ic('<path d="M3 7h10v9H3zM13 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/>'),info:ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>')};
const CLR={"Океан":"#4F6A7A","Лён":"#D9D3C5","Глина":"#B07A62","Шалфей":"#7D8B74","Песок":"#C2B59B","Графит":"#4A4E52"};
const pl=n=>{const a=n%100,b=n%10;return a>10&&a<15?"товаров":b===1?"товар":b>1&&b<5?"товара":"товаров"};
const nav=[["catalog.html","Каталог","catalog"],["index.html#rooms","Комнаты",""],["index.html#collections","Коллекции",""],["index.html#custom","О нас",""],["contacts.html","Контакты","contacts"]];
document.body.insertAdjacentHTML("afterbegin",`
<header class="site"><div class="wrap bar">
  <a class="logo" href="index.html" aria-label="Мебель в дом — главная"><img class="brand-logo" src="images/brand-logo.png" alt="Мебель в дом" width="280" height="124"></a>
  <nav class="main" id="nav" aria-label="Основная навигация">${nav.map(n=>`<a href="${n[0]}" class="${n[2]===page?"on":""}">${n[1]}</a>`).join("")}</nav>
  <div class="tools"><form class="hsearch" action="catalog.html" role="search">${I.search}<input name="q" placeholder="Поиск мебели, брендов, стилей…" aria-label="Поиск товаров"></form>
  <a class="favlink iconbtn" href="catalog.html?cat=fav" aria-label="Избранное">${I.heart}<span class="fcnt badge">0</span></a>
  <a class="iconbtn" href="contacts.html" aria-label="Контакты">${I.user}</a>
  <button class="cartbtn iconbtn" type="button" aria-label="Корзина" onclick="openCart()">${I.cart}<b class="cnt badge">0</b></button>
  <button class="burger" type="button" aria-label="Открыть меню" aria-controls="nav" aria-expanded="false" onclick="const n=$('#nav');const o=n.classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false')">☰</button></div>
</div></header>
<div class="veil" id="veil" onclick="closeCart()"></div>
<aside class="drawer" id="drawer" aria-label="Корзина"><div class="dh"><h3>Корзина</h3><button aria-label="Закрыть" onclick="closeCart()" style="font-size:1.6rem">×</button></div>
<div class="list" id="clist"></div>
<div class="df"><div><span>Итого</span><span id="ctotal"></span></div>
<a class="btn" id="corder" href="contacts.html" style="text-align:center">Подготовить сообщение <span aria-hidden="true">${I.arR}</span></a></div></aside>`);
document.body.insertAdjacentHTML("beforeend",`
<footer class="site"><div class="wrap"><div class="fcols">
 <div><a class="footer-brand" href="index.html"><img class="brand-logo" src="images/brand-logo.png" alt="Мебель в дом — главная" width="280" height="124"></a><p>Предметы для дома, в котором хорошо. Помогаем выбирать, сочетать и создавать мебель под вас.</p></div>
 <div><h4>Коллекция</h4>${CATEGORIES.map(c=>`<a href="catalog.html?cat=${c.id}">${c.name}</a>`).join("")}</div>
 <div><h4>О магазине</h4><a href="catalog.html">Весь каталог</a><a href="index.html#custom">Мебель на заказ</a><a href="contacts.html">Связаться с нами</a></div>
 <div><h4>Мы на связи</h4><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @mkmebelvdom <span class="external-arrow">${I.arR}</span></a><a href="contacts.html">Вопрос по заказу</a><p>Подбор модели и условия покупки — в переписке с магазином.</p></div>
</div><div class="copy">© <span id="yr"></span> МК Мебель. Демонстрационный каталог — наличие и условия уточняйте у менеджера.</div></div></footer>
<nav class="mbar" aria-label="Быстрые действия"><a href="catalog.html">Каталог</a><a href="catalog.html?cat=fav">Избранное</a><button type="button" onclick="openCart()">Корзина <b class="cnt">0</b></button></nav>`);
$("#yr").textContent=new Date().getFullYear();

/* ---------- главная ---------- */
if($("#cats"))$("#cats").innerHTML=CATEGORIES.map(c=>{const n=PRODUCTS.filter(p=>p.cat===c.id).length;
  return `<a class="cat" href="catalog.html?cat=${c.id}"><div class="ph has-img"><img src="images/cat-${c.id}.jpg" alt="${c.name}" loading="lazy"><span class="cat-label">${c.name}</span></div><h3>${c.name}</h3><small>${n} моделей</small></a>`}).join("");
if($("#new"))$("#new").innerHTML=PRODUCTS.filter(p=>p.tag==="Новинка"||p.tag==="Хит").slice(0,4).map(card).join("");
if($("#sale"))$("#sale").innerHTML=PRODUCTS.filter(p=>p.old).slice(0,4).map(card).join("");
const FAB=[["Шалфей","#7D8B74","images/sofa-sage.jpg"],["Графит","#4A4E52","images/sofa-graphite.jpg"],["Песок","#C2B59B","images/sofa-sand.jpg"],["Океан","#4F6A7A","images/sofa-ocean.jpg"],["Глина","#B07A62","images/sofa-clay.jpg"],["Лён","#D9D3C5","images/sofa-linen.jpg"]];
if($("#sofaphoto")||$("#sofa")){
  const setF=i=>{const [n,c,src]=FAB[i];
    $$("#sofa .f").forEach(e=>e.style.fill=c);
    const st=$(".stage");if(st)st.style.setProperty("--halo",c);
    const pic=$("#sofaphoto");if(pic)pic.src=src;
    $("#fname").textContent=n;const n2=$("#fname2");if(n2)n2.textContent=n;
    $("#forder").href="contacts.html?fabric="+encodeURIComponent(n);
    $$("#sw button").forEach((b,k)=>b.setAttribute("aria-pressed",k===i))};
  $("#sw").innerHTML=FAB.map((x,i)=>`<button style="--c:${x[1]}" aria-label="${x[0]}" aria-pressed="false" onclick="setF(${i})"></button>`).join("");
  window.setF=setF;setF(0);
}

/* ---------- каталог ---------- */
if($("#catalog")){
  const P=new URLSearchParams(location.search);
  const prices=PRODUCTS.map(p=>p.price),pmin=Math.min(...prices),pmax=Math.max(...prices);
  const mats=[...new Set(PRODUCTS.map(p=>p.mat).filter(Boolean))].sort(),colors=[...new Set(PRODUCTS.map(p=>p.color).filter(Boolean))].sort();
  const uniq=k=>[...new Set(PRODUCTS.map(p=>p[k]).filter(Boolean))].sort();
  const S={cat:(["all","fav",...CATEGORIES.map(c=>c.id)].includes(P.get("cat")||location.hash.slice(1))?(P.get("cat")||location.hash.slice(1)):"all"),q:P.get("q")||"",min:+P.get("min")||0,max:+P.get("max")||0,
    sale:P.get("sale")==="1",neu:P.get("new")==="1",mats:new Set((P.get("mat")||"").split(",").filter(Boolean)),colors:new Set((P.get("color")||"").split(",").filter(Boolean)),brands:new Set((P.get("brand")||"").split(",").filter(Boolean)),styles:new Set((P.get("style")||"").split(",").filter(Boolean)),stocks:new Set((P.get("stock")||"").split(",").filter(Boolean)),sort:(["def","asc","desc","sale"].includes(P.get("sort"))?P.get("sort"):"def"),n:PAGE_SIZE};
  [[S.mats,mats],[S.colors,colors],[S.brands,uniq("brand")],[S.styles,uniq("style")],[S.stocks,uniq("stock")]].forEach(([set,allowed])=>{for(const value of set)if(!allowed.includes(value))set.delete(value)});
  S.min=Math.max(0,Number.isFinite(S.min)?S.min:0);S.max=Math.max(0,Number.isFinite(S.max)?S.max:0);
  if(S.max&&S.min>S.max)[S.min,S.max]=[S.max,S.min];
  const base=(skipCat)=>PRODUCTS.filter(p=>{
    if(!skipCat&&S.cat!=="all"&&(S.cat==="fav"?!favs.includes(p.id):p.cat!==S.cat))return false;
    if(S.q&&!smartMatch(p,S.q))return false;
    if(S.min&&p.price<S.min)return false;if(S.max&&p.price>S.max)return false;
    if(S.sale&&!p.old)return false;if(S.neu&&p.tag!=="Новинка")return false;
    if(S.mats.size&&!S.mats.has(p.mat))return false;if(S.colors.size&&!S.colors.has(p.color))return false;if(S.brands.size&&!S.brands.has(p.brand))return false;if(S.styles.size&&!S.styles.has(p.style))return false;if(S.stocks.size&&!S.stocks.has(p.stock))return false;return true});
  const url=()=>{const q=new URLSearchParams();
    if(S.cat!=="all")q.set("cat",S.cat);if(S.q)q.set("q",S.q);if(S.min)q.set("min",S.min);if(S.max)q.set("max",S.max);
    if(S.sale)q.set("sale",1);if(S.neu)q.set("new",1);if(S.mats.size)q.set("mat",[...S.mats]);if(S.colors.size)q.set("color",[...S.colors]);if(S.brands.size)q.set("brand",[...S.brands]);if(S.styles.size)q.set("style",[...S.styles]);if(S.stocks.size)q.set("stock",[...S.stocks]);if(S.sort!=="def")q.set("sort",S.sort);
    history.replaceState(null,"",q.toString()?"?"+q:location.pathname)};
  const BN={all:["Мебель для вашего дома","Диваны, кресла, столы, кровати, хранение и свет — всё для спокойной и красивой комнаты.","showroom"],fav:["Избранное","Предметы, которые вы отметили сердечком.","showroom"],sofas:["Мягкие формы для отдыха","Диваны, которые делают гостиную уютнее.","cat-sofas"],chairs:["Комфорт в каждой детали","Кресла и стулья, которые создают уют в вашем доме.","cat-chairs"],tables:["Стол — центр дома","Обеденные, журнальные и рабочие столы.","cat-tables"],beds:["Спальня, в которой спокойно","Кровати для хорошего отдыха.","cat-beds"],storage:["Порядок без лишнего","Шкафы и комоды для повседневных вещей.","cat-storage"],light:["Свет создаёт настроение","Лампы и светильники для каждой комнаты.","cat-light"]};
  const banner=()=>{const b=S.q?["Результаты поиска","По запросу «"+S.q.replace(/[<>&"']/g,"")+"»","showroom"]:BN[S.cat]||BN.all;
    $("#banner").innerHTML=`<div class="banner-copy"><h1>${b[0]}</h1><p>${b[1]}</p><button class="btn" type="button" onclick="document.getElementById('catalog').scrollIntoView({behavior:'smooth'})">Смотреть коллекцию</button></div><div class="banner-photo" role="img" aria-label="Интерьер в природных оттенках" style="--bx:${({sofas:0,chairs:0,beds:50,tables:100,storage:100,light:100})[S.cat]??0}%;--by:${["storage","light"].includes(S.cat)?100:0}%"></div>`};
  const chips=()=>{const c=[];
    
    if(S.q)c.push(["q","","«"+esc(S.q)+"»"]);
    if(S.min||S.max)c.push(["price","","Цена "+(S.min?"от "+fmt(S.min):"")+" "+(S.max?"до "+fmt(S.max):"")]);
    if(S.sale)c.push(["sale","","Со скидкой"]);if(S.neu)c.push(["neu","","Новинки"]);
    S.mats.forEach(v=>c.push(["mat",v,v]));S.colors.forEach(v=>c.push(["color",v,v]));S.brands.forEach(v=>c.push(["brand",v,v]));S.styles.forEach(v=>c.push(["style",v,v]));S.stocks.forEach(v=>c.push(["stock",v,v]));
    $$("#filt [data-m]").forEach(s=>{const id=s.dataset.m;s.textContent=PRODUCTS.filter(p=>(S.cat==="all"||S.cat==="fav"||p.cat===S.cat)&&(id==="*"||p.mat===id)).length});
    $("#chips").innerHTML=c.map(x=>`<button type="button" class="chip" onclick="rmChip('${x[0]}','${x[1]}')" aria-label="Убрать фильтр: ${x[2]}">${x[2]} <span aria-hidden="true">×</span></button>`).join("")};
  window.rmChip=(k,v)=>{if(k==="cat")S.cat="all";if(k==="q"){S.q="";$("#q").value=""}if(k==="price")S.min=S.max=0;if(k==="sale")S.sale=false;if(k==="neu")S.neu=false;if(k==="mat")S.mats.delete(v);if(k==="color")S.colors.delete(v);if(k==="brand")S.brands.delete(v);if(k==="style")S.styles.delete(v);if(k==="stock")S.stocks.delete(v);S.n=PAGE_SIZE;build();list()};
  const list=()=>{
    let l=base(false);
    if(S.sort==="asc")l.sort((a,b)=>a.price-b.price);
    if(S.sort==="desc")l.sort((a,b)=>b.price-a.price);
    if(S.sort==="sale")l.sort((a,b)=>(b.old?b.old/b.price:0)-(a.old?a.old/a.price:0));
    const shown=l.slice(0,S.n);
    $("#count").textContent=`Найдено ${l.length} ${pl(l.length)}`;banner();
    $("#catalog").innerHTML=shown.length?shown.map(card).join(""):
      `<div class="empty"><h3>Ничего не найдено</h3><p class="lead">Измените фильтры или <a href="${INSTAGRAM}" target="_blank" rel="noopener"><u>напишите нам в Instagram</u></a>: подберём вручную.</p><button class="btn" onclick="resetF()">Сбросить фильтры</button></div>`;
    $("#more").innerHTML=l.length>S.n?`<p class="lead" style="margin-bottom:12px">Показано ${shown.length} из ${l.length}</p><button class="btn line" style="color:var(--ink)" onclick="more()">Показать ещё</button>`:"";
    $$("#filt [data-c]").forEach(s=>{const id=s.dataset.c;s.textContent=id==="all"?base(true).length:id==="fav"?base(true).filter(p=>favs.includes(p.id)).length:base(true).filter(p=>p.cat===id).length});
    $("#reset").style.display=(S.cat!=="all"||S.q||S.min||S.max||S.sale||S.neu||S.mats.size||S.colors.size||S.brands.size||S.styles.size||S.stocks.size)?"inline-block":"none";
    chips();url();
  };
  const build=()=>{
    const real=S.cat!=="all"&&S.cat!=="fav",cname=S.cat==="all"?"Каталог":S.cat==="fav"?"Избранное":catOf(S.cat).name;
    const inCat=PRODUCTS.filter(p=>!real||p.cat===S.cat);
    const subs=real?[["*","Все "+cname.toLowerCase()],...[...new Set(inCat.map(p=>p.mat).filter(Boolean))].sort().map(x=>[x,x])]:[["all","Все товары"],["fav","Избранное"],...CATEGORIES.map(c=>[c.id,c.name])];
    const acc=(t,items,name,set)=>`<details class="fg row" ${set.size?"open":""}><summary>${t}${I.chev}</summary><div class="fg-b">${items.map(x=>`<label><input type="checkbox" name="${name}" value="${x}" ${set.has(x)?"checked":""}><span>${x}</span></label>`).join("")}</div></details>`;
    $("#filt").innerHTML=`<div class="fh"><h3>Фильтры</h3><button class="fx" aria-label="Закрыть фильтры" onclick="$('#filt').classList.remove('open')">×</button></div>
    <div class="side-top"><button class="back" type="button" onclick="setCat('all')">${I.arL} Все категории</button><h2 class="side-title">${cname}</h2>
    <ul class="catlist">${subs.map(([v,t])=>{const on=real?(v==="*"?S.mats.size===0:S.mats.size===1&&S.mats.has(v)):v===S.cat;return `<li><button type="button" class="${on?"on":""}" onclick="${real?`setSub('${v}')`:`setCat('${v}')`}"><span>${t}</span><em ${real?`data-m="${v}"`:`data-c="${v}"`}></em></button></li>`}).join("")}</ul></div>
    <div class="side-f"><details class="fgroup" open><summary><h3>Фильтры</h3>${I.chev}</summary>
      <div class="fblock"><h4>Цена, ₽</h4>
      <div class="pr"><label class="pin"><i>от</i><input id="pmin" type="number" min="0" placeholder="${pmin}" value="${S.min||""}" aria-label="Цена от"></label><label class="pin"><i>до</i><input id="pmax" type="number" min="0" placeholder="${pmax}" value="${S.max||""}" aria-label="Цена до"></label></div></div>
      <div class="fblock"><h4>Цвет</h4><div class="clrs">${colors.map(c=>`<label class="clr" title="${c}"><input type="checkbox" name="color" value="${c}" aria-label="${c}" ${S.colors.has(c)?"checked":""}><span style="--c:${CLR[c]||"#ccc"}"></span></label>`).join("")}</div></div></details>
    ${acc("Материал",mats,"mat",S.mats)}${acc("Бренд",uniq("brand"),"brand",S.brands)}${acc("Стиль",uniq("style"),"style",S.styles)}${acc("Наличие",uniq("stock"),"stock",S.stocks)}
    <div class="mob-only"><button class="btn line" type="button" onclick="resetF()">Сбросить всё</button><button class="btn apply" type="button" onclick="$('#filt').classList.remove('open')">Показать результаты</button></div></div>`;
    $("#sort").value=S.sort;
    [["mat",S.mats],["color",S.colors],["brand",S.brands],["style",S.styles],["stock",S.stocks]].forEach(([n,set])=>$$(`#filt input[name=${n}]`).forEach(i=>i.onchange=()=>{i.checked?set.add(i.value):set.delete(i.value);S.n=PAGE_SIZE;list()}));
    let t;const pr=()=>{clearTimeout(t);t=setTimeout(()=>{S.min=Math.max(0,+$("#pmin").value||0);S.max=Math.max(0,+$("#pmax").value||0);if(S.max&&S.min>S.max)[S.min,S.max]=[S.max,S.min];$("#pmin").value=S.min||"";$("#pmax").value=S.max||"";S.n=PAGE_SIZE;list()},350)};
    $("#pmin").oninput=pr;$("#pmax").oninput=pr;
  };
  window.setSub=v=>{S.mats=v==="*"?new Set():new Set([v]);S.n=PAGE_SIZE;build();list()};
  window.setCat=id=>{S.mats.clear();S.cat=id;S.n=PAGE_SIZE;build();list();window.scrollTo({top:0,behavior:"smooth"})};
  window.more=()=>{S.n+=PAGE_SIZE;list()};
  window.resetF=()=>{S.sort="def";Object.assign(S,{cat:"all",q:"",min:0,max:0,sale:false,neu:false,mats:new Set(),colors:new Set(),brands:new Set(),styles:new Set(),stocks:new Set(),n:PAGE_SIZE});build();list()};
  window.redraw=()=>list();
  let qt;$("#q").addEventListener("input",e=>{clearTimeout(qt);qt=setTimeout(()=>{S.q=e.target.value.trim();S.n=PAGE_SIZE;list()},200)});
  $("#sort").onchange=e=>{S.sort=e.target.value;list()};
  build();list();
}

/* ---------- страница товара ---------- */
if(page==="product"){
  const p=byId(+new URLSearchParams(location.search).get("id")),root=$("#product");
  if(!p){root.innerHTML=`<div class="empty"><h3>Товар не найден</h3><a class="btn" href="catalog.html">В каталог</a></div>`}
  else{
    const c=catOf(p.cat),n=Math.max(imgs(p).length,3),m=Math.ceil(p.price/12);
    document.title=p.name+" — МК Мебель";
    const specs=[["Категория",c.name],["Материал",p.mat],["Цвет",p.color],["Размеры (Ш×В×Г), см",p.w&&p.h&&p.d?`${p.w} × ${p.h} × ${p.d}`:""],["Артикул",p.id]].filter(s=>s[1]);
    const N=PHOTOS?Math.max(imgs(p).length,1):6;let gi=0;
    const rows=[["Бренд",p.brand],["Материал",p.mat],["Высота",p.h?p.h+" см":""],["Ширина",p.w?p.w+" см":""],["Глубина",p.d?p.d+" см":""],["Вес",p.wt?p.wt+" кг":"—"]].filter(s=>s[1]);
    const others=[];PRODUCTS.filter(x=>x.name===p.name&&x.mat===p.mat&&x.color&&x.color!==p.color).forEach(x=>{if(others.length<2&&!others.some(o=>o.color===x.color))others.push(x)});
    const pair=PRODUCTS.filter(x=>x.cat!==p.cat&&x.color&&x.color===p.color).slice(0,4);
    const acc=(t,body)=>`<details class="row"><summary>${t}${I.chevR}</summary><div class="acc-b">${body}</div></details>`;
    const shown=Math.min(N,N>5?4:N);
    root.innerHTML=`<nav class="crumbs" aria-label="Навигация"><a href="catalog.html">Каталог</a><i>›</i><a href="catalog.html?cat=${c.id}">${c.name}</a><i>›</i><span>${p.name}</span></nav>
    <div class="pd3"><div class="gal"><div class="gthumbs">${Array.from({length:shown},(_,i)=>`<button type="button" aria-label="Фото ${i+1}" class="${i?"":"on"}" onclick="gal(${i})">${ph(p,"",i)}</button>`).join("")}${N>5?`<button type="button" class="more-t" aria-label="Ещё ${N-4} фото" onclick="gal(4)">+${N-4}</button>`:""}</div>
      <div class="gstage"><div id="gmain">${ph(p,"Фото 1",0)}</div><button type="button" class="fav product-fav ${favs.includes(p.id)?"on":""}" data-id="${p.id}" aria-label="В избранное" aria-pressed="${favs.includes(p.id)}" onclick="toggleFav(${p.id})">${I.heart}</button>
      ${N>1?`<button type="button" class="gnav gprev" aria-label="Предыдущее фото" onclick="galStep(-1)">${I.arL}</button><span class="gcount" id="gcount">1 / ${N}</span><button type="button" class="gnav gnext" aria-label="Следующее фото" onclick="galStep(1)">${I.arR}</button>`:""}</div></div>
    <div class="pcol"><h1>${p.name}</h1>${p.brand?`<p class="pbrand">${p.brand}</p>`:""}
      <div class="price product-price"><strong>${fmt(p.price)}</strong>${p.old?`<s>${fmt(p.old)}</s>`:""}</div>
      <p class="pdesc">${p.desc||"Размеры, цвет и сроки изготовления уточним под ваш интерьер. Напишите нам, и мы подберём подходящий вариант."}</p>
      ${p.color?`<div class="pcolor"><span><b>Цвет:</b> ${p.color}</span><div class="pswatches"><span class="sel" style="--c:${CLR[p.color]||"#ccc"}" role="img" aria-label="${p.color}, выбран"></span>${others.map(o=>`<a href="product.html?id=${o.id}" style="--c:${CLR[o.color]||"#ccc"}" title="${o.color}" aria-label="Цвет: ${o.color}"></a>`).join("")}</div></div>`:""}
      <div class="pbuy"><button class="btn buy" type="button" onclick="add(${p.id})">Добавить в корзину</button><button type="button" class="fav-sq product-fav fav ${favs.includes(p.id)?"on":""}" data-id="${p.id}" aria-label="В избранное" aria-pressed="${favs.includes(p.id)}" onclick="toggleFav(${p.id})">${I.heart}</button></div>
      <ul class="pnotes">${p.stock?`<li>${I.check}<span>Наличие уточняйте у менеджера</span></li>`:""}<li>${I.truck}<span>${SHOP.delivery}</span></li><li>${I.info}<span>${SHOP.warranty}</span></li></ul></div>
    <aside class="pspec" aria-label="Характеристики"><h2>Характеристики</h2><p class="demo-specs">Демонстрационная модель. Размеры, материалы и цену реального товара уточняйте у менеджера.</p><dl class="specl">${rows.map(s=>`<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join("")}</dl>
      ${acc("Доставка и оплата",'Условия доставки и оплаты согласуем при оформлении заявки. <a href="contacts.html"><u>Связаться с нами</u></a>')}
      ${acc("Гарантия и возврат",'Условия гарантии и возврата уточняйте у менеджера. <a href="contacts.html"><u>Задать вопрос</u></a>')}
      ${acc("Подходит к этому товару",pair.length?`<div class="pair">${pair.map(x=>`<a href="product.html?id=${x.id}">${ph(x,"",0)}<span>${x.name}<small>${fmt(x.price)}</small></span></a>`).join("")}</div>`:"Подберём сочетающиеся предметы — напишите нам.")}</aside></div>`;
    window.gal=i=>{gi=i;$("#gmain").innerHTML=ph(p,"Фото "+(i+1),i);$$(".gthumbs button:not(.more-t)").forEach((b,k)=>b.classList.toggle("on",k===i));const g=$("#gcount");if(g)g.textContent=`${i+1} / ${N}`};
    window.galStep=d=>gal((gi+d+N)%N);
    const ld=document.createElement("script");ld.type="application/ld+json";
    ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Product",name:p.name,sku:String(p.id),category:c.name,offers:{"@type":"Offer",price:p.price,priceCurrency:"RUB",}});
    document.head.appendChild(ld);
    const sim=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
    $("#similar").innerHTML=sim.length?`<h2 style="margin-bottom:24px">Похожие товары</h2><div class="grid">${sim.map(card).join("")}</div>`:"";
    let rec=store("mk_recent",[]).filter(x=>x!==p.id);const rv=rec.slice(0,4).map(byId).filter(Boolean);
    $("#recent").innerHTML=rv.length?`<h2 style="margin-bottom:24px">Вы смотрели</h2><div class="grid">${rv.map(card).join("")}</div>`:"";
    put("mk_recent",[p.id,...rec].slice(0,12));
  }
}

/* ---------- контакты ---------- */
const f=$("#leadform");
if(f)f.addEventListener("submit",async e=>{e.preventDefault();const message=f.elements.msg.value.trim();const status=$("#ok");status.style.display="block";if(!message){status.textContent="Напишите вопрос или добавьте товар в корзину.";f.elements.msg.focus();return}try{await navigator.clipboard.writeText(message);status.textContent="Сообщение скопировано. Откройте Instagram и вставьте его в переписку с магазином."}catch(error){f.elements.msg.focus();f.elements.msg.select();status.textContent="Выделили сообщение. Скопируйте его вручную и вставьте в Instagram."}});
const fp=new URLSearchParams(location.search).get("fabric");
if(f&&fp)f.elements.msg.value="Интересует диван в цвете «"+fp+"»";
const orderMessage=new URLSearchParams(location.search).get("order");
if(f&&orderMessage)f.elements.msg.value=orderMessage;
drawCart();
$$(".fcnt").forEach(e=>e.textContent=favs.length);


/* ===== v2: умный поиск, мегаменю, лайтбокс, клавиатура ===== */
function removeItem(id){cart=cart.filter(x=>x.id!==id);put("mk_cart",cart);drawCart()}
function smartMatch(p,q){
  const ru=s=>String(s||"").toLowerCase().replace(/ё/g,"е");
  const SYN={софа:["диван"],кушетка:["диван"],лампа:["освещение"],светильник:["освещение"],торшер:["освещение"],люстра:["освещение"],тумба:["комод"],постель:["кровать"],табурет:["стул"],табуретка:["стул"]};
  const hay=ru([p.name,catOf(p.cat).name,p.mat,p.color,p.brand,p.style].join(" ")),words=hay.split(/[^а-яa-z0-9]+/).filter(Boolean);
  const l1=(a,b)=>{if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,e=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++e>1)return false;if(a.length>b.length)i++;else if(a.length<b.length)j++;else{i++;j++}}return e+(a.length-i)+(b.length-j)<=1};
  return ru(q).split(/[^а-яa-z0-9]+/).filter(Boolean).every(t=>{
    if(/^\d+$/.test(t)&&String(p.id)===t)return true;
    return [t,...(SYN[t]||[])].some(x=>{const s=x.length>5?x.slice(0,-2):x.length>3?x.slice(0,-1):x;
      return hay.includes(s)||(x.length>=5&&words.some(w=>l1(w.slice(0,x.length),x)))})})}
(function(){
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const form=$(".hsearch"),inp=form&&$("input",form);
  let hide=()=>{};
  if(inp){
    form.insertAdjacentHTML("beforeend",'<button type="button" class="sclose" aria-label="Закрыть поиск">×</button><div class="sdrop" id="sdrop" hidden></div>');
    inp.setAttribute("autocomplete","off");inp.setAttribute("aria-controls","sdrop");
    const dd=$("#sdrop");let t,idx=-1;
    const SC=[["Диваны до 60 000 ₽","cat=sofas&max=60000"],["Столы","cat=tables"],["Кровати со скидкой","cat=beds&sale=1"],["Освещение","cat=light"],["Новинки","new=1"],["Шкафы и комоды","cat=storage"]]
      .filter(([,qs])=>{const u=new URLSearchParams(qs);return PRODUCTS.some(p=>(!u.get("cat")||p.cat===u.get("cat"))&&(!u.get("max")||p.price<=+u.get("max"))&&(!u.get("sale")||p.old)&&(!u.get("new")||p.tag==="Новинка"))});
    const show=h=>{dd.innerHTML=h;dd.hidden=false;idx=-1};
    hide=()=>{dd.hidden=true;inp.setAttribute("aria-expanded","false")};
    const scen=()=>'<p class="sd-h">Быстрый выбор</p><div class="sd-sc">'+SC.map(([l,qs])=>`<a href="catalog.html?${qs}">${l}</a>`).join("")+"</div>";
    const run=()=>{const q=inp.value.trim();
      try{
        if(!q){show(scen());return}
        const r=PRODUCTS.filter(p=>smartMatch(p,q));
        if(!r.length){show(`<p class="sd-empty">По запросу «${esc(q)}» ничего не нашлось. Попробуйте другое слово или выберите готовую подборку.</p>`+scen());return}
        show(r.slice(0,6).map(p=>`<a class="sd-i" href="product.html?id=${p.id}">${ph(p,"",0)}<span><b>${esc(p.name)}</b><small>${esc([catOf(p.cat).name,p.mat,p.color].filter(Boolean).join(" · "))}</small></span><em>${fmt(p.price)}</em></a>`).join("")+`<a class="sd-all" href="catalog.html?q=${encodeURIComponent(q)}">Все результаты (${r.length}) ↗</a>`);
      }catch(e){show('<p class="sd-empty">Поиск временно недоступен. Откройте <a href="catalog.html"><u>каталог</u></a>.</p>')}};
    inp.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(run,160)});
    inp.addEventListener("focus",run);
    inp.addEventListener("keydown",e=>{const it=$$(".sd-i,.sd-all",dd);
      if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!it.length)return;idx=(idx+(e.key==="ArrowDown"?1:-1)+it.length)%it.length;it.forEach((a,k)=>a.classList.toggle("sel",k===idx))}
      if(e.key==="Enter"&&idx>=0){e.preventDefault();it[idx].click()}});
    document.addEventListener("click",e=>{if(!form.contains(e.target)&&e.target.id!=="msearch")hide()});
    $(".sclose",form).onclick=()=>{form.classList.remove("mopen");hide()};
    const mb=$(".mbar");
    if(mb){mb.insertAdjacentHTML("afterbegin",'<button type="button" id="msearch">Поиск</button>');
      $("#msearch").onclick=()=>{form.classList.add("mopen");inp.focus();run()}}
  }
  const nc=$('nav.main a[href="catalog.html"]');
  if(nc){const w=document.createElement("div");w.className="mega-wrap";nc.replaceWith(w);w.appendChild(nc);
    w.insertAdjacentHTML("beforeend",`<div class="mega"><div class="mega-grid">${CATEGORIES.map(c=>`<a href="catalog.html?cat=${c.id}">${ph(PRODUCTS.find(p=>p.cat===c.id),"",0)}<b>${c.name}</b><small>${PRODUCTS.filter(p=>p.cat===c.id).length} моделей</small></a>`).join("")}</div></div>`)}
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();hide();if(form)form.classList.remove("mopen");const f=$("#filt");if(f)f.classList.remove("open")}});
  if(page==="product"&&$("#gmain")){
    const p=byId(+new URLSearchParams(location.search).get("id"));
    if(p){
      let k=0;const n=PHOTOS?Math.max(imgs(p).length,1):6,og=window.gal;window.gal=i=>{k=i;og(i)};
      const lb=document.createElement("div");lb.className="lb";lb.hidden=true;lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-label","Просмотр фото");
      lb.innerHTML='<button class="lb-x" aria-label="Закрыть">×</button><button class="lb-p" aria-label="Предыдущее фото">‹</button><div class="lb-i"></div><button class="lb-n" aria-label="Следующее фото">›</button>';
      document.body.appendChild(lb);
      const draw=()=>{$(".lb-i",lb).innerHTML=ph(p,"",k)},go=d=>{k=(k+d+n)%n;draw()},open=()=>{draw();lb.hidden=false;$(".lb-x",lb).focus()},g=$("#gmain");
      g.tabIndex=0;g.setAttribute("role","button");g.setAttribute("aria-label","Открыть фото на весь экран");g.style.cursor="zoom-in";
      g.onclick=open;g.onkeydown=e=>{if(e.key==="Enter")open()};
      $(".lb-x",lb).onclick=()=>{lb.hidden=true;g.focus()};$(".lb-p",lb).onclick=()=>go(-1);$(".lb-n",lb).onclick=()=>go(1);
      lb.addEventListener("click",e=>{if(e.target===lb)lb.hidden=true});
      document.addEventListener("keydown",e=>{if(lb.hidden)return;if(e.key==="Escape")lb.hidden=true;if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1)});
      const col=PRODUCTS.filter(x=>x.cat!==p.cat&&x.color&&x.color===p.color).slice(0,4);
      if(col.length&&$("#similar"))$("#similar").insertAdjacentHTML("beforeend",`<h2 style="margin:48px 0 24px">Сочетается по цвету «${p.color}»</h2><div class="grid">${col.map(card).join("")}</div>`);
      const md=document.querySelector("meta[name=description]");if(md)md.content=`${p.name} — ${fmt(p.price)}. ${[p.mat,p.color].filter(Boolean).join(", ")}. МК Мебель.`;
    }
  }
})();

const syncBadges=()=>$$(".badge").forEach(b=>b.hidden=b.textContent.trim()==="0");
syncBadges();
["drawCart","toggleFav"].forEach(n=>{const o=window[n];window[n]=function(){const r=o.apply(this,arguments);syncBadges();return r}});
