// ============================================================
// Volt single-letter shortcuts demo.
// All key bindings live in keymap.js — edit them there.
// ============================================================

// ---------------- Keymap helpers ----------------
// Match a KeyboardEvent against a keymap value:
// string | { key, meta } | array of either.
function is(e, binding) {
  const keys = Array.isArray(binding) ? binding : [binding];
  return keys.some(k => {
    if (typeof k === 'object') {
      if (!!k.meta !== e.metaKey) return false;
      if (!!k.shift !== e.shiftKey) return false;
      return e.key.toLowerCase() === k.key.toLowerCase();
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return false;
    return k.length === 1 ? e.key.toLowerCase() === k.toLowerCase() : e.key === k;
  });
}

const KEY_LABELS = {
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
  Escape: 'Esc', Backspace: '⌫', Delete: 'Del', ' ': 'Space',
};
function label(binding) {
  const k = Array.isArray(binding) ? binding[0] : binding;
  if (typeof k === 'object') return (k.meta ? '⌘' : '') + (k.shift ? '⇧' : '') + ' ' + (KEY_LABELS[k.key] || k.key.toUpperCase());
  return KEY_LABELS[k] || (k.length === 1 ? k.toUpperCase() : k);
}
function kbd(binding) { return `<kbd>${label(binding)}</kbd>`; }
// arrows + j/k, for contexts where letters are free (never inputs)
function navUp(e) { return is(e, KEYMAP.nav.up) || is(e, KEYMAP.nav.vimUp); }
function navDown(e) { return is(e, KEYMAP.nav.down) || is(e, KEYMAP.nav.vimDown); }

// ---------------- Data ----------------
// Workspace views (shared, Linear-style)
const LISTS = [
  { name: 'Backlog', color: '#e05252' },
  { name: 'Mid Market', color: '#e0b93a' },
  { name: 'Enterprise', color: '#e08a3a' },
  { name: 'SMB', color: '#2ee06f' },
];
// Private lists (yours only, WA-style chatlist filters)
const PLISTS = [
  { name: 'Family' },
  { name: 'Friends' },
  { name: 'Padel' },
];

let nextId = 500;
let chats = [
  { id: 1, name: 'Matias Carpintini (You)', avatar: '🧉', time: '08:59', preview: '📎 https://www.facebo…', unread: 0, list: null, phone: '+54 9 11 5555-0001' },
  { id: 2, name: 'Amor', avatar: '❤️', time: '13:20', preview: 'Voy', unread: 0, list: null, plist: 'Family', phone: '+54 9 11 5555-0002' },
  { id: 3, name: 'Francesco 🧀', avatar: '🧀', time: 'Wed', preview: 'You reacted ❤️ to: 🖼 3.…', unread: 0, list: 'SMB', plist: 'Friends', phone: '+39 333 555 0003' },
  { id: 4, name: 'Julian Caruso', avatar: '🎸', time: '13:43', preview: '✍️ listo!', unread: 0, list: null, plist: 'Friends', phone: '+54 9 11 7232-7458' },
  { id: 5, name: 'random', avatar: '🎲', time: '13:38', preview: 'Federico Lombardozzi: Ⓖ S…', unread: 0, list: null, phone: null, group: true },
  { id: 6, name: 'office', avatar: '🏢', time: '13:20', preview: 'Julian Caruso: +1', unread: 3, list: null, phone: null, group: true },
  { id: 7, name: 'user-signups', avatar: '📈', time: '13:05', preview: 'Federico Lombardozzi: 🎉…', unread: 0, list: null, phone: null, group: true },
  { id: 8, name: 'Mati/Achi/Migue', avatar: '👥', time: '12:32', preview: '✍️ You: perfect!', unread: 0, list: null, phone: null, group: true },
  { id: 9, name: 'Volt & Payjoy', avatar: '💸', time: '12:21', preview: 'Manu Mao: Hola equipo…', unread: 1, list: 'Enterprise', phone: null, group: true },
  { id: 10, name: 'Miguel Morkin', avatar: '📷', time: '12:08', preview: '🖼 Photo', unread: 0, list: null, plist: 'Padel', phone: '+54 9 11 5555-0010' },
  { id: 11, name: 'dev', avatar: '💻', time: '11:55', preview: 'You reacted 😂 to: "traidor"', unread: 0, list: null, phone: null, group: true },
];
let archived = [
  { id: 100, name: 'Volt', avatar: '⚡', time: '13:42', preview: 'Good news! Your order number from Volt is: 065045', unread: 1, list: null, phone: null },
  { id: 101, name: 'Turnos Padel', avatar: '🎾', time: 'Mon', preview: 'Reserva confirmada 19:30', unread: 0, list: null, phone: null },
];

const CALLS = [
  { name: 'Julian Caruso', avatar: '🎸', kind: 'videocam', dir: 'call_received', sub: 'Incoming · 13:02', missed: false },
  { name: 'Amor', avatar: '❤️', kind: 'call', dir: 'call_made', sub: 'Outgoing · 12:40', missed: false },
  { name: 'Miguel Morkin', avatar: '📷', kind: 'call', dir: 'call_received', sub: 'Missed · 11:15', missed: true },
  { name: 'Francesco 🧀', avatar: '🧀', kind: 'videocam', dir: 'call_made', sub: 'Outgoing · Yesterday', missed: false },
];

const MESSAGES = {
  default: [
    { author: 'Federico Lombardozzi', text: 'corto a comer! brb', time: '13:15', out: false },
    { author: 'Manu Mao', text: 'Che le hackearon el WhatsApp a mi viejo', time: '13:16', out: false },
    { author: 'Manu Mao', text: 'Alguno sabe como se hace en estos escenarios', time: '13:18', out: false },
    { author: 'Santiago Santana', text: 'En la info de contacto abajo del todo hay un botón para reportar cuenta pero no sé cómo actúan en esos casos', time: '13:19', out: false },
    { author: null, text: 'Aprovecha a almorzar! 🍝', time: '13:19', out: true },
    { author: 'Julian Caruso', text: '+1', time: '13:20', out: false },
    { author: null, text: 'Salgo unos mins! 🏃', time: '12:39', out: true },
    { author: 'Miguel Morkin', text: '', image: true, time: '13:21', out: false },
    { author: null, text: '', audio: true, dur: '0:07', time: '13:22', out: true },
    { author: 'Julian Caruso', text: '', video: true, dur: '0:32', time: '13:23', out: false },
  ],
};

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// ---------------- State ----------------
// One virtual focus. Layers stack; the back key pops the top one.
let location_ = 'inbox';    // 'inbox' | 'calls'
let view = 'list';          // 'list' | 'chat'
let sel = 1;                // index in middle column rows
let drawerOpen = false;
let drawerSel = 0;
let openId = null;
let msgSel = -1;
let detailsOpen = false;
let reactOpen = false, reactSel = 1;
let paletteOpen = false, paletteSel = 0;
let lpOpen = false, lpSel = 0, lpChatId = null;
let fwdOpen = false, fwdSel = 0, fwdQuery = '', fwdChecked = new Set();
let viewsOpen = false, viewsSel = 0;       // o v — Linear-style view picker
let filterMode = 'all';     // 'all' | 'unread' | <list name>
let createOpen = null;      // null | 'contact' | 'group'
let createPrefill = { name: '', phone: '' };
let infoOpen = false, infoIdx = -1;  // info drawer pinned to one message
let settingsOpen = false;
let privacy = false;
let csOpen = false, csQuery = '', csSel = 0;   // in-chat search drawer
let editOpen = false, editIdx = -1;            // edit-message modal
let delOpen = false, delIdx = -1;              // delete-confirmation dialog
let helpOpen = false;
let lbType = null;            // lightbox: null | 'image' | 'video'
let vidPlaying = false;       // video lightbox playback state
let playingIdx = -1;          // audio message currently "playing" inline
let recording = false;        // ⌘⇧A voice-note recording
let chipMode = null;        // null | 'reply'
let chordLeader = null, chordTimer = null;

const $ = id => document.getElementById(id);
const $chats = $('chats'), $arch = $('archivedchats'), $pane = $('chatpane'),
      $toast = $('toast'), $bar = $('shortcutsbar'), $drawer = $('drawer'),
      $dim = $('dim'), $palette = $('palette'), $pinput = $('paletteinput'),
      $presults = $('paletteresults'), $lp = $('listpicker'), $lpitems = $('lpitems'),
      $pills = $('filterpills'), $fwd = $('fwdmodal'), $views = $('viewsmodal'), $lightbox = $('lightbox'),
      $create = $('createmodal'),
      $settings = $('settingsdrawer'), $help = $('helpmodal'), $edit = $('editmodal'), $del = $('deletemodal'),
      $sidenav = $('sidenav');

function allChats() { return [...chats, ...archived]; }
function findChat(id) { return allChats().find(c => c.id === id); }
function contacts() { return chats.filter(c => c.phone && !c.group); }

// Chatlist filter pills: All / Unread / private lists (WA-style)
function filterOptions() {
  return [
    { key: 'all', label: 'All', count: 0 },
    { key: 'unread', label: 'Unread', count: chats.filter(c => c.unread).length },
    ...PLISTS.map(l => ({ key: l.name, label: l.name, count: chats.filter(c => c.plist === l.name).length })),
  ];
}
// Workspace views: All / shared views (o v picker + sidenav)
function viewOptions() {
  return [
    { key: 'all', label: 'All', count: 0 },
    ...LISTS.map(l => ({ key: l.name, label: l.name, color: l.color, count: chats.filter(c => c.list === l.name).length })),
  ];
}
function visibleChats() {
  if (filterMode === 'all') return chats;
  if (filterMode === 'unread') return chats.filter(c => c.unread);
  if (LISTS.some(l => l.name === filterMode)) return chats.filter(c => c.list === filterMode);
  return chats.filter(c => c.plist === filterMode);
}
function hasArchRow() { return location_ === 'inbox' && filterMode === 'all'; }
function isViewFilter() { return LISTS.some(l => l.name === filterMode); }
function anyOverlay() {
  return paletteOpen || lpOpen || !!createOpen || editOpen || delOpen || helpOpen || fwdOpen || viewsOpen || !!lbType;
}

// ---------------- Render: sidenav ----------------
function renderNav() {
  $sidenav.querySelectorAll('[data-nav]').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === location_ && !(el.dataset.nav === 'inbox' && isViewFilter())));
  $sidenav.querySelectorAll('[data-view]').forEach(el => {
    el.classList.toggle('active', location_ === 'inbox' && filterMode === el.dataset.view);
    el.onclick = () => openView(el.dataset.view);
  });
}
function keyOf(binding) { return (Array.isArray(binding) ? binding[0] : binding).toLowerCase(); }

// ---------------- Render: middle column ----------------
function chatRowHTML(c) {
  return `
    <div class="avatar">${c.avatar}</div>
    <div class="chat-info">
      <div class="chat-top">
        <span class="chat-name">${c.name}</span>
        <span class="chat-time">${c.time}</span>
      </div>
      <div class="chat-preview"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.preview}</span>
        ${c.plist ? `<span class="list-tag">${c.plist}</span>` : ''}
      </div>
    </div>
    ${c.unread ? `<span class="unread">${c.unread}</span>` : ''}`;
}

function renderList() {
  $('listtitle').textContent = location_ === 'calls' ? 'Calls' : (isViewFilter() ? filterMode : 'Inbox');
  renderPills();
  $chats.innerHTML = '';

  if (location_ === 'calls') {
    CALLS.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'call-row' + (view === 'list' && !drawerOpen && i === sel ? ' selected' : '');
      el.innerHTML = `
        <div class="avatar">${c.avatar}</div>
        <div class="call-meta">
          <div class="call-name">${c.name}</div>
          <div class="call-sub ${c.missed ? 'missed' : ''}"><span class="msy">${c.dir}</span> ${c.sub}</div>
        </div>
        <span class="call-kind msy">${c.kind}</span>`;
      $chats.appendChild(el);
    });
    return;
  }

  const off = hasArchRow() ? 1 : 0;
  if (hasArchRow()) {
    const archRow = document.createElement('div');
    archRow.className = 'chat archived-row' + (view === 'list' && !drawerOpen && sel === 0 ? ' selected' : '');
    archRow.innerHTML = `
      <div class="avatar"><span class="msy">archive</span></div>
      <div class="chat-info"><div class="chat-top"><span class="chat-name">Archived</span></div></div>
      <span class="archived-count">${archived.length}</span>`;
    archRow.onclick = () => { sel = 0; openDrawer(); };
    $chats.appendChild(archRow);
  }

  const vis = visibleChats();
  if (!vis.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-note';
    empty.style.cssText = 'padding:30px 16px;text-align:center;color:var(--text-dim);font-size:13px';
    empty.textContent = `No chats in “${filterMode}”`;
    $chats.appendChild(empty);
  }
  vis.forEach((c, i) => {
    const row = i + off;
    const el = document.createElement('div');
    el.className = 'chat'
      + (view === 'list' && !drawerOpen && row === sel ? ' selected' : '')
      + (c.id === openId ? ' open-chat' : '');
    el.dataset.id = c.id;
    el.innerHTML = chatRowHTML(c);
    el.onclick = () => { sel = row; openChat(c.id); };
    $chats.appendChild(el);
  });
  $chats.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  document.querySelector('.chatlist').scrollLeft = 0;
}

// WA-style filter pill row under the header — no modal
function renderPills() {
  // pills belong to the Inbox — a workspace view has its own scope, no filters
  const show = location_ === 'inbox' && !isViewFilter();
  $pills.style.display = show ? 'flex' : 'none';
  if (!show) return;
  $pills.innerHTML = filterOptions().map((o, i) => `
    <button class="pillbtn ${filterMode === o.key ? 'active' : ''}" data-key="${o.key}">
      ${o.color ? `<span class="dot" style="background:${o.color}"></span>` : ''}${o.label}${o.count ? ` <span class="pcount">${o.count}</span>` : ''}
    </button>`).join('');
  $pills.querySelectorAll('.pillbtn').forEach(el =>
    el.onclick = () => applyFilter(el.dataset.key));
}

function renderDrawer() {
  $drawer.classList.toggle('open', drawerOpen);
  if (!drawerOpen) return;
  $arch.innerHTML = '';
  if (!archived.length) {
    $arch.innerHTML = '<div class="empty-note">No archived chats</div>';
    return;
  }
  archived.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'chat'
      + (view === 'list' && i === drawerSel ? ' selected' : '')
      + (c.id === openId ? ' open-chat' : '');
    el.dataset.id = c.id;
    el.innerHTML = chatRowHTML(c);
    el.onclick = () => { drawerSel = i; openChat(c.id); };
    $arch.appendChild(el);
  });
  $arch.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  // scrollIntoView during the slide-in can drag the whole column sideways
  document.querySelector('.chatlist').scrollLeft = 0;
}

// ---------------- Render: chat pane ----------------
function msgsOf() {
  const chat = findChat(openId);
  if (!chat) return [];
  if (!MESSAGES[chat.id]) MESSAGES[chat.id] = MESSAGES.default.map(m => ({ ...m }));
  return MESSAGES[chat.id];
}

function csMatches() {
  const q = csQuery.trim().toLowerCase();
  if (!q) return [];
  return msgsOf().map((m, i) => ({ m, i })).filter(x => x.m.text.toLowerCase().includes(q)).map(x => x.i);
}
function csResults() { return csMatches().slice().reverse(); } // newest first, like WA

function hl(text) {
  const q = csQuery.trim();
  if (!csOpen || !q) return text;
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return text.replace(re, s => `<mark>${s}</mark>`);
}

let paneChatId = null; // which chat the pane last rendered — scroll survives same-chat re-renders
function renderPane() {
  const draft = $('compose')?.value ?? '';
  const prevScroll = openId === paneChatId ? $('messages')?.scrollTop : null;
  const chat = findChat(openId);
  if (!chat) {
    paneChatId = null;
    $pane.className = 'chatpane empty';
    $pane.innerHTML = `<img class="big-symbol" src="assets/Symbol-1.svg" alt=""><div>Select a chat and hit <b>${label(KEYMAP.chatlist.open)}</b></div>`;
    return;
  }
  $pane.className = 'chatpane';
  const msgs = msgsOf();
  const matches = csMatches();
  $pane.innerHTML = `
    <div class="chat-main">
      <div class="chat-header">
        <div class="avatar">${chat.avatar}</div>
        <div>
          <div class="title">${chat.name}</div>
          <div class="sub">${chat.group ? 'Achi, Federico, Julian, Manu, Miguel, Santiago, Tom, You' : (chat.phone || 'online')}</div>
        </div>
      </div>
      <div class="messages" id="messages">
        ${msgs.map((m, i) => `
          <div class="msg ${m.out ? 'out' : ''} ${i === msgSel ? 'selected' : ''} ${m.reaction ? 'has-reaction' : ''}" data-i="${i}">
            ${(m.pinned || m.starred) ? `<div class="flags">${m.pinned ? '<span class="msy">keep</span>' : ''}${m.starred ? '<span class="msy">star</span>' : ''}</div>` : ''}
            ${m.author ? `<div class="author">${m.author}</div>` : ''}
            ${m.quote ? `<div class="quote">${m.quote}</div>` : ''}
            ${m.image ? '<div class="img-ph"><span class="msy">image</span></div>' : ''}
            ${m.audio ? `<div class="audio-msg"><span class="msy">${playingIdx === i ? 'stop_circle' : 'play_circle'}</span><span class="wave ${playingIdx === i ? 'playing' : ''}"></span><span class="adur">${m.dur || '0:07'}</span></div>` : ''}
            ${m.video ? `<div class="img-ph video-ph"><span class="msy">play_circle</span><span class="vdur">${m.dur || ''}</span></div>` : ''}
            ${m.text ? `<div class="body">${hl(m.text)}</div>` : ''}
            <div class="time">${m.forwarded ? '<span class="edited">forwarded</span> ' : ''}${m.edited ? '<span class="edited">edited</span> ' : ''}${m.time}${m.out ? ' <span class="msy ticks">done_all</span>' : ''}</div>
            ${m.reaction ? `<div class="reaction">${m.reaction}</div>` : ''}
            ${reactOpen && i === msgSel ? `
              <div class="react-bar">
                ${REACTIONS.map((r, ri) => `<span class="${ri === reactSel ? 'rsel' : ''}">${r}</span>`).join('')}
              </div>` : ''}
          </div>`).join('')}
      </div>
      <div class="composer">
        <div class="composer-box">
          <div class="reply-chip ${chipMode ? 'on' : ''}" id="replychip"></div>
          <input id="compose" type="text" placeholder="${recording ? '● Recording audio…' : 'Type a message'}" class="${recording ? 'recording' : ''}" autocomplete="off">
        </div>
      </div>
    </div>
    <aside class="details ${(detailsOpen || csOpen || infoOpen) ? 'open' : ''}">
      ${infoOpen && msgs[infoIdx] ? `
      <div class="details-inner">
        <div class="details-top"><span class="x" id="infocl"><span class="msy">close</span></span> Message info</div>
        <div class="info-preview">
          <div class="msg ${msgs[infoIdx].out ? 'out' : ''}">
            ${msgs[infoIdx].author ? `<div class="author">${msgs[infoIdx].author}</div>` : ''}
            ${msgs[infoIdx].text}
            <div class="time">${msgs[infoIdx].time}${msgs[infoIdx].out ? ' <span class="msy ticks">done_all</span>' : ''}</div>
          </div>
        </div>
        <div class="info-row"><span class="msy ticks">done_all</span> Read <span class="sub">13:22</span></div>
        <div class="info-row"><span class="msy ticks">done_all</span> Delivered <span class="sub">13:20</span></div>
        ${chat.group ? '<div class="info-row" style="border:none;color:var(--text-dim);font-size:12.5px">Read by Julian, Manu, Santiago +3</div>' : ''}
      </div>` : csOpen ? `
      <div class="details-inner">
        <div class="details-top"><span class="x" id="cscl"><span class="msy">close</span></span> Search messages</div>
        <div class="search-box"><input id="csinput" type="text" placeholder="Search…" autocomplete="off"></div>
        <div class="s-results" id="sresults">
          ${csQuery.trim() ? (matches.length ? csResults().map((mi, ri) => {
            const m = msgs[mi];
            return `
            <div class="s-item ${ri === csSel ? 'selected' : ''}" data-ri="${ri}">
              <div class="s-time">${m.time} · ${m.author || 'You'}</div>
              <div class="s-text">${hl(m.text)}</div>
            </div>`;
          }).join('') : '<div class="s-empty">No messages found</div>')
          : '<div class="s-empty">Search messages in this chat</div>'}
        </div>
      </div>` : `
      <div class="details-inner">
        <div class="details-top"><span class="x"><span class="msy">close</span></span> Contact info</div>
        <div class="details-hero">
          <div class="avatar">${chat.avatar}</div>
          <div class="dname">${chat.name}</div>
          <div class="dphone">${chat.phone || (chat.group ? 'group · 8 participants' : '')}</div>
          <div class="details-actions">
            <div class="act" onclick="startCall('voice')" style="cursor:pointer"><div class="circ"><span class="msy">call</span></div>Voice</div>
            <div class="act" onclick="startCall('video')" style="cursor:pointer"><div class="circ"><span class="msy">videocam</span></div>Video</div>
            <div class="act"><div class="circ"><span class="msy">search</span></div>Search</div>
          </div>
        </div>
        <div class="details-sec">
          <div class="sec-title">About</div>
          <div class="sec-body">.</div>
        </div>
        <div class="details-sec">
          <div class="sec-title">Media, links and docs <span style="float:right">160</span></div>
          <div class="media-row"><div class="m"><span class="msy">image</span></div><div class="m"><span class="msy">monitoring</span></div><div class="m"><span class="msy">image</span></div><div class="m"><span class="msy">description</span></div></div>
        </div>
        <div class="details-sec" style="padding:6px 0">
          <div class="details-item"><span class="di msy">star</span> Starred messages</div>
          <div class="details-item"><span class="di msy">notifications</span> Notification settings</div>
          <div class="details-item"><span class="di msy">timer</span> <span>Disappearing messages<span class="sub">Off</span></span></div>
          <div class="details-item"><span class="di msy">shield</span> <span>Advanced chat privacy<span class="sub">On</span></span></div>
        </div>
      </div>`}
    </aside>`;

  const $msgs = $('messages');
  paneChatId = openId;
  // restore scroll (innerHTML reset it to 0); fresh chat starts at the bottom
  $msgs.scrollTop = prevScroll != null ? prevScroll : $msgs.scrollHeight;
  if (msgSel >= 0) {
    $msgs.querySelector('.msg.selected')?.scrollIntoView({ block: 'nearest' });
  }

  if (infoOpen) {
    const x = $('infocl');
    if (x) x.onclick = () => { infoOpen = false; renderPane(); renderBar(); };
  }
  if (csOpen) {
    const ci = $('csinput');
    ci.value = csQuery;
    ci.addEventListener('input', () => {
      csQuery = ci.value;
      csSel = 0;
      const rs = csResults();
      msgSel = rs.length ? rs[0] : -1;
      renderPane(); renderBar();
    });
    $('cscl').onclick = closeChatSearch;
    $('sresults').querySelectorAll('.s-item').forEach(el => {
      el.onclick = () => {
        msgSel = csResults()[+el.dataset.ri];
        csOpen = false;
        renderPane(); renderBar();
      };
    });
    $('sresults').querySelector('.s-item.selected')?.scrollIntoView({ block: 'nearest' });
    if (!anyOverlay()) ci.focus();
  } else if (!anyOverlay()) {
    if (msgSel === -1) $('compose').focus();
    else document.activeElement?.blur(); // browsing messages: nothing types anywhere
  }

  // restore draft + reply chip content after re-render
  const composeEl = $('compose');
  if (composeEl) composeEl.value = draft;
  if (chipMode) $('replychip').innerHTML = chipHTML;
}
let chipHTML = '';

// ---------------- Render: overlays ----------------
function renderOverlays() {
  $dim.classList.toggle('on', anyOverlay());
  $palette.classList.toggle('on', paletteOpen);
  $lp.classList.toggle('on', lpOpen);

  // create contact / group
  $create.classList.toggle('on', !!createOpen);
  if (createOpen === 'contact') {
    $create.innerHTML = `
      <div class="m-title"><span class="msy">person_add</span> New contact</div>
      <div class="m-body">
        <div><label>Name</label><input type="text" id="createname" value="${createPrefill.name}"></div>
        <div><label>Phone</label><input type="text" id="createphone" value="${createPrefill.phone}"></div>
      </div>
      `;
    $('createname').focus();
  } else if (createOpen === 'group') {
    $create.innerHTML = `
      <div class="m-title"><span class="msy">group_add</span> New group</div>
      <div class="m-body">
        <div><label>Group name</label><input type="text" id="groupname" placeholder="e.g. weekend-plans"></div>
      </div>
      `;
    $('groupname').focus();
  }

  // edit message (WA-style modal, ⌘Enter to save)
  $edit.classList.toggle('on', editOpen);
  if (editOpen) {
    const m = msgsOf()[editIdx];
    $edit.innerHTML = `
      <div class="m-title"><span class="msy">edit</span> Edit message</div>
      <div class="edit-preview">
        <div class="msg out">${m.text}<div class="time">${m.time} <span class="msy ticks">done_all</span></div></div>
      </div>
      <div class="m-body"><input type="text" id="editinput" value="${m.text.replace(/"/g, '&quot;')}"></div>`;
    const ei = $('editinput');
    ei.focus();
    ei.setSelectionRange(ei.value.length, ei.value.length);
  }

  // views picker (o v)
  $views.classList.toggle('on', viewsOpen);
  if (viewsOpen) {
    $views.innerHTML = `
      <div class="m-title"><span class="msy">stacks</span> Open view</div>
      <div class="m-list">
        ${viewOptions().map((o, i) => `
          <div class="m-item ${i === viewsSel ? 'selected' : ''}" data-key="${o.key}">
            <span class="dot" style="background:${o.color || 'var(--text-dim)'};width:9px;height:9px;border-radius:50%"></span>
            ${o.label}
            <span class="sub">${o.count || ''}${filterMode === o.key ? ' <span class="check msy">check</span>' : ''}</span>
          </div>`).join('')}
      </div>`;
    $views.querySelectorAll('.m-item').forEach(el =>
      el.onclick = () => openView(el.dataset.key));
    $views.querySelector('.m-item.selected')?.scrollIntoView({ block: 'nearest' });
  }

  // attachment lightbox (Space on an image/video message)
  $lightbox.classList.toggle('on', !!lbType);
  if (lbType === 'image') {
    $lightbox.innerHTML = `
      <div class="lb-body"><span class="msy">image</span><div class="lb-cap">Photo · Miguel Morkin · 13:21 (demo)</div></div>`;
  } else if (lbType === 'video') {
    $lightbox.innerHTML = `
      <div class="lb-body"><span class="msy">${vidPlaying ? 'movie' : 'pause_circle'}</span>
      <div class="lb-cap">${vidPlaying ? '▶ playing' : '⏸ stopped'} · Video · Julian Caruso · 0:32 (demo)</div></div>`;
  }

  // forward message (WA-style: search + multi-select checkboxes)
  $fwd.classList.toggle('on', fwdOpen);
  if (fwdOpen) {
    const cands = fwdCandidates();
    if (fwdSel >= cands.length) fwdSel = Math.max(cands.length - 1, 0);
    $fwd.innerHTML = `
      <div class="m-title"><span class="msy">forward</span> Forward message to</div>
      <div class="m-body" style="padding-bottom:6px"><input type="text" id="fwdinput" placeholder="Search name or number" autocomplete="off"></div>
      <div class="m-list">
        ${cands.length ? cands.map((c, i) => `
          <div class="m-item ${i === fwdSel ? 'selected' : ''}" data-id="${c.id}">
            <span class="checkbox ${fwdChecked.has(c.id) ? 'checked' : ''}">${fwdChecked.has(c.id) ? '<span class="msy">check</span>' : ''}</span>
            <div class="avatar">${c.avatar}</div> ${c.name}
            <span class="sub">${c.group ? 'group' : (c.phone || '')}</span>
          </div>`).join('') : '<div class="s-empty">No chats found</div>'}
      </div>
      `;
    const fi = $('fwdinput');
    fi.value = fwdQuery;
    fi.addEventListener('input', () => { fwdQuery = fi.value; fwdSel = 0; renderOverlays(); });
    fi.focus();
    $fwd.querySelectorAll('.m-item').forEach(el =>
      el.onclick = () => { toggleFwd(+el.dataset.id); });
    $fwd.querySelector('.m-item.selected')?.scrollIntoView({ block: 'nearest' });
  }

  // delete confirmation (⌘Enter to confirm)
  $del.classList.toggle('on', delOpen);
  if (delOpen) {
    const m = msgsOf()[delIdx];
    $del.innerHTML = `
      <div class="m-title"><span class="msy">delete</span> Delete message?</div>
      <div class="edit-preview" style="justify-content:${m.out ? 'flex-end' : 'flex-start'}">
        <div class="msg ${m.out ? 'out' : ''}">${m.author ? `<div class="author">${m.author}</div>` : ''}${m.text}<div class="time">${m.time}${m.out ? ' <span class="msy ticks">done_all</span>' : ''}</div></div>
      </div>
      `;
  }

  // shortcuts cheatsheet (⌘/) — generated from keymap.js
  $help.classList.toggle('on', helpOpen);
  if (helpOpen) {
    const G = KEYMAP.global, GO = KEYMAP.goto, CR = KEYMAP.create,
          C = KEYMAP.chatlist, CH = KEYMAP.chat, M = KEYMAP.message, N = KEYMAP.nav;
    const chord = (l, s2) => `<kbd>${label(l)}</kbd><kbd>${label(s2)}</kbd>`;
    const sections = [
      ['Global', [
        [kbd(G.search), 'Search chats'],
        [chord(GO.leader, GO.inbox), 'Go to Inbox'],
        [chord(GO.leader, GO.calls), 'Go to Calls'],
        [chord(CR.leader, CR.contact), 'New contact'],
        [chord(CR.leader, CR.group), 'New group'],
        [chord(GO.leader, GO.views), 'Go to views'],
        [chord(GO.leader, GO.archived), 'Go to archived'],
        [kbd(G.settings), 'Settings'],
        [kbd(G.privacy), 'Privacy mode (blur)'],
        [kbd(G.help), 'This cheatsheet'],
        [kbd(G.back), 'Back / close layer'],
      ]],
      ['Chatlist', [
        [kbd(N.up) + kbd(N.down), 'Navigate'],
        [kbd(C.open), 'Open chat / drawer'],
        [kbd(C.archive), 'Archive · unarchive'],
        [kbd(C.markUnread), 'Toggle unread'],
        [kbd(C.changeList), 'Move to list'],
      ]],
      ['Open chat', [
        [kbd(CH.browseMessages), 'Browse messages'],
        [kbd(KEYMAP.chat.jumpToCompose), 'Jump back to composer'],
        [kbd(CH.send), 'Send'],
        [kbd(CH.sendAndArchive), 'Send + archive'],
        [kbd(CH.searchMessages), 'Search in chat'],
        [kbd(CH.details), 'Contact info'],
      ]],
      ['Focused message', [
        [kbd(M.reply), 'Reply'],
        [kbd(M.copy), 'Copy'],
        [kbd(M.forward), 'Forward'],
        [kbd(M.react), 'React'],
        [kbd(M.pin), 'Pin'],
        [kbd(M.star), 'Star'],
        [kbd(M.edit), 'Edit (own)'],
        [kbd(M.info), 'Message info'],
        [kbd(M.openAttachment), 'Play audio / open image'],
        [kbd(M.delete), 'Delete'],
      ]],
    ];
    $help.innerHTML = `
      <div class="m-title"><span class="msy">keyboard</span> Keyboard shortcuts <span class="mk">${kbd(G.help)}</span></div>
      <div class="help-grid">
        ${sections.map(([title, rows]) => `
          <div class="help-sec">
            <div class="help-sec-title">${title}</div>
            ${rows.map(([keys, desc]) => `<div class="help-row"><span>${desc}</span><span class="help-keys">${keys}</span></div>`).join('')}
          </div>`).join('')}
      </div>
      <div class="m-foot"><span>Dialogs confirm with ${kbd(G.submit)}</span><span style="margin-left:auto">edit <b>keymap.js</b> to remap</span></div>`;
  }

  // settings — left drawer over the chatlist, like web WhatsApp
  $settings.classList.toggle('open', settingsOpen);
  if (settingsOpen) {
    $settings.innerHTML = `
      <div class="drawer-header">
        <span class="back" id="settingscl"><span class="msy">arrow_back</span></span>
        <h1>Settings</h1>
      </div>
      <div class="settings-rows">
        <div class="settings-row"><span class="msy srow">visibility_off</span> <span>Privacy mode<span class="sub">Blur chats & messages</span></span>
          <span class="right pill ${privacy ? 'onstate' : ''}">${privacy ? 'On' : 'Off'}</span></div>
        <div class="settings-row"><span class="msy srow">notifications</span> <span>Notifications</span><span class="right pill onstate">On</span></div>
        <div class="settings-row"><span class="msy srow">dark_mode</span> <span>Theme</span><span class="right pill">Dark</span></div>
        <div class="settings-row"><span class="msy srow">keyboard</span> <span>Keyboard shortcuts<span class="sub">edit keymap.js</span></span></div>
      </div>
      `;
    $('settingscl').onclick = toggleSettings;
  }
}

// ---------------- Render: shortcut bar ----------------
function renderBar() {
  const N = KEYMAP.nav, C = KEYMAP.chatlist, M = KEYMAP.message, CH = KEYMAP.chat, G = KEYMAP.global;
  if (lbType) {
    $bar.innerHTML = lbType === 'video'
      ? `<span>${kbd(KEYMAP.message.openAttachment)} ${vidPlaying ? 'stop' : 'play'}</span><span>${kbd(G.back)} close</span>`
      : `<span>${kbd(G.back)} close</span>`;
    return;
  }
  if (chordLeader) {
    const GO = KEYMAP.goto, CR = KEYMAP.create;
    if (chordLeader === keyOf(GO.leader))
      $bar.innerHTML = `<span>${kbd(GO.leader)} then…</span><span>${kbd(GO.inbox)} inbox</span><span>${kbd(GO.calls)} calls</span><span>${kbd(GO.views)} views</span><span>${kbd(GO.archived)} archived</span><span>${kbd(G.back)} cancel</span>`;
    else
      $bar.innerHTML = `<span>${kbd(CR.leader)} then…</span><span>${kbd(CR.contact)} new contact</span><span>${kbd(CR.group)} new group</span><span>${kbd(G.back)} cancel</span>`;
    return;
  }
  if (delOpen) {
    $bar.innerHTML = `<span>${kbd(G.submit)} delete</span><span>${kbd(G.back)} cancel</span>`;
  } else if (editOpen) {
    $bar.innerHTML = `<span>${kbd(G.submit)} save</span><span>${kbd(G.back)} cancel</span>`;
  } else if (settingsOpen || createOpen) {
    $bar.innerHTML = `<span>${kbd(N.confirm)} confirm</span><span>${kbd(G.back)} close</span>`;
  } else if (paletteOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} results</span><span>${kbd(N.confirm)} open</span><span>${kbd(G.back)} close</span>`;
  } else if (fwdOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} navigate</span><span>${kbd(N.confirm)} select</span><span>${kbd(G.submit)} send${fwdChecked.size ? ` (${fwdChecked.size})` : ''}</span><span>${kbd(G.back)} close</span>`;
  } else if (viewsOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} views</span><span>${kbd(N.confirm)} open</span><span>${kbd(G.back)} cancel</span>`;
  } else if (lpOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} pick</span><span>${kbd(N.confirm)} apply</span><span>${kbd(G.back)} cancel</span>`;
  } else if (reactOpen) {
    $bar.innerHTML = `<span>${kbd(N.left)}${kbd(N.right)} pick</span><span>${kbd(N.confirm)} react</span><span>${kbd(G.back)} cancel</span>`;
  } else if (csOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} results</span><span>${kbd(N.confirm)} open message</span><span>${kbd(G.back)} close search</span>`;
  } else if (view === 'chat' && recording) {
    $bar.innerHTML = `<span style="color:#e05252">● recording</span><span>${kbd(CH.send)} send</span><span>${kbd(G.back)} cancel</span>`;
  } else if (view === 'chat' && msgSel >= 0) {
    $bar.innerHTML = `<span>${kbd(M.reply)} reply</span><span>${kbd(M.copy)} copy</span>
      <span>${kbd(M.forward)} fwd</span><span>${kbd(M.react)} react</span>
      <span>${kbd(M.pin)} pin</span><span>${kbd(M.star)} star</span>
      <span>${kbd(M.edit)} edit</span><span>${kbd(M.info)} info</span>
      <span>${kbd(M.openAttachment)} open</span><span>${kbd(CH.jumpToCompose)} compose</span><span>${kbd(CH.details)} details</span><span>${kbd(M.delete)} del</span><span>${kbd(G.back)} back</span>`;
  } else if (view === 'chat') {
    $bar.innerHTML = `<span>${kbd(CH.browseMessages)} browse msgs</span><span>${kbd(CH.send)} send</span>
      <span>${kbd(CH.sendAndArchive)} send+archive</span>
      <span>${kbd(CH.searchMessages)} search</span>
      <span>${kbd(G.back)} close</span>`;
  } else if (location_ === 'calls') {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} calls</span>
      <span><kbd>${label(KEYMAP.goto.leader)} ${label(KEYMAP.goto.inbox)}</kbd> inbox</span>
      <span>${kbd(G.search)} search</span>`;
  } else if (drawerOpen) {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} navigate</span><span>${kbd(C.open)} open</span>
      <span>${kbd(C.archive)} unarchive</span><span>${kbd(G.back)} close</span>`;
  } else {
    $bar.innerHTML = `<span>${kbd(N.up)}${kbd(N.down)} navigate</span><span>${kbd(C.open)} open</span>
      <span>${kbd(C.archive)} archive</span><span>${kbd(C.markUnread)} unread</span>
      <span>${kbd(C.changeList)} list</span>
      <span>${kbd(G.search)} search</span>
      <span>${kbd(KEYMAP.goto.leader)} go to</span><span>${kbd(KEYMAP.create.leader)} create</span><span>${kbd(G.help)} help</span>`;
  }
}

function renderAll() { renderNav(); renderList(); renderDrawer(); renderPane(); renderOverlays(); renderBar(); }

// ---------------- Toast ----------------
function toast(html) {
  $toast.innerHTML = html;
  $toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => $toast.classList.remove('show'), 1600);
}
function toastKey(binding, html) { toast(`<span class="k">${label(binding)}</span> — ${html}`); }

// ---------------- Actions ----------------
function selectedChat() {
  if (drawerOpen) return archived[drawerSel];
  if (location_ !== 'inbox') return null;
  const off = hasArchRow() ? 1 : 0;
  if (hasArchRow() && sel === 0) return null;
  return visibleChats()[sel - off];
}

function openChat(id) {
  const chat = id != null ? findChat(id) : selectedChat();
  if (!chat) return;
  openId = chat.id;
  chat.unread = 0;
  view = 'chat';
  msgSel = -1;
  detailsOpen = false; reactOpen = false; csOpen = false; infoOpen = false;
  editOpen = false; editIdx = -1; chipMode = null;
  playingIdx = -1; lbType = null; vidPlaying = false;
  renderAll();
  const c = $('compose');
  if (c) c.value = '';
}

function closeChat() {
  openId = null;
  view = 'list';
  msgSel = -1;
  playingIdx = -1; lbType = null; vidPlaying = false;
  detailsOpen = false; reactOpen = false; csOpen = false; infoOpen = false;
  editOpen = false; editIdx = -1; chipMode = null;
  renderAll();
}

function openDrawer() { drawerOpen = true; drawerSel = 0; renderAll(); }
function closeDrawer() { drawerOpen = false; renderAll(); }

function archiveOrUnarchive() {
  if (drawerOpen) {
    const chat = archived[drawerSel];
    if (!chat) return;
    archived = archived.filter(c => c.id !== chat.id);
    chats.unshift(chat);
    if (drawerSel >= archived.length) drawerSel = Math.max(archived.length - 1, 0);
    if (chat.id === openId) closeChat();
    toastKey(KEYMAP.chatlist.archive, `unarchived <b>${chat.name}</b>`);
    renderAll();
    return;
  }
  const chat = selectedChat();
  if (!chat) return;
  const el = $chats.querySelector(`.chat[data-id="${chat.id}"]`);
  el?.classList.add('archiving');
  setTimeout(() => {
    if (chat.id === openId) { openId = null; view = 'list'; }
    chats = chats.filter(c => c.id !== chat.id);
    archived.unshift(chat);
    const max = visibleChats().length - 1 + (hasArchRow() ? 1 : 0);
    if (sel > max) sel = Math.max(max, 0);
    renderAll();
  }, 220);
  toastKey(KEYMAP.chatlist.archive, `archived <b>${chat.name}</b>`);
}

function markUnread() {
  const chat = selectedChat();
  if (!chat) return;
  chat.unread = chat.unread ? 0 : 1;
  toastKey(KEYMAP.chatlist.markUnread, `marked <b>${chat.name}</b> ${chat.unread ? 'unread' : 'read'}`);
  renderList(); renderDrawer();
}

// ----- List picker -----
function openListPicker() {
  const chat = selectedChat();
  if (!chat) return;
  lpChatId = chat.id;
  lpSel = Math.max(PLISTS.findIndex(l => l.name === chat.plist), 0);
  lpOpen = true;
  renderLp(); renderBar();
}
function renderLp() {
  renderOverlays();
  $lp.classList.toggle('on', lpOpen);
  if (!lpOpen) return;
  const chat = findChat(lpChatId);
  $lpitems.innerHTML = PLISTS.map((l, i) => `
    <div class="lp-item ${i === lpSel ? 'selected' : ''}">
      <span class="msy" style="font-size:15px;color:var(--text-dim)">list</span> ${l.name}
      ${chat.plist === l.name ? '<span class="check msy">check</span>' : ''}
    </div>`).join('');
}
function applyListPick() {
  const chat = findChat(lpChatId);
  const list = PLISTS[lpSel];
  chat.plist = chat.plist === list.name ? null : list.name;
  lpOpen = false;
  toastKey(KEYMAP.chatlist.changeList, `<b>${chat.name}</b> ${chat.plist ? '→ ' + chat.plist : 'removed from list'}`);
  renderAll();
}

// ----- Filter pills (click-only, like WA) -----
function applyFilter(key) {
  filterMode = key;
  sel = hasArchRow() ? 1 : 0;
  renderAll();
}

// ----- Views (o v, Linear-style) -----
function openViewsPicker() {
  viewsOpen = true;
  viewsSel = Math.max(viewOptions().findIndex(o => o.key === filterMode), 0);
  renderOverlays(); renderBar();
}
function openView(key) {
  viewsOpen = false;
  openId = null; view = 'list'; msgSel = -1; drawerOpen = false;
  detailsOpen = false; csOpen = false; infoOpen = false;
  location_ = 'inbox';
  applyFilter(key);
  toast(`view: <b>${viewOptions().find(o => o.key === key)?.label}</b>`);
}
function closeViews() { viewsOpen = false; renderOverlays(); renderBar(); refocus(); }
function openArchivedSection() {
  openId = null; view = 'list'; msgSel = -1;
  detailsOpen = false; csOpen = false; infoOpen = false;
  location_ = 'inbox'; filterMode = 'all'; sel = 0;
  drawerOpen = true; drawerSel = 0;
  renderAll();
}

// ----- Palette -----
function paletteData() {
  const q = $pinput.value.trim().toLowerCase();
  const pool = [
    ...chats.map(c => ({ ...c, where: c.list || '' })),
    ...archived.map(c => ({ ...c, where: 'Archived' })),
  ];
  if (!q) return pool;
  return pool.filter(c => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q));
}
function openPalette() {
  paletteOpen = true; paletteSel = 0;
  $pinput.value = '';
  renderPalette(); renderBar();
  $pinput.focus();
}
function closePalette() {
  paletteOpen = false;
  renderPalette(); renderBar();
  refocus();
}
function renderPalette() {
  renderOverlays();
  $palette.classList.toggle('on', paletteOpen);
  if (!paletteOpen) return;
  const items = paletteData();
  if (paletteSel >= items.length) paletteSel = Math.max(items.length - 1, 0);
  $presults.innerHTML = items.length ? items.map((c, i) => `
    <div class="p-item ${i === paletteSel ? 'selected' : ''}" data-id="${c.id}">
      <div class="avatar">${c.avatar}</div> ${c.name}
      ${c.where ? `<span class="where">${c.where}</span>` : ''}
    </div>`).join('') : '<div class="none">No results</div>';
  $presults.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  $presults.querySelectorAll('.p-item').forEach(el =>
    el.onclick = () => { paletteJump(+el.dataset.id); });
}
function paletteJump(id) {
  const inArchived = archived.some(c => c.id === id);
  paletteOpen = false;
  location_ = 'inbox';
  drawerOpen = inArchived;
  if (inArchived) drawerSel = archived.findIndex(c => c.id === id);
  else {
    filterMode = 'all';
    sel = chats.findIndex(c => c.id === id) + 1;
  }
  openChat(id);
}
$pinput.addEventListener('input', () => { paletteSel = 0; renderPalette(); });

function refocus() {
  if (anyOverlay()) return;
  if (view === 'chat') (csOpen ? $('csinput') : $('compose'))?.focus();
}

// ----- Create contact / group -----
function openCreateContact() {
  createPrefill = { name: '', phone: '' };
  createOpen = 'contact';
  renderOverlays(); renderBar();
}
function openCreateGroup() {
  createOpen = 'group';
  renderOverlays(); renderBar();
}
function confirmCreate() {
  if (createOpen === 'contact') {
    const name = $('createname').value.trim(), phone = $('createphone').value.trim();
    if (!name) return;
    toastKey(KEYMAP.create.contact, `contact saved: <b>${name}</b> ${phone}`);
  } else {
    const name = $('groupname').value.trim();
    if (!name) return;
    chats.unshift({ id: nextId++, name, avatar: '👥', time: 'now', preview: 'Group created', unread: 0, list: null, phone: null, group: true });
    toastKey(KEYMAP.create.group, `group created: <b>${name}</b>`);
  }
  createOpen = null;
  renderAll();
}
function closeCreate() { createOpen = null; renderOverlays(); renderBar(); refocus(); }

// ----- Settings / privacy -----
function toggleSettings() {
  settingsOpen = !settingsOpen;
  renderOverlays(); renderBar();
  refocus();
}
function togglePrivacy() {
  privacy = !privacy;
  document.body.classList.toggle('privacy', privacy);
  toastKey(KEYMAP.global.privacy, `privacy mode <b>${privacy ? 'on' : 'off'}</b>`);
  if (settingsOpen) renderOverlays();
}

// ----- In-chat search (right drawer, WA-style) -----
function openChatSearch() {
  if (view !== 'chat') return;
  csOpen = true; csQuery = ''; csSel = 0; msgSel = -1;
  detailsOpen = false;
  renderPane(); renderBar();
}
function closeChatSearch() {
  csOpen = false; csQuery = ''; msgSel = -1;
  renderPane(); renderBar();
}

// ----- Message actions -----
function copyMsg() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  navigator.clipboard?.writeText(m.text).catch(() => {});
  toastKey(KEYMAP.message.copy, `copied: “${m.text.slice(0, 42)}${m.text.length > 42 ? '…' : ''}”`);
}
function forwardMsg() {
  if (!msgsOf()[msgSel]) return;
  fwdOpen = true; fwdSel = 0; fwdQuery = ''; fwdChecked = new Set();
  renderOverlays(); renderBar();
}
function fwdCandidates() {
  const q = fwdQuery.trim().toLowerCase();
  const pool = allChats();
  if (!q) return pool;
  return pool.filter(c => c.name.toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q));
}
function toggleFwd(id) {
  if (fwdChecked.has(id)) fwdChecked.delete(id); else fwdChecked.add(id);
  renderOverlays(); renderBar();
}
function confirmForward() {
  const m = msgsOf()[msgSel];
  if (!m || !fwdChecked.size) return;
  const names = [];
  fwdChecked.forEach(id => {
    const c = findChat(id);
    if (!c) return;
    if (!MESSAGES[id]) MESSAGES[id] = MESSAGES.default.map(x => ({ ...x }));
    MESSAGES[id].push({ author: null, text: m.text, time: 'now', out: true, forwarded: true });
    names.push(c.name);
  });
  fwdOpen = false;
  toastKey(KEYMAP.message.forward, `forwarded to <b>${names.join(', ')}</b>`);
  renderOverlays(); renderBar(); refocus();
}
function closeForward() { fwdOpen = false; renderOverlays(); renderBar(); refocus(); }
function pinMsg() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  m.pinned = !m.pinned;
  toastKey(KEYMAP.message.pin, m.pinned ? 'pinned 📌' : 'unpinned');
  renderPane();
}
function starMsg() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  m.starred = !m.starred;
  toastKey(KEYMAP.message.star, m.starred ? 'starred ⭐' : 'unstarred');
  renderPane();
}
function deleteMsg() {
  if (!msgsOf()[msgSel]) return;
  delIdx = msgSel;
  delOpen = true;
  renderOverlays(); renderBar();
}
function confirmDelete() {
  const msgs = msgsOf();
  if (!msgs[delIdx]) return;
  msgs.splice(delIdx, 1);
  if (msgSel >= msgs.length) msgSel = msgs.length - 1;
  delOpen = false; delIdx = -1;
  toastKey(KEYMAP.message.delete, 'deleted');
  renderPane(); renderOverlays(); renderBar();
}
function closeDelete() {
  delOpen = false; delIdx = -1;
  renderOverlays(); renderBar(); refocus();
}
function editMsg() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  if (!m.out) { toastKey(KEYMAP.message.edit, 'can only edit your own messages'); return; }
  editIdx = msgSel;
  editOpen = true;
  renderOverlays(); renderBar();
}
function confirmEdit() {
  const val = $('editinput').value.trim();
  const m = msgsOf()[editIdx];
  if (!val || !m) return;
  m.text = val;
  m.edited = true;
  editOpen = false; editIdx = -1;
  toastKey(KEYMAP.global.submit, 'message edited');
  renderPane(); renderOverlays(); renderBar();
}
function closeEdit() {
  editOpen = false; editIdx = -1;
  renderOverlays(); renderBar(); refocus();
}
function msgInfo() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  if (infoOpen && infoIdx === msgSel) { infoOpen = false; infoIdx = -1; }
  else { infoOpen = true; infoIdx = msgSel; detailsOpen = false; csOpen = false; }
  renderPane(); renderBar();
}
function applyReaction() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  const r = REACTIONS[reactSel];
  m.reaction = m.reaction === r ? null : r;
  reactOpen = false;
  toastKey(KEYMAP.message.react, `reacted ${r}`);
  renderPane(); renderBar();
}
function replyMsg() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  msgSel = -1;
  chipMode = 'reply';
  chipHTML = `<b>${m.author || 'You'}</b>${m.text.slice(0, 80)}`;
  renderPane(); renderBar();
}
function sendMsg() {
  const input = $('compose');
  const text = input.value.trim();
  if (!text) return;
  const entry = { author: null, text, time: 'now', out: true };
  if (chipMode === 'reply') entry.quote = $('replychip').textContent;
  msgsOf().push(entry);
  input.value = '';
  chipMode = null; chipHTML = '';
  msgSel = -1;
  renderPane(); renderBar();
  const c = $('compose');
  if (c) c.value = '';
  const m = $('messages');
  if (m) m.scrollTop = m.scrollHeight;
}

function startCall(kind, chat) {
  chat = chat || findChat(openId);
  if (!chat) return;
  toast(`<span class="msy" style="color:var(--accent)">${kind === 'video' ? 'videocam' : 'call'}</span> ${kind} calling <b>${chat.name}</b>… (demo)`);
}

function startRecording() {
  const chat = findChat(openId);
  if (!chat || recording) return;
  recording = true;
  toastKey(KEYMAP.chat.recordAudio, `recording… ${label(KEYMAP.chat.send)} to send, ${label(KEYMAP.global.back)} to cancel`);
  renderPane(); renderBar();
}
function stopRecording(send) {
  recording = false;
  if (send) {
    msgsOf().push({ author: null, text: '', audio: true, dur: '0:07', time: 'now', out: true });
    toastKey(KEYMAP.chat.send, 'voice message sent');
  } else {
    toastKey(KEYMAP.global.back, 'recording discarded');
  }
  renderPane(); renderBar();
  const m = $('messages');
  if (m) m.scrollTop = m.scrollHeight;
}

// Space on the focused message — scope:
//   audio: toggles play / stop inline (icon + waveform reflect state)
//   image: opens the lightbox; only Esc closes it
//   video: opens the lightbox playing; Space stops/resumes, Esc closes
function openAttachment() {
  const m = msgsOf()[msgSel];
  if (!m) return;
  if (m.audio) {
    playingIdx = playingIdx === msgSel ? -1 : msgSel;
    toastKey(KEYMAP.message.openAttachment, playingIdx >= 0 ? '▶ playing voice message…' : '⏹ stopped');
    renderPane();
  } else if (m.image) {
    lbType = 'image';
    renderOverlays(); renderBar();
  } else if (m.video) {
    lbType = 'video';
    vidPlaying = true; // autoplay
    renderOverlays(); renderBar();
  } else {
    toastKey(KEYMAP.message.openAttachment, 'no attachment on this message');
  }
}
function closeLightbox() {
  lbType = null; vidPlaying = false;
  renderOverlays(); renderBar();
}

// Product decision: ⌘Enter always archives the open conversation.
// With a draft it sends first; with an empty composer it just archives —
// so the same key closes out a chat whether or not you had something to say.
function sendAndArchive() {
  const input = $('compose');
  const hadText = !!(input && input.value.trim());
  if (hadText) sendMsg();
  const chat = findChat(openId);
  if (!chat) return;
  if (chats.some(c => c.id === chat.id)) {
    chats = chats.filter(c => c.id !== chat.id);
    archived.unshift(chat);
  }
  closeChat();
  sel = Math.min(sel, visibleChats().length - 1 + (hasArchRow() ? 1 : 0));
  renderAll();
  toastKey(KEYMAP.chat.sendAndArchive, `${hadText ? 'sent & archived' : 'archived'} <b>${chat.name}</b>`);
}

// ----- Goto -----
function goTo(dest) {
  location_ = dest;
  if (dest === 'inbox') filterMode = 'all';
  view = 'list'; openId = null; msgSel = -1; drawerOpen = false; detailsOpen = false; reactOpen = false; csOpen = false; infoOpen = false;
  editOpen = false; editIdx = -1; chipMode = null;
  sel = dest === 'inbox' ? (hasArchRow() ? 1 : 0) : 0;
  toast(`<span class="k">${label(KEYMAP.goto.leader)} ${label(KEYMAP.goto[dest])}</span> — ${dest === 'inbox' ? 'Inbox' : 'Calls'}`);
  renderAll();
}

// ---------------- Chords ----------------
function chordActionsFor(leaderKey) {
  const G = KEYMAP.goto, C = KEYMAP.create;
  if (leaderKey === keyOf(G.leader)) return {
    [keyOf(G.inbox)]: () => goTo('inbox'),
    [keyOf(G.calls)]: () => goTo('calls'),
    [keyOf(G.views)]: openViewsPicker,
    [keyOf(G.archived)]: openArchivedSection,
  };
  if (leaderKey === keyOf(C.leader)) return { [keyOf(C.contact)]: openCreateContact, [keyOf(C.group)]: openCreateGroup };
  return null;
}
function leaderKeyOf(e) {
  const leaders = [KEYMAP.goto.leader, KEYMAP.create.leader];
  const hit = leaders.find(l => is(e, l));
  return hit ? keyOf(hit) : null;
}
function startChord(leaderKey) {
  chordLeader = leaderKey;
  renderBar();
  clearTimeout(chordTimer);
  chordTimer = setTimeout(() => { chordLeader = null; renderBar(); }, KEYMAP.goto.timeoutMs);
}
function clearChord() {
  clearTimeout(chordTimer);
  chordLeader = null;
  renderBar();
}
// ---------------- Keyboard ----------------
document.addEventListener('keydown', (e) => {
  const N = KEYMAP.nav, C = KEYMAP.chatlist, M = KEYMAP.message, CH = KEYMAP.chat, G = KEYMAP.global;

  // ---- edit-message modal: ⌘Enter saves, checked before the meta bailout ----
  if (editOpen) {
    if (is(e, G.submit)) { e.preventDefault(); confirmEdit(); return; }
    if (is(e, G.back)) { e.preventDefault(); closeEdit(); return; }
    return; // everything else types into the edit input
  }

  // ---- delete-confirmation dialog: ⌘Enter confirms ----
  if (delOpen) {
    if (is(e, G.submit)) { e.preventDefault(); confirmDelete(); return; }
    if (is(e, G.back)) { e.preventDefault(); closeDelete(); return; }
    e.preventDefault();
    return;
  }

  // ---- shortcuts cheatsheet ----
  if (is(e, G.help)) { e.preventDefault(); helpOpen = !helpOpen; renderOverlays(); renderBar(); if (!helpOpen) refocus(); return; }
  if (helpOpen) {
    if (is(e, G.back)) { helpOpen = false; renderOverlays(); renderBar(); refocus(); }
    e.preventDefault();
    return;
  }

  // ---- forward modal: Enter selects, ⌘Enter sends ----
  if (fwdOpen) {
    const cands = fwdCandidates();
    if (is(e, G.submit)) { e.preventDefault(); confirmForward(); return; }
    if (is(e, G.back)) { e.preventDefault(); closeForward(); return; }
    if (is(e, N.down)) { e.preventDefault(); fwdSel = Math.min(fwdSel + 1, cands.length - 1); renderOverlays(); return; }
    if (is(e, N.up)) { e.preventDefault(); fwdSel = Math.max(fwdSel - 1, 0); renderOverlays(); return; }
    if (is(e, N.confirm)) { e.preventDefault(); if (cands[fwdSel]) toggleFwd(cands[fwdSel].id); return; }
    return; // typing lands in the search input
  }

  // ---- attachment lightbox: Esc closes; Space toggles video playback only ----
  if (lbType) {
    if (is(e, G.back)) closeLightbox();
    else if (lbType === 'video' && is(e, KEYMAP.message.openAttachment)) {
      vidPlaying = !vidPlaying;
      renderOverlays(); renderBar();
    }
    e.preventDefault();
    return;
  }

  // ---- meta shortcuts, work everywhere ----
  if (is(e, G.search)) { e.preventDefault(); paletteOpen ? closePalette() : openPalette(); return; }
  if (is(e, G.settings)) { e.preventDefault(); toggleSettings(); return; }
  if (is(e, G.privacy)) { e.preventDefault(); togglePrivacy(); return; }
  if (is(e, CH.sendAndArchive) && view === 'chat' && !anyOverlay() && !csOpen && msgSel === -1) { e.preventDefault(); sendAndArchive(); return; }
  if (is(e, M.copy) && view === 'chat' && msgSel >= 0 && !anyOverlay()) { e.preventDefault(); copyMsg(); return; }
  if (is(e, CH.jumpToCompose) && view === 'chat' && msgSel >= 0 && !anyOverlay()) {
    e.preventDefault();
    msgSel = -1;
    renderPane(); renderBar();
    return;
  }
  if (is(e, CH.searchMessages) && view === 'chat' && !settingsOpen) { e.preventDefault(); openChatSearch(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  // ---- modal layers (top priority, back key pops one) ----
  if (settingsOpen) {
    if (is(e, G.back)) { e.preventDefault(); toggleSettings(); }
    return;
  }
  if (createOpen) {
    if (is(e, G.back)) { e.preventDefault(); closeCreate(); }
    else if (is(e, N.confirm)) { e.preventDefault(); confirmCreate(); }
    return; // other keys type into the modal inputs
  }
  if (paletteOpen) {
    const items = paletteData();
    if (is(e, G.back)) { e.preventDefault(); closePalette(); }
    else if (is(e, N.down)) { e.preventDefault(); paletteSel = Math.min(paletteSel + 1, items.length - 1); renderPalette(); }
    else if (is(e, N.up)) { e.preventDefault(); paletteSel = Math.max(paletteSel - 1, 0); renderPalette(); }
    else if (is(e, N.confirm)) { e.preventDefault(); if (items[paletteSel]) paletteJump(items[paletteSel].id); }
    return;
  }
  if (viewsOpen) {
    const n = viewOptions().length;
    if (is(e, G.back)) closeViews();
    else if (navDown(e)) { viewsSel = Math.min(viewsSel + 1, n - 1); renderOverlays(); }
    else if (navUp(e)) { viewsSel = Math.max(viewsSel - 1, 0); renderOverlays(); }
    else if (is(e, N.confirm)) openView(viewOptions()[viewsSel].key);
    e.preventDefault();
    return;
  }
  if (lpOpen) {
    if (is(e, G.back)) { lpOpen = false; renderOverlays(); renderBar(); }
    else if (navDown(e)) { lpSel = Math.min(lpSel + 1, PLISTS.length - 1); renderLp(); }
    else if (navUp(e)) { lpSel = Math.max(lpSel - 1, 0); renderLp(); }
    else if (is(e, N.confirm)) applyListPick();
    e.preventDefault();
    return;
  }
  if (reactOpen) {
    if (is(e, G.back)) { reactOpen = false; renderPane(); renderBar(); }
    else if (is(e, N.right)) { reactSel = Math.min(reactSel + 1, REACTIONS.length - 1); renderPane(); }
    else if (is(e, N.left)) { reactSel = Math.max(reactSel - 1, 0); renderPane(); }
    else if (is(e, N.confirm)) applyReaction();
    e.preventDefault();
    return;
  }

  // ---- pending chord: resolve second key ----
  if (lbType) {
    $bar.innerHTML = lbType === 'video'
      ? `<span>${kbd(KEYMAP.message.openAttachment)} ${vidPlaying ? 'stop' : 'play'}</span><span>${kbd(G.back)} close</span>`
      : `<span>${kbd(G.back)} close</span>`;
    return;
  }
  if (chordLeader) {
    if (is(e, G.back)) { e.preventDefault(); clearChord(); return; } // cancel chord, swallow nothing
    const actions = chordActionsFor(chordLeader);
    const act = actions && actions[e.key.toLowerCase()];
    clearChord();
    if (act) { e.preventDefault(); act(); return; }
    // no match: fall through to normal handling
  }

  // ---- in-chat search drawer: arrows walk results, Enter opens message + closes ----
  if (csOpen && view === 'chat') {
    const results = csResults();
    if (is(e, G.back)) { e.preventDefault(); closeChatSearch(); return; }
    if (is(e, N.down)) {
      e.preventDefault();
      if (results.length) { csSel = Math.min(csSel + 1, results.length - 1); msgSel = results[csSel]; renderPane(); }
      return;
    }
    if (is(e, N.up)) {
      e.preventDefault();
      if (results.length) { csSel = Math.max(csSel - 1, 0); msgSel = results[csSel]; renderPane(); }
      return;
    }
    if (is(e, N.confirm)) {
      e.preventDefault();
      if (results[csSel] != null) { msgSel = results[csSel]; csOpen = false; renderPane(); renderBar(); }
      return;
    }
    return; // typing lands in the search input
  }

  // ------- CHAT MODE -------
  if (view === 'chat') {
    if (recording) {
      e.preventDefault();
      if (is(e, CH.send)) stopRecording(true);
      else if (is(e, G.back)) stopRecording(false);
      return;
    }
    const msgs = msgsOf();

    if (is(e, G.back)) {
      e.preventDefault();
      if (infoOpen) { infoOpen = false; renderPane(); }                  // 1: close message info
      else if (detailsOpen) { detailsOpen = false; renderPane(); }       // 2: close details
      else if (msgSel >= 0) { msgSel = -1; renderPane(); renderBar(); }  // 3: back to compose
      else if (chipMode === 'reply') {                                   // 4: drop the quoted reply
        chipMode = null; chipHTML = '';
        renderPane(); renderBar();
      }
      else closeChat();                                                  // 5: close chat
      return;
    }
    if (msgSel === -1 ? is(e, CH.browseMessages) : navUp(e)) {
      e.preventDefault();
      msgSel = msgSel === -1 ? msgs.length - 1 : Math.max(msgSel - 1, 0);
      renderPane(); renderBar();
      return;
    }
    if (is(e, N.down) || (msgSel >= 0 && navDown(e))) {
      e.preventDefault();
      if (msgSel === -1) return;
      msgSel = msgSel + 1 >= msgs.length ? -1 : msgSel + 1;
      renderPane(); renderBar();
      return;
    }

    if (msgSel >= 0) {
      // single-letter shortcuts win over chord leaders here (C = copy, not create)
      if (is(e, M.reply)) { e.preventDefault(); replyMsg(); return; }
      if (is(e, M.forward)) { e.preventDefault(); forwardMsg(); return; }
      if (is(e, M.react)) { e.preventDefault(); reactOpen = true; reactSel = 1; renderPane(); renderBar(); return; }
      if (is(e, M.pin)) { e.preventDefault(); pinMsg(); return; }
      if (is(e, M.star)) { e.preventDefault(); starMsg(); return; }
      if (is(e, M.edit)) { e.preventDefault(); editMsg(); return; }
      if (is(e, M.info)) { e.preventDefault(); msgInfo(); return; }
      if (is(e, M.openAttachment)) { e.preventDefault(); openAttachment(); return; }
      if (is(e, M.delete)) { e.preventDefault(); deleteMsg(); return; }
      if (is(e, CH.details)) { e.preventDefault(); detailsOpen = !detailsOpen; infoOpen = false; renderPane(); renderBar(); return; }
      const lk = leaderKeyOf(e);
      if (lk) { e.preventDefault(); startChord(lk); return; }
      if (e.key.length === 1) e.preventDefault(); // swallow: composer is blurred while browsing
      return;
    }

    // composing: the composer owns every letter — no chords while typing
    if (is(e, CH.send)) { e.preventDefault(); sendMsg(); }
    return;
  }

  // ------- LIST MODE -------
  const lk = leaderKeyOf(e);
  if (lk) { e.preventDefault(); startChord(lk); return; }

  if (is(e, G.back)) {
    if (drawerOpen) { e.preventDefault(); closeDrawer(); }
    else if (filterMode !== 'all') { e.preventDefault(); filterMode = 'all'; sel = 1; toast('filter cleared'); renderAll(); }
    return;
  }

  if (location_ === 'calls') {
    if (navDown(e)) { e.preventDefault(); sel = Math.min(sel + 1, CALLS.length - 1); renderList(); }
    else if (navUp(e)) { e.preventDefault(); sel = Math.max(sel - 1, 0); renderList(); }
    else if (is(e, N.confirm)) { e.preventDefault(); toast(`📞 calling <b>${CALLS[sel].name}</b>… (demo)`); }
    return;
  }

  if (drawerOpen) {
    if (!archived.length) { e.preventDefault(); return; }
    if (navDown(e)) { e.preventDefault(); drawerSel = Math.min(drawerSel + 1, archived.length - 1); renderDrawer(); }
    else if (navUp(e)) { e.preventDefault(); drawerSel = Math.max(drawerSel - 1, 0); renderDrawer(); }
    else if (is(e, C.open)) { e.preventDefault(); openChat(); }
    else if (is(e, C.archive)) { e.preventDefault(); archiveOrUnarchive(); }
    else if (is(e, C.markUnread)) { e.preventDefault(); markUnread(); }
    return;
  }

  const maxSel = visibleChats().length - 1 + (hasArchRow() ? 1 : 0);
  if (navDown(e)) { e.preventDefault(); sel = Math.min(sel + 1, maxSel); renderList(); }
  else if (navUp(e)) { e.preventDefault(); sel = Math.max(sel - 1, 0); renderList(); }
  else if (is(e, C.open)) {
    e.preventDefault();
    if (hasArchRow() && sel === 0) openDrawer(); else openChat();
  }
  else if (is(e, C.archive)) { e.preventDefault(); archiveOrUnarchive(); }
  else if (is(e, C.markUnread)) { e.preventDefault(); markUnread(); }
  else if (is(e, C.changeList)) { e.preventDefault(); openListPicker(); }
});

// ---------------- Init ----------------
renderAll();
