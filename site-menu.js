(() => {
  const nested = location.pathname.includes('/messaging/') || location.pathname.includes('/call/');
  const root = nested ? '../' : '';
  const isLandingPage = !nested && (location.pathname.endsWith('/index.html') || location.pathname === '/' || location.pathname.endsWith('/index.html/'));
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
  if (isLandingPage) return;
  const inner = header.querySelector(':scope > div') || header;
  if (!inner) return;
  inner.classList.add('site-header-inner');
  const wrap = document.createElement('div');
  wrap.className = 'site-menu-wrap';
  wrap.innerHTML = `<button class="profile-menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false"><span class="profile-menu-icon"><img class="profile-menu-avatar" alt=""></span></button><div class="site-menu-backdrop" data-menu-close></div><aside class="site-menu" aria-label="Site navigation"><div class="site-menu-head"><div><strong>Relayless Messenger</strong><small id="siteUserStatus">Checking login…</small><small id="siteUserId" class="site-user-id">Waiting for user</small></div><button class="site-menu-close" type="button" aria-label="Close navigation menu" data-menu-close>&times;</button></div><nav>${links.map(([label, href]) => `<a href="${href}"${label === 'Profile' ? ' id="profileMenuLink"' : ''}>${label}<span>&rarr;</span></a>`).join('')}</nav><button id="siteLogout" class="site-menu-logout" type="button">Log out</button></aside>`;
  document.body.append(wrap);
  const button = wrap.querySelector('.profile-menu-button');
  const icon = wrap.querySelector('.profile-menu-icon');
  const avatarImage = wrap.querySelector('.profile-menu-avatar');
  const profileLink = wrap.querySelector('#profileMenuLink');
  const logout = wrap.querySelector('#siteLogout');
  const userStatus = wrap.querySelector('#siteUserStatus');
  const userIdLabel = wrap.querySelector('#siteUserId');
  const landingAppLink = document.getElementById('landingAppLink');
  const landingLoginPrompt = document.getElementById('landingLoginPrompt');
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
  const setLandingAuthState = (user) => {
    if (!landingAppLink) return;
    if (user) {
      landingAppLink.hidden = false;
      landingAppLink.textContent = 'Open app';
      if (landingLoginPrompt) landingLoginPrompt.classList.remove('is-visible');
      return;
    }
    landingAppLink.hidden = true;
    if (landingLoginPrompt) {
      landingLoginPrompt.classList.add('is-visible');
      landingLoginPrompt.hidden = false;
      landingLoginPrompt.textContent = 'Please log in to continue.';
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
        if (userStatus) userStatus.textContent = 'Logged out';
        if (userIdLabel) userIdLabel.textContent = 'Login required';
        if (profileLink) profileLink.href = `${root}messaging/index.html`;
        logout.hidden = true;
        button.hidden = isLandingPage;
        if (isLandingPage) wrap.style.display = 'none';
        setLandingAuthState(null);
        return setAvatar('', 'R');
      }

      if (userStatus) userStatus.textContent = 'Logged in';
      if (userIdLabel) userIdLabel.textContent = `User ID: ${user.uid}`;
      if (profileLink) profileLink.href = `${root}profile.html?uid=${encodeURIComponent(user.uid)}`;
      logout.hidden = false;
      button.hidden = false;
      wrap.style.display = '';
      setLandingAuthState(user);
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
