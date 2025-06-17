import socket
import sys

# Creates a TCP socket and connects to the specified IP and port
def create_and_connect(ip, port):
    try:
        # AF_INET specifies IPv4
        # SOCK_STREAM specifies TCP (reliable, connection-based)
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Attempt to connect to the server at the given IP and port
        client_socket.connect((ip, port))

        # Return the connected socket object to use for sending/receiving]

        return client_socket

    except socket.error as e:
        sys.exit(1)
