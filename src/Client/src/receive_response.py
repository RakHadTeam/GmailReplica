CHUNK_SIZE = 4096

def receive_response(sock):
    try:
        buffer = b""
        while True:
            chunk = sock.recv(CHUNK_SIZE)
            if not chunk:
                return  # connection closed
            buffer += chunk
            if chunk.endswith(b"\n"):
                break

        response = buffer.decode("utf-8").strip()
        print(response) 

    except Exception:
        return 