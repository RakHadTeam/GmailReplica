import sys
import socket

# Checks if the given string is a valid IPv4 address
def is_valid_ip(ip):
    try:
        socket.inet_aton(ip)  # Try converting to binary format
        return True
    except socket.error:
        return False

# Checks if the given string is a valid port number (numeric and in range)
def is_valid_port(port_str):
    return port_str.isdigit() and 1 <= int(port_str) <= 65535

# Parses the IP and port from command-line arguments
def get_ip_and_port():
    if len(sys.argv) != 3:
        # Exit if the number of arguments is not exactly 3 (name of file, IP and port)
        sys.exit(1)

    ip = sys.argv[1]
    port_str = sys.argv[2]

    if not is_valid_ip(ip):
        # Exit if IP is not in correct format
        sys.exit(1)

    if not is_valid_port(port_str):
        # Exit if port is not numeric or out of range
        sys.exit(1)

    # Return a valid (ip, port) tuple
    return ip, int(port_str)
