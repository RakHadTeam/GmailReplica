
import sys
from connection import get_ip_and_port
from socket_client import create_and_connect
from input_loop import handle_input_loop

def main():
    print("Client started")
    host, port = get_ip_and_port()

    client_socket = create_and_connect(host, port)

    handle_input_loop(client_socket)

if __name__ == "__main__":
    main()
