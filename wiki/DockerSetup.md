# Docker Setup

## Build & Run
docker compose up --build webserver

This command starts:
- webserver → frontend + backend (port 80)
- blacklist_server → TCP server (port 4545)
- mongo_db → MongoDB (port 27017)

## Notes
- Ensure .env.production exists in config/
- To stop: docker compose down