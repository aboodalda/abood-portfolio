const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = [...document.querySelectorAll('.project-card')];
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
let lastFocused = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
const modal = el('div', 'project-modal');
modal.id = 'projectModal';
modal.setAttribute('aria-hidden', 'true');
const backdrop = el('div', 'modal-backdrop');
backdrop.dataset.modalClose = '';
const dialog = el('section', 'modal-dialog');
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('aria-labelledby', 'modalTitle');
const closeButton = el('button', 'modal-close', '×');
closeButton.type = 'button';
closeButton.setAttribute('aria-label', 'إغلاق التفاصيل');
closeButton.dataset.modalClose = '';
const kicker = el('div', 'modal-kicker', 'PROJECT SPOTLIGHT ✦');
const typeBox = el('div', 'modal-type');
typeBox.id = 'modalType';
const titleBox = el('h2');
titleBox.id = 'modalTitle';
const descriptionBox = el('p', 'modal-description');
descriptionBox.id = 'modalDescription';
const featuresBox = el('div', 'modal-features');
const visitLink = el('a', 'button button-primary', 'زيارة المشروع ↗');
visitLink.id = 'modalVisit';
visitLink.target = '_blank';
visitLink.rel = 'noopener';
const contactLink = el('a', 'button button-ghost', 'ناقش مشروعاً مشابهاً ↗');
contactLink.href = '#contact';
const actions = el('div', 'modal-actions');
actions.append(visitLink, contactLink);
dialog.append(closeButton, kicker, typeBox, titleBox, descriptionBox, featuresBox, actions);
modal.append(backdrop, dialog);
document.body.append(modal);

function openProject(card) {
  const title = card.querySelector('.project-meta h3')?.textContent?.trim() || 'مشروع رقمي';
  const type = card.querySelector('.project-type')?.textContent?.trim() || 'مشروع رقمي';
  const description = card.querySelector('.project-description')?.textContent?.trim() || '';
  const link = card.querySelector('.project-visual')?.href || '#contact';
  const categories = (card.dataset.category || '').split(' ');
  const tags = [];
  if (categories.includes('store')) tags.push('متجر إلكتروني', 'تجربة تسوق');
  if (categories.includes('menu')) tags.push('قائمة رقمية', 'تصفح سهل');
  if (categories.includes('web')) tags.push('واجهة ويب', 'تصميم متجاوب');
  titleBox.textContent = title;
  typeBox.textContent = type;
  descriptionBox.textContent = description;
  featuresBox.replaceChildren();
  [...new Set(tags)].forEach(label => featuresBox.append(el('span', '', label)));
  visitLink.href = link;
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeButton.focus();
}
function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}
projectCards.forEach(card => {
  const button = el('button', 'project-details-btn', 'تفاصيل المشروع ↗');
  button.type = 'button';
  button.addEventListener('click', () => openProject(card));
  card.append(button);
});
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  const filter = button.dataset.filter;
  projectCards.forEach(card => {
    const categories = (card.dataset.category || '').split(' ');
    card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
  });
}));
modal.querySelectorAll('[data-modal-close]').forEach(item => item.addEventListener('click', closeProject));
contactLink.addEventListener('click', closeProject);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeProject();
});
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      reveal.unobserve(entry.target);
    }
  }), {threshold: 0.08});
  projectCards.forEach(card => {
    card.classList.add('reveal-ready');
    reveal.observe(card);
  });
} else projectCards.forEach(card => card.classList.add('revealed'));
if ('IntersectionObserver' in window && mainNav) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    mainNav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  }), {rootMargin: '-35% 0px -55% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}
document.getElementById('year').textContent = new Date().getFullYear();


// Animated counters and section entrance motion
const statNumbers = document.querySelectorAll(".stat-number");
const projectCount = document.getElementById("projectCount");
if (projectCount) projectCount.dataset.count = String(document.querySelectorAll(".project-card").length);
function animateCounter(node) {
  const target = Number(node.dataset.count || 0), duration = 1500, start = performance.now();
  const tick = now => { const progress = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - progress, 4); node.textContent = String(Math.round(target * eased)); if (progress < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window) {
  const statsObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); statsObserver.unobserve(entry.target); } }), {threshold: .45});
  statNumbers.forEach(node => statsObserver.observe(node));
  const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("motion-visible"); motionObserver.unobserve(entry.target); } }), {threshold: .12});
  document.querySelectorAll(".service-card").forEach((node, index) => { node.style.transitionDelay = (index * 100) + "ms"; motionObserver.observe(node); });
} else { statNumbers.forEach(node => node.textContent = node.dataset.count || "0"); document.querySelectorAll(".service-card").forEach(node => node.classList.add("motion-visible")); }


/* Firebase portfolio content + animated counters (keeps static showcase as fallback) */
(function(){
 const cfg=window.PORTFOLIO_FIREBASE_CONFIG||{};
 const configured=cfg.apiKey&&cfg.projectId&&cfg.apiKey!=="YOUR_API_KEY"&&cfg.projectId!=="YOUR_PROJECT_ID";
 const counters=[...document.querySelectorAll(".count-up")];
 function animateCount(node,target,suffix=""){const duration=1400,start=performance.now();function tick(now){const p=Math.min((now-start)/duration,1),eased=1-Math.pow(1-p,4);node.textContent=Math.round(target*eased).toLocaleString("en-US")+suffix;if(p<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}
 if("IntersectionObserver" in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const n=e.target;animateCount(n,Number(n.dataset.target)||0,n.dataset.suffix||"");obs.unobserve(n);}}),{threshold:.4});counters.forEach(n=>obs.observe(n));}else counters.forEach(n=>animateCount(n,Number(n.dataset.target)||0,n.dataset.suffix||""));
 if(!configured||!window.firebase)return;
 try{if(!firebase.apps.length)firebase.initializeApp(cfg);firebase.firestore().collection("settings").doc("public").get().then(s=>{if(s.exists){const n=document.getElementById("clientsCounter");if(n){n.dataset.target=String(Math.max(0,Number(s.data().clients)||0));n.textContent="0";}}}).catch(()=>{});
 firebase.firestore().collection("projects").where("published","==",true).get().then(snap=>{
  if(!snap.size)return;
  const grid=document.getElementById("projectGrid");if(!grid)return;
  const items=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order??999)-(b.order??999));
  const esc=v=>String(v||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  grid.innerHTML=items.map(p=>{const cat=["store","menu","web"].includes(p.category)?p.category:"web";const href=/^https:\/\//i.test(p.url||"")?p.url:"#contact";const image=p.imageUrl&&/^https:\/\//i.test(p.imageUrl)?'<img src="'+esc(p.imageUrl)+'" alt="'+esc(p.title)+'" loading="lazy">':"";return '<article class="project-card revealed" data-category="'+cat+'"><a class="project-visual '+(image?'has-image':'')+'" href="'+esc(href)+'" target="_blank" rel="noopener" aria-label="فتح '+esc(p.title)+'">'+image+'<span class="visual-tag">'+esc((p.type||cat).toUpperCase())+'</span><span class="visual-arrow">↗</span></a><div class="project-meta"><div><span class="project-type">'+esc(p.type||"مشروع رقمي")+'</span><h3>'+esc(p.title)+'</h3></div><a class="project-link" href="'+esc(href)+'" target="_blank" rel="noopener" aria-label="مشاهدة '+esc(p.title)+'">↗</a></div><p class="project-description">'+esc(p.description)+'</p><button class="project-details-btn" type="button">تفاصيل المشروع ↗</button></article>';}).join("");
  const total=document.getElementById("projectsCounter");if(total){total.dataset.target=String(items.length);total.textContent="0";if("IntersectionObserver" in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){animateCount(total,items.length);o.disconnect();}}));o.observe(total);}else animateCount(total,items.length);}
  grid.querySelectorAll(".project-details-btn").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".project-card");const title=card.querySelector("h3")?.textContent||"مشروع";const url=card.querySelector(".project-visual")?.href;if(url&&url!=="#contact")window.open(url,"_blank","noopener");}));
  document.querySelectorAll(".filter-btn").forEach(b=>b.querySelector("span")&&b.dataset.filter==="all"&&(b.querySelector("span").textContent=String(items.length).padStart(2,"0")));
 }).catch(err=>console.warn("Portfolio projects could not load:",err));}catch(err){console.warn("Firebase not ready:",err);}
})();
