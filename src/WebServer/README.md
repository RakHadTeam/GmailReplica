# Mail REST API – APProject

This REST API is part of the APProject WebServer and provides endpoints for user management, sending and receiving mails, managing labels, and filtering content using a blacklist system.

## Running the WebServer (with Docker)
To run the web server, you can use our docker-compose setup. Make sure you have Docker installed and then run the following command:

```bash
docker compose up --build webserver server
```

This will start the web server on port `3000` by default.
And will start the blacklist server on port `4545`, and with configuration `1000 1 2` (Refer to [Server README](../Server/README.md)).

Example:
![image](https://github.com/user-attachments/assets/fb2f7780-7c6a-4816-aea2-a4e7a12e6b47)


## Authorization

All requests must include a Bearer token in the `Authorization` header. The token is the UUID of the user.

- `Authorization: Bearer <user_id>`
- The user ID is obtained by logging in with the `POST /tokens` endpoint.

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
---

### Tokens

- `POST /tokens` – Get a token (user ID) for authorization
  **Request JSON:**
  ```json
  {
    "username": "alice",
    "password": "password123"
  }
  ```

Example:
![image](https://github.com/user-attachments/assets/c416c6b8-1ea3-4b5a-80d0-b20a5bc03661)


---

### Mails
- All mail endpoints require the user to be authenticated with a valid token.

- `POST /mails` – Send a mail
  **Request JSON:**
  ```json
  {
    "subject": "Hello",
    "body": "World",
    "recipient": "<recipient_user_id>",
    "draft": <optional boolean, default false>,
  }
  ```

- `GET /mails` – Retrieve received mails

- `GET /mails/search/:query` – Search received mails by subject or body

- `GET /mails/:id` – Get a specific mail by ID
- `PATCH /mails/:id` – Update a mail (Only for drafts)

Example:

![image](https://github.com/user-attachments/assets/fb445f6e-f7fa-4fd8-8df5-828b7508aa2b)

  **Request JSON:**
  ```json
  {
    "subject": "Updated Subject",
    "body": "Updated Body",
    "draft": <if set to false, the mail will be sent>
  }
  ```
- `DELETE /mails/:id` – Delete a mail (Only for the user inbox)

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

Example:

![image](https://github.com/user-attachments/assets/07928d4a-a465-4010-ab07-f1cd26dc6b90)

---

### Blacklist

- `POST /blacklist/` – Add URL to the blacklist  
  **Request JSON:**
  ```json
  {
    "url": "http://malicious.com"
  }
  ```

- `GET /blacklist/:id` – Get a specific blacklist entry by ID

---


## Notes

- All data is stored in memory for the current session.
- The API expects all requests and responses to be encoded with JSON.
- The service communicates with a blacklist TCP server on port `4545`.
