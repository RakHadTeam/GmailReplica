# Frontend – RakMail Gmail-Inspired Client

The frontend is a React single-page application that provides a modern, Gmail-inspired interface for sending and managing emails.  
It communicates entirely with the backend REST API.

## Features
- Compose, send, draft, delete, star mails
- Manage custom labels
- Context menu with bulk actions (star, spam, delete, restore)
- Light/Dark theme toggle
- Responsive design with Material Symbols

## Technologies
- React – Core SPA framework
- Context API & Hooks – State management
- Material Design Icons
- Fetch API – Communicates with backend
- Docker – Deployment

## How to Run

For development:
cd frontend/
npm install
npm start

Or via Docker:
docker compose up --build webserver

## Folder Structure
- src/context/ – Global state (MailAppContext)
- src/hooks/ – Custom hooks (useMailActions, useUIActions, etc.)
- src/components/ – Reusable UI components
- src/views/ – Main page rendering
- src/index.js – App entry point

## Notes
- Auth token is stored in cookies and sent via credentials: include.
- Build production version with:
npm run build