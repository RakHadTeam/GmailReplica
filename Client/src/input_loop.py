from receive_response import receive_response

def handle_input_loop(sock):
    while True:
        # Read raw input from the user
        user_input = input()

        try:
            # Send the raw input followed by a newline character
            sock.sendall((user_input + "\n").encode("utf-8"))
        except Exception as e:
            print(f"[ERROR] Failed to send: {e}")
            break

        try:
            # Wait and print the response from the server
            receive_response(sock)
        except Exception as e:
            print(f"[ERROR] Failed to receive: {e}")
            break

    sock.close()
