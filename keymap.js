// ============================================================
// KEYMAP — edit this file to change any shortcut.
//
// Values are KeyboardEvent.key strings:
//   single letters ('e', 'c', …) are case-insensitive
//   named keys: 'Enter', 'Escape', 'ArrowUp', 'Backspace', ']', '/'
//   an action can take several keys: delete: ['Backspace', 'Delete']
//   modifier combos are objects: { key: ',', meta: true }  →  ⌘ ,
//
// Chord leaders (goto/create/groupActions) fire when you're NOT
// typing: in the chatlist, on a focused message, or in an EMPTY
// composer. If the second key doesn't match (or the chord times
// out) while in the composer, the leader letter is typed normally.
//
// The shortcut bar at the bottom re-labels itself from this file.
// ============================================================

const KEYMAP = {

  // ---- everywhere ----
  global: {
    search: { key: 'k', meta: true },   // ⌘ K — command palette, works everywhere (even while typing)
    back: 'Escape',                     // pops the top layer, one at a time
    settings: { key: ',', meta: true }, // ⌘ ,
    privacy: { key: '.', meta: true },  // ⌘ .  blur chats (WA privacy feature)
    submit: { key: 'Enter', meta: true }, // ⌘ Enter — confirm dialogs (save edit, confirm delete)
    help: { key: '/', meta: true },     // ⌘ /  cheatsheet of all shortcuts
  },

  // ---- "go to" chord ----
  goto: {
    leader: 'g',
    inbox: 'i',           // g then i
    calls: 'c',           // g then c
    views: 'v',           // g then v — view picker (workspace views)
    archived: 'e',        // g then e — archived chats (pairs with E = archive)
    timeoutMs: 1200,      // all chords expire after this
  },

  // ---- "create" chord ----
  create: {
    leader: 'c',
    contact: 'c',         // c then c — new contact
    group: 'g',           // c then g — new group
  },


  // ---- arrows / generic navigation (lists, palette, pickers) ----
  nav: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    vimUp: 'k',           // aliases in letter-free zones only (lists, message browsing, pickers)
    vimDown: 'j',         // never in inputs — typing always wins
    left: 'ArrowLeft',
    right: 'ArrowRight',
    confirm: 'Enter',
  },

  // ---- chatlist (and archived drawer) ----
  chatlist: {
    open: 'Enter',        // open focused chat / archived drawer
    archive: 'e',         // archive (inbox) / unarchive (drawer) — Gmail/Superhuman muscle memory
    markUnread: 'u',      // toggle unread badge
    changeList: 'l',      // open list picker
  },

  // ---- open chat, composing ----
  chat: {
    send: 'Enter',
    sendAndArchive: { key: 'Enter', meta: true }, // ⌘ Enter — send (if drafted) and archive; empty composer just archives (product decision)
    details: ']',                             // toggle contact info (from a focused message — printable, so never while typing)
    browseMessages: 'ArrowUp',                // start navigating messages from composer
    jumpToCompose: { key: 'ArrowDown', meta: true }, // ⌘ ↓ — from message browsing straight back to the composer
    searchMessages: { key: 'f', meta: true }, // ⌘ f — search within the open chat
  },

  // ---- virtually-focused message ----
  message: {
    reply: 'Enter',
    copy: { key: 'c', meta: true }, // ⌘ C — copy focused message (Slack convention); bare 'c' stays the create chord
    forward: 'f',
    react: 'r',
    pin: 'p',
    star: 's',
    edit: 'e',            // own messages only — same letter as archive, different scope (Slack edits with E too)
    info: 'i',            // delivery / read receipts
    delete: ['Backspace', 'Delete'],
    // -- idea (experimental, may be removed) --
    // Space — attachment action on the focused message. Scope:
    //   audio: play / stop (Space toggles)
    //   image: open lightbox; Esc closes (Space does NOT close)
    //   video: open + autoplay; Space stops/resumes, Esc closes
    openAttachment: ' ',
  },

};
