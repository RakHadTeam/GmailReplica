from client.connection import get_ip_and_port
from client.socket_client import create_and_connect

def main():
    # Get IP and port from command-line arguments
    ip, port = get_ip_and_port()

    # Create a TCP socket and connect to the server
    client_socket = create_and_connect(ip, port)

    # Future logic: input loop, send commands, handle response

    client_socket.close()

if __name__ == "__main__":
    main()
