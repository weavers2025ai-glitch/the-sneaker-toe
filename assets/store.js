/* MONARQUE — store engine.
   Catalog = data/products.js (PRODUCTS) merged with admin overrides saved
   in this browser (localStorage 'tst_override'). Admin panel edits land
   there, so changes show on the storefront in the same browser. */
const TST = {
  wa: '923339527670',
  address: 'Shop 17-18, Basement, Town Tower, Main University Road, Peshawar',
  instagram: 'https://www.instagram.com/thesneakertoe',
  defaults: {
    storeName: 'MONARQUE',
    announcement: 'Free delivery across Pakistan on orders over Rs. 5,000 — premium shoes for the luxury lifestyle',
    heroKicker: 'Premium shoes for the luxury lifestyle',
    heroTitle: 'Step into <em>luxury</em>.',
    heroText: 'Monarque brings Pakistan 100% original sneakers, runners, football boots and premium loafers — imported stock, honest prices, delivered to your door.',
    heroImg: 'assets/hero-banner.jpg',
    heroTagTitle: '172+ styles in stock',
    heroTagSub: 'New drops every week',
    stripTitle: 'Not sure of your <em>size?</em>',
    stripText: 'Message us on WhatsApp with your foot length and we will match the perfect fit from EU 40 to 45. Easy 7-day exchange on unused pairs.',
    shipFlat: 350, freeShipOver: 5000
  }
};
function loadOverride(){ try { return JSON.parse(localStorage.getItem('tst_override')) || {}; } catch(e){ return {}; } }
function getSettings(){ const o = loadOverride(); return Object.assign({}, TST.defaults, o.settings || {}); }
function getCatalog(){
  const o = loadOverride();
  let list = PRODUCTS.slice();
  if (o.products){
    const byId = {}; o.products.forEach(p => byId[p.id] = p);
    list = list.map(p => byId[p.id] ? Object.assign({}, p, byId[p.id]) : p);
    const baseIds = new Set(list.map(p => p.id));
    o.products.filter(p => !baseIds.has(p.id)).forEach(p => list.push(p));
  }
  if (Array.isArray(o.deletedIds)) list = list.filter(p => !o.deletedIds.includes(p.id));
  return list;
}
const rs = n => 'Rs. ' + Number(n || 0).toLocaleString('en-PK');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function offPct(p){ return p.compare && p.compare > p.price ? Math.round((1 - p.price / p.compare) * 100) : 0; }
/* ---------- cart ---------- */
function getCart(){ try { return JSON.parse(localStorage.getItem('tst_cart')) || []; } catch(e){ return []; } }
function setCart(c){ localStorage.setItem('tst_cart', JSON.stringify(c)); renderCart(); }
function cartCount(){ return getCart().reduce((a, i) => a + i.qty, 0); }
function cartTotal(){ const cat = getCatalog(); return getCart().reduce((a, i) => { const p = cat.find(x => x.id === i.id); return a + (p ? p.price * i.qty : 0); }, 0); }
function addToCart(id, size, qty){
  const c = getCart(); const k = c.find(i => i.id === id && i.size === size);
  if (k) k.qty += qty; else c.push({ id, size, qty });
  setCart(c); openDrawer();
}
function renderCart(){
  const badge = document.getElementById('cartCount'); if (badge) badge.textContent = cartCount();
  const box = document.getElementById('cartItems'); if (!box) return;
  const cat = getCatalog(); const items = getCart();
  if (!items.length){ box.innerHTML = '<p style="color:var(--muted);text-align:center;padding:34px 0">Your bag is empty.<br>Add something fresh from the shop.</p>'; }
  else box.innerHTML = items.map((i, ix) => { const p = cat.find(x => x.id === i.id); if (!p) return '';
    return `<div class="citem"><img src="${root()}${esc(p.img)}" alt=""><div><b>${esc(p.name)}</b><span>EU ${esc(i.size)} × ${i.qty}</span><br><button class="rm" onclick="removeCart(${ix})">Remove</button></div><b>${rs(p.price * i.qty)}</b></div>`; }).join('');
  const t = document.getElementById('cartTotal'); if (t) t.textContent = rs(cartTotal());
}
function removeCart(ix){ const c = getCart(); c.splice(ix, 1); setCart(c); }
/* ---------- layout ---------- */
function root(){ return document.body.dataset.root || ''; }
function headerHTML(){
  const s = getSettings();
  return `<div class="anno">${esc(s.announcement)}</div>
  <header class="site"><div class="wrap nav">
    <a class="logo" href="${root()}index.html"><img id="logoImg" src="${root()}assets/logo.png" alt="" onload="var t=document.getElementById('logoText'); if(t) t.style.display='none'" onerror="this.style.display='none'"><span id="logoText">${esc(s.storeName)}<span class="dot">.</span></span></a>
    <nav>
      <a href="${root()}index.html">Home</a><a href="${root()}shop.html">Shop</a>
      <a href="${root()}shop.html?cat=Runners">Runners</a><a href="${root()}shop.html?cat=Football%20Shoes">Football</a>
      <a href="${root()}shop.html?sale=1">Sale</a><a href="${root()}about.html">About</a><a href="${root()}contact.html">Contact</a>
    </nav>
    <div class="sp"></div>
    <a class="iconbtn" href="${root()}shop.html" title="Search shop">⌕</a>
    <button class="iconbtn" onclick="openDrawer()" title="Your bag">🛍<span class="count" id="cartCount">0</span></button>
  </div></header>`;
}
function footerHTML(){
  const s = getSettings();
  return `<footer><div class="wrap">
    <div class="cols">
      <div><a class="logo" href="${root()}index.html" style="margin-bottom:14px">${esc(s.storeName)}<span class="dot">.</span></a>
      <p>100% original sneakers, runners, football boots and comfort shoes — imported stock, honest prices, delivered across Pakistan.</p>
      <p style="margin-top:12px">📍 ${esc(TST.address)}</p></div>
      <div><h4>Shop</h4><a href="${root()}shop.html">All Shoes</a><a href="${root()}shop.html?cat=Sneakers">Sneakers</a><a href="${root()}shop.html?cat=Runners">Runners</a><a href="${root()}shop.html?cat=Football%20Shoes">Football Shoes</a><a href="${root()}shop.html?cat=Formal%20Loafers">Formal Loafers</a><a href="${root()}shop.html?sale=1">Sale</a></div>
      <div><h4>Help</h4><a href="${root()}contact.html">Contact Us</a><a href="${root()}about.html">About the Store</a><a href="${root()}checkout.html">Checkout</a><a href="${root()}admin/admin.html">Admin Panel</a></div>
      <div><h4>Talk to us</h4><p>WhatsApp: <a href="https://wa.me/${TST.wa}" style="display:inline;padding:0">+92 333 952 7670</a></p><p>Instagram: <a href="${TST.instagram}" style="display:inline;padding:0">@thesneakertoe</a></p><p style="margin-top:10px">Open 7 days a week at Town Tower, University Road, Peshawar.</p></div>
    </div>
    <div class="fbottom"><span>© 2026 ${esc(s.storeName)}. All rights reserved.</span><span>Cash on Delivery • Easypaisa • JazzCash • Cards</span></div>
  </div></footer>`;
}
function drawerHTML(){
  return `<div class="overlay" id="overlay" onclick="closeAll()"></div>
  <aside class="drawer" id="drawer"><div class="dhead"><b>Your Bag</b><button class="iconbtn" onclick="closeAll()">✕</button></div>
  <div class="ditems" id="cartItems"></div>
  <div class="dfoot"><div class="row total"><span>Subtotal</span><span id="cartTotal">Rs. 0</span></div>
  <p style="font-size:12px;color:var(--muted)">Shipping calculated at checkout. Free over ${rs(getSettings().freeShipOver)}.</p>
  <a class="btn dark" href="${root()}checkout.html">Checkout →</a>
  <a class="btn" style="background:#fff;border:1px solid var(--line);color:var(--ink)" href="${root()}shop.html">Continue shopping</a></div></aside>
  <div class="modal" id="modal"><div class="box" id="modalBox"></div></div>`;
}
function openDrawer(){ document.getElementById('drawer').classList.add('on'); document.getElementById('overlay').classList.add('on'); }
function closeAll(){ ['drawer','overlay','modal'].forEach(id => { const e = document.getElementById(id); if (e) e.classList.remove('on'); }); }
/* ---------- product cards + quick view ---------- */
function cardHTML(p){
  const off = offPct(p);
  return `<article class="pcard">
    <div class="pimg" onclick="quickView(${p.id})" style="cursor:pointer"><img loading="lazy" src="${root()}${esc(p.img)}" alt="${esc(p.name)}">
    ${!p.available ? '<span class="badge out">Sold out</span>' : (off ? `<span class="badge">-${off}%</span>` : '')}</div>
    <div class="pbody"><span class="brand">${esc(p.brand)} • ${esc(p.category)}</span>
    <h3>${esc(p.name)}</h3><span class="sizes">EU ${esc(p.sizes.join(', '))}</span>
    <div class="prow"><span class="price">${p.compare ? `<s>${rs(p.compare)}</s>` : ''}${rs(p.price)}</span>
    <button class="addbtn" ${!p.available ? 'disabled' : `onclick="quickView(${p.id})"`}>${p.available ? 'Add +' : 'Sold out'}</button></div></div></article>`;
}
let qv = { id: null, size: null, qty: 1 };
function quickView(id){
  const p = getCatalog().find(x => x.id === id); if (!p) return;
  qv = { id, size: p.sizes[Math.min(2, p.sizes.length - 1)] || p.sizes[0], qty: 1 };
  const off = offPct(p);
  document.getElementById('modalBox').innerHTML = `
    <div class="mimg"><img src="${root()}${esc(p.img)}" alt="${esc(p.name)}"></div>
    <div class="mbody"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
      <span class="brand" style="font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)">${esc(p.brand)} • ${esc(p.category)}</span>
      <button class="iconbtn" onclick="closeAll()">✕</button></div>
      <h3 style="font-size:24px;line-height:1.2;margin:8px 0 6px">${esc(p.name)}</h3>
      <p class="price" style="font-size:21px">${p.compare ? `<s>${rs(p.compare)}</s>` : ''}${rs(p.price)} ${off ? `<span style="color:var(--sale);font-size:13px;font-family:var(--font)">Save ${off}%</span>` : ''}</p>
      <p style="color:var(--muted);font-size:13.5px;margin-top:8px">${p.available ? '✅ In stock — ships within 24 hours from Peshawar.' : '❌ Sold out right now — WhatsApp us to pre-order.'}</p>
      <b style="display:block;margin-top:18px;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Select size (EU)</b>
      <div class="sizepick">${p.sizes.map(s => `<button class="${s === qv.size ? 'sel' : ''}" onclick="qvSize(this,'${s}')">${s}</button>`).join('')}</div>
      <div class="qtyrow"><div class="qty"><button onclick="qvQty(-1)">−</button><input id="qvQty" value="1" readonly><button onclick="qvQty(1)">+</button></div>
      <button class="btn dark" style="flex:1;justify-content:center" ${!p.available ? 'disabled style="flex:1;justify-content:center;opacity:.45"' : `onclick="addToCart(qv.id,qv.size,qv.qty)"`}>Add to Bag</button></div>
      <a class="btn" style="width:100%;justify-content:center;margin-top:12px;background:#22b358;color:#fff" href="https://wa.me/${TST.wa}?text=${encodeURIComponent('Hi! I want to order: ' + p.name + ' (EU ' + (qv.size || '') + ') — ' + rs(p.price))}" target="_blank">Order on WhatsApp</a>
      <p style="font-size:12px;color:var(--muted);margin-top:14px">100% original • 7-day easy exchange on unused pairs • Cash on Delivery available</p>
    </div>`;
  document.getElementById('modal').classList.add('on'); document.getElementById('overlay').classList.add('on');
}
function qvSize(btn, s){ qv.size = s; btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('sel')); btn.classList.add('sel'); }
function qvQty(d){ qv.qty = Math.max(1, Math.min(9, qv.qty + d)); document.getElementById('qvQty').value = qv.qty; }
/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const h = document.getElementById('siteHeader'); if (h) h.innerHTML = headerHTML();
  const f = document.getElementById('siteFooter'); if (f) f.innerHTML = footerHTML();
  document.body.insertAdjacentHTML('beforeend', drawerHTML());
  renderCart();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .1 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  if (window.onPageReady) window.onPageReady();
});
