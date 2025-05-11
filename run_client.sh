PORT=$2
HOST=$1

PORT=$PORT HOST=$HOST docker compose -f docker-compose.yml up --build -d client