# Volt — single-letter shortcuts demo

WhatsApp-like 3-column playground to feel out a keyboard-first UX with **one virtual focus** (Linear-style: no focus outlines, shortcuts follow the mode, never the DOM focus).

## Run

Open `index.html` in a browser. No build, no dependencies — plain HTML/CSS/JS, works from `file://` or any static host (GitHub Pages, Vercel, Netlify…). Funnel Sans loads from Google Fonts (falls back to system sans offline).

## Change shortcuts

Everything lives in **`keymap.js`**. Edit a value, reload. The shortcut bar, sidenav hints, chord pill, and toasts re-label themselves from the keymap.

- Single letters (`'e'`, `'c'`) are case-insensitive.
- Named keys use `KeyboardEvent.key` values: `'Enter'`, `'Escape'`, `'ArrowUp'`, `'Backspace'`, `']'`, `'/'`.
- Modifier combos are objects: `{ key: ',', meta: true }` → ⌘ ,
- An action can accept several keys: `delete: ['Backspace', 'Delete']`.

## Default bindings

| Context | Key | Action |
|---|---|---|
| Anywhere | `⌘ K` | Command palette (search chats, incl. archived) — works while typing too |
| Anywhere | `⌘ /` | Shortcuts cheatsheet |
| Anywhere | `⌘ ,` | Settings |
| Anywhere | `⌘ .` | Privacy mode (blur chats, WA-style) |
| Anywhere | `g` → `i` / `c` | Go to Inbox / Calls |
| Anywhere | `c` → `c` / `g` | Create contact / group |
| Anywhere | `o` → `v` | Open workspace view (Linear-style picker) |
| Anywhere | `Esc` | Pops the top layer, one at a time |
| Chatlist | `↑` `↓` | Move virtual focus |
| Chatlist | `Enter` | Open chat / Archived drawer |
| Chatlist | `E` | Archive (unarchive inside the drawer) |
| Chatlist | `U` | Toggle unread |
| Chatlist | `L` | Move chat to a private list (Family, Friends…) |
| Chat open | `↑` | Start browsing messages from composer |
| Chat open | `⌘ F` | Search messages — right drawer, `↑` `↓` walk results, `Enter` opens the message in chat |
| Chat open | `]` | Toggle contact info panel |
| Chat open | `Enter` | Send |
| Chat open | `⌘ Enter` | Send and archive the conversation |
| Focused message | `Enter` | Reply (quote) |
| Focused message | `C` | Copy |
| Focused message | `F` | Forward — modal, `Enter` selects chats, `⌘ Enter` sends |
| Focused message | `R` | React (arrows + Enter in the emoji bar) |
| Focused message | `P` | Pin |
| Focused message | `S` | Star |
| Focused message | `E` | Edit — opens modal, `⌘ Enter` saves (own messages only) |
| Focused message | `I` | Message info — right drawer, follows arrow navigation |
| Focused message | `⌫` | Delete — confirmation dialog, `⌘ Enter` confirms |

Filter pills under the chatlist header are **private lists** (All / Unread / Family / Friends…), click-only like web WhatsApp — no shortcut. **Workspace views** (Backlog, Mid Market…) live in the sidenav and the `o v` picker. `Esc` in the chatlist clears an active filter.

Notes on collisions:
- `E` = archive in the chatlist, edit on a focused message. Different scopes, no clash.
- `C`/`F` on a focused message = copy/forward; the `c` create-chord and `f` filter only fire where those letters are free.
- Chord leaders (`g`, `c`, `o`) also work from an **empty** composer — if the second key doesn't match or the chord times out, the swallowed letter is typed into the composer instead.
- While a message is focused the composer is blurred — unbound letters do nothing. `Esc` returns focus to the composer to type.

## Files

- `keymap.js` — all key bindings (edit this)
- `app.js` — state, rendering, key dispatch
- `styles.css` — theme (colors in `:root` variables, Volt green `#58B836`, Funnel Sans)
- `index.html` — static shell, inline Volt combination mark
- `assets/` — Volt brand SVGs
