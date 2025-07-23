# Environment Variables (.env.production)

This file contains environment variables required for the backend REST API to function correctly.
It should be placed in the `config/` folder of the backend project - `src/WebServer/config/`.

## Example
PORT=8000
JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRY=3600
MONGO_URI=mongodb://localhost:27017/rakmail

Replace `your_jwt_secret_key` with a secure random string.