def receive_response(sock):
    try:
        # Use buffer to accumulate the full response
        buffer = b""
        while True:
            chunk = sock.recv(4096)
            if not chunk:
                break
            buffer += chunk
            if b"\n" in chunk:  # End of message
                break

        response = buffer.decode("utf-8").strip()
        print(response)

    except Exception as e:
       return  
