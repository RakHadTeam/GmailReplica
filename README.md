# Gmail Replica

[![CMake Tests](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml/badge.svg)](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml)

### Creators

This project was proudly created by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**Gmail Replica** is a full-stack web application designed for sending, receiving, and managing emails. It features a modern interface inspired by Gmail, supports custom labels, spam filtering, theming (including dark mode), and integrates with a TCP-based blacklist server.

### Features
- **URL Blacklisting Server**: A server that uses a Bloom Filter to store, check, and delete blacklisted URLs. Refer to the [Server README](wiki/Blacklist_Service/Server.md) for more details.
- **Client for the URL Blacklisting Server**: A client that communicates with the server to manage the blacklist. Refer to the [Client README](wiki/Blacklist_Service/Client.md) for more details.
- **Full-Stack RakMail App**: A Gmail-Inspired Mail App that allows users to send emails, manage labels, and utilize blacklists. Refer to the [WebServer README](wiki/FullStack_Mail_App//Overview.md) for more details.
- **Android Mail App**: A native Android application for managing emails, built with Kotlin and Jetpack Compose. Refer to the [AndroidApp README](wiki/Android_Mail_App/Overview.md) for more details.
