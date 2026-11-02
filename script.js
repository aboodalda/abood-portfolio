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
