def receive_response(sock):
    try:
        buffer = b""
        while True:
            chunk = sock.recv(4096)
            if not chunk:
                return  # connection closed
            buffer += chunk
            if b"\n" in chunk:
                break

        response = buffer.decode("utf-8").strip()
        print(response) 

    except Exception:
        return 