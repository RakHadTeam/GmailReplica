# Backend – Mail App REST API

The backend is a Node.js + Express server providing a REST API to support the mail application.  
It handles authentication, mail and label management, and integrates with the TCP-based blacklist server.

## Features
- User authentication via token
- Send, receive, update, delete mails
- Create, update, delete labels
- Integrates with Blacklist Server to filter URLs
- Serves frontend static files when built

## Technologies
- Node.js & Express – REST API and routing
- JWT – User authentication
- MongoDB – Optional persistence (default: in-memory)
- TCP socket – Talks to blacklist server
- Docker – Deployment

## 🚀 How to Run

With Docker:
docker compose up --build webserver

Requires `.env.production` file (see ../EnvironmentVariables.md).

## Folder Structure
- app.js – Main entry point
- routes/ – API endpoint definitions
- controllers/ – Business logic
- services/ – DB, TCP, JWT services
- models/ – MongoDB models (optional)
- config/ – Environment variables
- utils/ – Helper functions

## Endpoints

### Users
- POST /users – Register user
- POST /tokens – Login, returns user ID as token

### Mails
- POST /mails – Send mail
- GET /mails – Get all mails
- GET /mails/search/:query – Search mails
- GET /mails/:id – Get mail by ID
- PATCH /mails/:id – Update draft
- DELETE /mails/:id – Delete mail

### Labels
- POST /labels – Create label
- GET /labels – List all labels
- GET /labels/:id – Get label by ID
- PATCH /labels/:id – Update label
- DELETE /labels/:id – Delete label

### Blacklist
- POST /blacklist/ – Add URL to blacklist
- GET /blacklist/:id – Get URL by ID

## Notes
- Include Authorization: Bearer <token> header on all requests (after login).
- Data is stored in memory unless MongoDB is configured.