# APProject – Full Stack Mail WebApp

This project is a full-stack Gmail-style web application designed for sending, receiving, and managing mails, with support for custom labels, spam filtering, theming (including dark mode), and a TCP-based blacklist integration.

It consists of two main components:

---

## Backend – WebServer API

The backend provides a REST API for:

- **User authentication** (using tokens)
- **Mail management**: sending, receiving, drafts, search
- **Label management**: creating and organizing custom labels
- **Blacklist integration**: real-time URL filtering using a C++ TCP server

The API runs on **Express.js** and stores all data in-memory per session.

Detailed API documentation: [Backend README](./Backend.md)

---

## Frontend – RakMail Gmail-Inspired Client

The frontend is a sleek, responsive, single-page React app with the following features:

- Mail filtering and search
- Compose & draft support
- Label popup with real-time search
- Context menu actions (delete, spam, star)
- Light/Dark theme with `useTheme()` support
- Custom React hooks and central `MailAppContext`

Frontend interface lives in the `src/views` directory.  
Learn how to run and extend it here: [Frontend README](./src/views/README.md)

---

## Running the Full Stack App (with Docker)

Make sure Docker is installed, then run the following from the root:

```bash
docker compose up --build webserver blacklist_server
```

- `webserver` runs the frontend + backend on port `8000`
- `blacklist_server` runs the TCP Blacklist server on port `4545`

The blacklist server uses configuration `1000 1 2` and responds to malicious content.

> ⚠️ Note: A `.env` file must be present in the root of the project for the server to run properly.  
> This file contains essential environment variables such as `PORT` and database/token configurations.  
> If missing, the server will fall back and may show warnings or fail to start correctly.

---

### .env File Template (Included in the project)

Create a `.env` file in the root directory with the following contents:

```
# Server configuration
PORT=8000

# JWT configuration
JWT_SECRET=your_jwt_secret_key

# Other configurations (optional)
TOKEN_EXPIRY=3600 # (put in seconds, e.g., 1 hour)

```

Replace `your_jwt_secret_key` with a secure random string.  
Environment variables prefixed with `REACT_APP_` are used in the React frontend.

---

## Highlights

- Beautiful UI with dark mode and theme support
- Full CRUD for mails and labels
- Search and filtering functionality
- Dynamic context menus
- Fully Dockerized deployment

---

Feel free to explore each subcomponent and extend the functionality. Contributions welcome!
