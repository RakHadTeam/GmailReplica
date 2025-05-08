def handle_input_loop(sock):
    while True:
        # Read raw input from the user
        user_input = input()

        try:
            # Send the raw input to the server
            sock.sendall(user_input.encode("utf-8"))
        except Exception:
            # Connection failed or closed
            break

    sock.close()
