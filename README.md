# Volt — single-letter shortcuts demo

WhatsApp-like 3-column playground (sidenav · chatlist · chat) to feel out a keyboard-first UX for Volt. The whole app is drivable from the keyboard without ever thinking about where the browser's focus is.

## Run

Open `index.html` in a browser. No build, no dependencies — plain HTML/CSS/JS, works from `file://` or any static host (GitHub Pages, Vercel, Netlify…). Funnel Sans and Material Symbols load from Google Fonts (system fallbacks offline).

---

## The focus model

### The problem with the current Volt setup

Today Volt uses native DOM focus with a green outline. That has three problems:

1. **More than one green outline can be visible at once** — you can't tell which element will actually receive the keystroke.
2. **Every action is two-step**: first *move focus* to the right element (chatlist, message, composer…), then press the shortcut. The focus dance costs more keys than the action itself.
3. Native focus travels through everything that's tabbable, so it lands in places that make no sense keyboard-wise.

### What this demo does instead (Linear-style)

**One virtual focus.** There are no focus outlines anywhere (`*:focus { outline: none }`). Instead, the app has a single *mode*, and exactly one thing is ever highlighted:

- a chat row in the chatlist (subtle background),
- a message bubble in the open chat (thin accent ring),
- or the composer (the text caret itself).

**Shortcuts follow the mode, not the DOM.** When the chatlist is the mode, `E` archives the highlighted chat — regardless of what the browser thinks is focused. When a message is the mode, `E` edits it. You never move focus *first*; you press the key and the current mode decides what it means.

**Real DOM focus is managed for you.** It sits in the composer while you write, in the search input while you search, and is *blurred entirely* while you browse messages — so pressing `S` on a message stars it and can never leak an "s" into your draft.

### The composer is sacred

The one hard rule: **while the caret is in an input, every printable key belongs to the input.** No chords, no single letters, nothing fires while you type (tests literally type `gi casa cc` into the composer and assert nothing happens). Anything that must work mid-typing uses a modifier (`⌘K`, `⌘Enter`, `⌘F`). To use letter shortcuts from the composer, step out with `↑` (into message browsing) or `Esc` — one key, not a focus hunt.

### Trade-offs we accepted

- **Same letter, two scopes, both conventional**: `E` archives in the chatlist (Gmail/Superhuman) and edits on a focused message (Slack). The scopes never overlap, and the bottom bar shows which meaning is live. Copy is `⌘C`, exactly like Slack: no selection → the focused message; selection → the browser's copy.
- **Chords don't fire while composing.** We tried firing chord leaders from an empty composer with a "type the letter back on mismatch" fallback — it worked, but any chord whose second key is a vowel misfires on real words ("**ca**sa" would open the contact modal). Typing freedom won.
- **Modifier combos are reserved for cross-mode actions** (`⌘Enter` submit, `⌘K` palette). Single letters are the default everywhere else; where no simple key existed that didn't fight typing (start call, record audio), we shipped *no* shortcut rather than a heavy one.
- **Blurring the composer while browsing messages** means an unbound letter does nothing at all, instead of "helpfully" landing in the draft. Doing nothing turned out to be less surprising than teleporting the keystroke.

---

## Esc — the universal "back"

`Esc` never closes everything at once. The UI is a stack of layers and `Esc` pops **exactly one**, always working its way back to where you type:

```
overlay (palette / picker / modal / lightbox / cheatsheet)
  → message info drawer
    → contact info drawer
      → message focus            (focus returns to the composer, ready to type)
        → quoted reply chip      (drops the quote, keeps your draft)
          → open chat            (back to the chatlist, same row highlighted)
            → archived drawer / active filter
```

From deep inside — message info open while browsing an old message — three `Esc` presses walk you out: drawer closed → focus back in the composer → chat closed. Each press is predictable and reversible, and you never lose a draft (drafts survive every re-render and layer change; they clear only on send).

The same grammar covers transient states: `Esc` cancels a pending chord, discards a recording, closes in-chat search. Its counterpart is uniform too: **`Enter` confirms** the current layer (open, send, apply, select); **`⌘Enter` confirms dialogs** (save edit, confirm delete, send forward) and, from the composer, sends **and archives**.

---

## Navigating without moving focus

Every place in the app is reachable directly, from anywhere:

- `g i` Inbox · `g c` Calls · `g v` views picker · `g e` Archived — from the chatlist, from a focused message, mid-conversation. No clicking around first.
- `⌘K` command palette — searches every chat (including archived), `Enter` jumps straight in. Works even while typing, because it's a modifier combo.
- **Workspace views** (Backlog, Mid Market, Enterprise, SMB — shared, Linear-style) open via `g v` or a sidenav click. The chatlist header takes the view's name and the Inbox filter pills disappear: different scope, different chrome.
- **Private lists** (Family, Friends… — yours only, WA-style) are the filter pills under the Inbox header (click-only) and the `L` picker.
- The bottom bar is the only shortcut-hint surface and re-renders per mode — it always answers "what can I press right now?". `⌘/` opens the full cheatsheet.

---

## Shortcuts

Everything below lives in **`keymap.js`** — edit a value, reload, and the bar / cheatsheet / toasts re-label themselves.

### Global (any mode)

| Key | Action |
|---|---|
| `⌘ K` | Command palette — search all chats, `Enter` opens (works while typing) |
| `⌘ /` | Shortcuts cheatsheet |
| `⌘ ,` | Settings (left drawer over the chatlist) |
| `⌘ .` | Privacy mode — blurs avatars, names, previews, messages (WA-style) |
| `g` → `i` / `c` / `v` / `e` | Go to Inbox / Calls / Views picker / Archived (`e`, pairing with `E` = archive) |
| `c` → `c` / `g` | Create contact / group |
| `Esc` | Pop the top layer (see above) |

Chord leaders (`g`, `c`) fire from the chatlist or a focused message — never from an input. Copy is `⌘C` (Slack's convention for a focused message), which keeps bare `c` free for the create chord everywhere outside the composer. A pending chord shows its options in the bottom bar; `Esc` cancels it.

### Chatlist (and archived drawer)

| Key | Action |
|---|---|
| `↑` `↓` / `j` `k` | Move the virtual focus |
| `Enter` | Open chat (or the Archived drawer on its row) |
| `E` | Archive — unarchive inside the drawer (Gmail/Superhuman convention) |
| `U` | Toggle unread |
| `L` | Move chat to a private list (Family, Friends…) |
| `Esc` | Close drawer / clear active filter |

### Open chat (composing)

| Key | Action |
|---|---|
| *type* | Just type — nothing is intercepted |
| `Enter` | Send |
| `⌘ Enter` | Send **and archive** — with an empty composer it just archives (product decision: one key closes out a chat either way) |
| `↑` | Step out of the composer into message browsing |
| `⌘ F` | Search in chat — right drawer, newest-first results, `↑` `↓` live-preview matches, `Enter` jumps to the message |
| `Esc` | Drop quoted reply → close chat |

### Focused message (after `↑`)

The composer is blurred here; every key acts on the highlighted bubble.

| Key | Action |
|---|---|
| `↑` `↓` / `j` `k` | Older / newer (`↓`/`j` past the newest returns to the composer) |
| `Enter` | Reply — quote chip in the composer |
| `⌘ C` | Copy message text (Slack convention — no text selected, so it takes the focused message) |
| `F` | Forward — WA modal: search, `Enter` multi-select, `⌘ Enter` send |
| `R` | React — emoji bar, `←` `→` + `Enter` |
| `P` / `S` | Pin / star (flags shown on the bubble) |
| `E` | Edit (own messages) — modal, `⌘ Enter` saves |
| `I` | Message info — right drawer, pinned to the message you opened it for |
| `]` | Contact info drawer |
| `Space` | Attachment action *(idea)*: audio play/stop · image opens (Esc closes) · video opens autoplaying, `Space` stops/resumes |
| `⌫` | Delete — confirmation dialog, `⌘ Enter` confirms |

### Dialogs & pickers

Uniform grammar: `↑` `↓` navigate, `Enter` selects/applies, `⌘ Enter` submits destructive/final actions, `Esc` cancels. Type freely in any modal input — each layer owns its keys.

## Changing shortcuts

- Single letters (`'e'`) are case-insensitive; named keys use `KeyboardEvent.key` values (`'Enter'`, `'ArrowUp'`, `']'`).
- Modifier combos are objects: `{ key: ',', meta: true }`, optional `shift: true`.
- An action can take several keys: `delete: ['Backspace', 'Delete']`.
- Experimental bindings are marked `// idea:` in `keymap.js` — expect them to change.

## Files

- `keymap.js` — every binding (edit this)
- `app.js` — state, rendering, key dispatch (one keydown listener, layer-ordered)
- `styles.css` — theme: Volt green `#58B836`, Funnel Sans, Material Symbols
- `index.html` — static shell, inline Volt combination mark
- `assets/` — Volt brand SVGs
