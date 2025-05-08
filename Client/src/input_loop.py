def handle_input_loop(sock):
    while True:
        # Read raw input from the user
        user_input = input()

        try:
            # Send the raw input followed by a newline character
            sock.sendall((user_input + "\n").encode("utf-8"))
        except Exception:
            # Connection failed or closed
            break

    sock.close()
