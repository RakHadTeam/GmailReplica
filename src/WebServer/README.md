# Mail REST API – APProject

This REST API is part of the APProject WebServer and provides endpoints for user management, sending and receiving mails, managing labels, and filtering content using a blacklist system.

## Running the WebServer (with Docker)
To run the web server, you can use our docker-compose setup. Make sure you have Docker installed and then run the following command:

```bash
docker compose up --build webserver server
```

This will start the web server on port `3000` by default.
And will start the blacklist server on port `4545`.

## Authorization

All requests must include a Bearer token in the `Authorization` header. The token is the UUID of the user.

Example:
```
Authorization: Bearer f2be56e6-1b6a-49a1-9579-df8bdcc85604
```
---

## Endpoints

### Users

- `POST /users` – Create a new user  
  **Request JSON:**
  ```json
  {
    "username": "alice",
    "password": "password123",
    "fullName": "Alice Smith",
    "email": "alice@example.com"
  }
  ```

### Tokens

- `POST /tokens` – Get a token (user ID) for login
  **Request JSON:**
  ```json
  {
    "username": "alice",
    "password": "password123"
  }
  ```

---

### Mails
- All mail endpoints require the user to be authenticated with a valid token.

- `POST /mails` – Send a mail
  **Request JSON:**
  ```json
  {
    "subject": "Hello",
    "body": "World",
    "recipient": "<recipient_user_id>"
  }
  ```

- `GET /mails` – Retrieve received mails

- `GET /mails/search/:query` – Search received mails by subject or body

- `GET /mails/:id` – Get a specific mail by ID
- `PATCH /mails/:id` – Update a mail
  **Request JSON:**
  ```json
  {
    "subject": "Updated Subject",
    "body": "Updated Body"
  }
  ```
- `DELETE /mails/:id` – Delete a mail

---

### Labels
- All label endpoints require the user to be authenticated with a valid token.

- `POST /labels` – Create a new label  
  **Request JSON:**
  ```json
  {
    "name": "Work"
  }
  ```

- `GET /labels` – List all labels

- `GET /labels/:id` – Get a specific label by ID

- `PATCH /labels/:id` – Update a label  
  **Request JSON:**
  ```json
  {
    "name": "Updated Work"
  }
  ```
- `DELETE /labels/:id` – Delete a label

---

### Blacklist

- `POST /blacklist` – Add URL to the blacklist  
  **Request JSON:**
  ```json
  {
    "url": "http://malicious.com"
  }
  ```

- `GET /blacklist` – Get all blacklisted URLs

---


## Notes

- All data is stored in memory for the current session.
- The API expects all requests and responses to be encoded with JSON.
- The service communicates with a blacklist TCP server on port `4545`.
