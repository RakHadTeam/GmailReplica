# RakMail – Gmail-Inspired Mail App (Frontend)

This is the frontend React application for **RakMail**, a feature-rich mail client inspired by Gmail, built as part of the APProject. It supports sending, filtering, and labeling emails, with a clean UI and support for dark mode.

---

## Getting Started

### Run with Docker

Make sure Docker is installed. Then run:

```bash
docker compose up --build webserver
```

This command does two things:
- Starts the **React App and mail server** on port `80`, and a blacklist filter on port `4545`, and a MongoDB database on port `27017`.

---

## Key Features

- **Modern React stack** with Hooks and Context API
- **Compose, Send, Draft, Delete, and Star** mails
- **Custom labels**, managed via a dedicated label UI
- **Context menu** for bulk actions (e.g. Star, Spam, Delete)
- **Theme support** with light/dark toggle (🌞🌙)
- **Responsive design** with Material Symbols

---

## App Architecture

### Global State (Context)

All shared state is managed inside `MailAppContext.js`, including:
- `labels` – custom user-defined labels
- `mails` – list of received/sent/draft mails
- `selectedIds` – currently selected mail IDs
- `activeLabel` – current filter view ("Inbox", "Starred", etc.)

This is exposed via a custom hook:
```js
const { mailState, labelState, uiState } = useMailApp();
```

### Hooks

Custom hooks provide encapsulated logic:
- `useMailActions` – send, delete, unbin mails
- `useStarActions` – toggle starred state
- `useSpamActions` – toggle spam state
- `useUIActions` – select all, toggle single mail selection, etc.

---

## Context Menu

Right-clicking on a mail opens a custom context menu with bulk actions:

- Star / Unstar
- Mark as Spam / Remove Spam
- Delete / Permanently Delete
- Restore from Bin
- Add / Remove Labels

The menu auto-closes when clicking outside it, and it appears at the exact mouse position.

---

## Labels Panel

At the bottom of the sidebar:
- Add new labels with "Create new"
- Search labels with live filtering
- "Manage Labels" opens a full label editor

---

## Dark Mode Support

Click the top-right toggle to switch themes.

Dark mode affects:
- Backgrounds
- Icons
- Borders
- Input fields
- Scrollbars (styled via `::-webkit-scrollbar`)

---

## Folder System

- `src/context/` – global state (`MailAppContext`)
- `src/hooks/` – modular logic (e.g. `useMailActions.js`)
- `src/components/` – UI structure (Sidebar, MailList, ComposeMail)
- `src/views/` – main app rendering logic

---

## Authentication

Login is handled via a token stored in cookies.
All fetches use `credentials: 'include'` to pass auth cookies to the server.

---

## Build Scripts

- `npm start` – Dev server on `localhost:3000`
- `npm run build` – Production build in `/build` folder

---

## Backend Reference

For the API and mail server logic, refer to [`Backend.md`](../../Backend.md).

---
