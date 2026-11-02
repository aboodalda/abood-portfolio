const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = [...document.querySelectorAll('.project-card')];
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const modal = document.getElementById('projectModal');
let lastFocused = null;

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
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalType').textContent = type;
  document.getElementById('modalDescription').textContent = description;
  const tagBox = document.getElementById('modalFeatures');
  tagBox.replaceChildren();
  [...new Set(tags)].forEach(label => {
    const tag = document.createElement('span');
    tag.textContent = label;
    tagBox.append(tag);
  });
  document.getElementById('modalVisit').href = link;
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close')?.focus();
}
function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocused?.focus?.();
}

projectCards.forEach(card => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project-details-btn';
  button.textContent = 'تفاصيل المشروع ↗';
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
modal?.querySelectorAll('[data-modal-close]').forEach(item => item.addEventListener('click', closeProject));
modal?.querySelector('[data-modal-contact]')?.addEventListener('click', closeProject);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeProject();
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
