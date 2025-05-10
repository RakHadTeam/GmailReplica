from receive_response import receive_response

def handle_input_loop(sock):
    while True:
        # Read raw input from the user
        user_input = input()

        # Add newline and encode to bytes
        data = (user_input + "\n").encode("utf-8")

        try:
            # Send the message in chunks of 4096 bytes
            CHUNK_SIZE = 4096
            total_sent = 0
            while total_sent < len(data):
                sent = sock.send(data[total_sent:total_sent + CHUNK_SIZE])
                if sent == 0:
                    break
                total_sent += sent
        except Exception as e:
            break

        try:
            # Wait and print the response from the server
            receive_response(sock)
        except Exception as e:
            break

    sock.close()
