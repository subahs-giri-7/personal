(() => {
  const nested = location.pathname.includes('/messaging/') || location.pathname.includes('/call/');
  const root = nested ? '../' : '';
  const links = [
    ['Chats', `${root}messaging/index.html`],
    ['Posts', `${root}posts.html`],
    ['Profile', `${root}profile.html`],
    ['Sharing', `${root}share.html`],
    ['Calling', `${root}call/index.html`],
    ['Settings', `${root}settings.html`],
    ['Terms', `${root}terms.html`]
  ];
  const header = document.querySelector('header');
  if (!header) return;
  const inner = header.querySelector(':scope > div') || header;
  if (!inner) return;
  inner.classList.add('site-header-inner');
  const wrap = document.createElement('div');
  wrap.className = 'site-menu-wrap';
  wrap.innerHTML = `<button class="profile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false"><span class="profile-menu-icon"><img class="profile-menu-avatar" alt=""></span></button><div class="site-menu-backdrop" data-menu-close></div><aside class="site-menu" aria-label="Site navigation"><div class="site-menu-head"><div><strong>Relayless Messenger</strong><small>Navigate your workspace</small></div><button class="site-menu-close" type="button" aria-label="Close navigation menu" data-menu-close>&times;</button></div><nav>${links.map(([label, href]) => `<a href="${href}"${label === 'Profile' ? ' id="profileMenuLink"' : ''}>${label}<span>&rarr;</span></a>`).join('')}</nav><button id="siteLogout" class="site-menu-logout" type="button">Log out</button></aside>`;
  document.body.append(wrap);
  const button = wrap.querySelector('.profile-menu-button');
  const icon = wrap.querySelector('.profile-menu-icon');
  const avatarImage = wrap.querySelector('.profile-menu-avatar');
  const profileLink = wrap.querySelector('#profileMenuLink');
  const logout = wrap.querySelector('#siteLogout');
  const setAvatar = (photoURL, displayName) => {
    if (photoURL) {
      avatarImage.src = photoURL;
      avatarImage.hidden = false;
      icon.dataset.initial = '';
      button.classList.add('has-profile-image');
    } else {
      avatarImage.removeAttribute('src');
      avatarImage.hidden = true;
      icon.dataset.initial = (displayName || 'R').trim()[0].toUpperCase();
      button.classList.remove('has-profile-image');
    }
  };
  avatarImage.addEventListener('error', () => setAvatar('', 'R'));
  import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js').then(async ({ getApp, getApps, initializeApp }) => {
    const app = getApps().length ? getApp() : initializeApp({
      apiKey: 'AIzaSyB7ssl6jTxKdy9XAtsAcrcvTU6eQjZzzQ8',
      authDomain: 'relayless-messages.firebaseapp.com',
      projectId: 'relayless-messages',
      storageBucket: 'relayless-messages.firebasestorage.app',
      messagingSenderId: '157252473726',
      appId: '1:157252473726:web:7a2e2794c92dce7c49592f',
      measurementId: 'G-6WZGL34YLC'
    });
    const [{ getAuth, onAuthStateChanged }, { getFirestore, doc, getDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js')
    ]);
    onAuthStateChanged(getAuth(app), async user => {
      if (!user) {
        profileLink.href = `${root}profile.html`;
        return setAvatar('', 'R');
      }
      profileLink.href = `${root}profile.html?uid=${encodeURIComponent(user.uid)}`;
      let profile = {};
      try {
        const snapshot = await getDoc(doc(getFirestore(app), 'users', user.uid));
        if (snapshot.exists()) profile = snapshot.data();
      } catch {}
      setAvatar(profile.photoURL || user.photoURL, profile.displayName || user.displayName);
    });
    logout.addEventListener('click', async () => {
      await getAuth(app).signOut();
      location.href = `${root}messaging/index.html`;
    });
  }).catch(() => {});
  const close = () => { wrap.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  button.addEventListener('click', () => { const open = wrap.classList.toggle('is-open'); button.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
  wrap.querySelectorAll('[data-menu-close]').forEach(item => item.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
})();
