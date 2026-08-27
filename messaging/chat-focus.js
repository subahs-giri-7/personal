(() => {
  const sidebar = document.querySelector('#workspace > aside');
  const nav = document.getElementById('workspaceNav');
  const chat = document.getElementById('chatPanel');
  const title = document.getElementById('chatTitle');
  const header = title?.parentElement;
  if (!sidebar || !nav || !chat || !title || !header) return;

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'chat-back rounded-md border border-blue-500 px-3 py-2 text-xs font-semibold text-blue-600';
  back.textContent = 'Back';
  back.hidden = true;
  header.prepend(back);

  const setFocusMode = (active) => {
    sidebar.classList.toggle('hidden', active);
    nav.classList.toggle('hidden', active);
    chat.classList.toggle('chat-focused', active);
    back.hidden = !active;
  };

  const sync = () => setFocusMode(title.textContent.trim() !== 'Select a conversation');
  back.addEventListener('click', () => {
    chat.classList.add('hidden');
    sidebar.classList.remove('hidden');
    nav.classList.remove('hidden');
    chat.classList.remove('chat-focused');
    back.hidden = true;
  });
  new MutationObserver(sync).observe(title, { childList: true, characterData: true, subtree: true });
  sync();
})();
