(() => {
  const nested = location.pathname.includes('/messaging/') || location.pathname.includes('/call/');
  const root = nested ? '../' : '';
  const links = [
    ['Posts page', `${root}posts.html`],
    ['Profile page', `${root}profile.html`],
    ['Sharing page', `${root}share.html`],
    ['Calling page', `${root}call/index.html`],
    ['Terms page', `${root}terms.html`]
  ];
  const header = document.querySelector('header');
  if (!header) return;
  const inner = header.querySelector(':scope > div') || header;
  if (!inner) return;
  inner.classList.add('site-header-inner');
  const wrap = document.createElement('div');
  wrap.className = 'site-menu-wrap';
  wrap.innerHTML = `<button class="profile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false"><span class="profile-menu-icon">R</span></button><div class="site-menu-backdrop" data-menu-close></div><aside class="site-menu" aria-label="Site navigation"><div class="site-menu-head"><div><strong>Relayless Messenger</strong><small>Navigate your workspace</small></div><button class="site-menu-close" type="button" aria-label="Close navigation menu" data-menu-close>&times;</button></div><nav>${links.map(([label, href]) => `<a href="${href}">${label}<span>&rarr;</span></a>`).join('')}</nav></aside>`;
  inner.append(wrap);
  const button = wrap.querySelector('.profile-menu-button');
  const close = () => { wrap.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  button.addEventListener('click', () => { const open = wrap.classList.toggle('is-open'); button.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
  wrap.querySelectorAll('[data-menu-close]').forEach(item => item.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
})();
