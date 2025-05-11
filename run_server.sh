PORT=$1
HOST="server"

PORT=$PORT HOST=$HOST docker compose -f docker-compose.yml up --build -d server