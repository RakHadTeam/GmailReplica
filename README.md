# APProject

[![CMake Tests](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml/badge.svg)](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml)

### Creators

This project was proudly created by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**APProject** is a command-line interface (CLI) tool designed to efficiently manage a blacklist of URLs using a Bloom Filter.

### Features
- **URL Blacklisting Server**: A server that uses a Bloom Filter to store, check, and delete blacklisted URLs. Refer to the [Server README](src/BlacklistServer/README.md) for more details.
- **Client for the URL Blacklisting Server**: A client that communicates with the server to manage the blacklist. Refer to the [Client README](src/BlacklistClient/README.md) for more details.
- **REST API for mail services**: A RESTful API that allows users to manage emails, labels, and blacklists. Refer to the [WebServer README](src/WebServer/README.md) for more details.
