# APProject

[![CMake Tests](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml/badge.svg)](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml)

### Creators

This project was proudly created by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**APProject** is a command-line interface (CLI) tool designed to efficiently manage a blacklist of URLs using a Bloom Filter.

## Running Server (In Docker)

We have provided you with easy to deploy bash scripts to run the docker containers in a shared network.

Firstly, run the server (The port argument will be the port that the server will listen on)
- `sh ./run_server.sh <PORT>`
OR:
- `PORT=<PORT> docker compose -f docker-compose.yml up --build -d server`

These commands will print the **container name, please remember it**.

<img width="941" alt="image" src="https://github.com/user-attachments/assets/ea3a05a7-88ce-41e5-a94c-b27d0e55a555" />

Then, the server will be up and running, waiting for it's configuration.

To configure the server, you will need to enter the container proccess in the terminal, by using `docker attach <Contianer Name>`
Run one of the following commands:
- `sh ./attach.sh <Container Name>`
- `docker attach <Container Name>`

Then procceed to configure the bloom filter

<img width="821" alt="image" src="https://github.com/user-attachments/assets/eab25c8a-29a0-4316-81e3-c21669124e3c" />

## Configure the Bloom Filter

The first line of the CLI program is used to configure the parameters of the Bloom Filter:

- The **first number** specifies the size of the Bloom Filter array (i.e., the number of bits in the array).
- Starting from the **second number**, each value represents a hash function. The number indicates how many times the haszh function will be applied to the URL.

### Example

```
8 1 2 3
```

- `8`: Specifies an 8-bit array.
- `1`: A hash function that runs once.
- `2`: A hash function that runs twice.
- `3`: A hash function that runs three times.

Each hash function sets the corresponding bits in the array based on its configuration.

## Running Client (In Docker)

Firstly, we need to build and start the client container.
Please run one of these commands:
HOST = is the server's hostname, please use `server` to refer to the server running in the container before.
PORT = the server's listening port, as defined earlier.

- `sh ./run_client.sh <HOST> <PORT>` (Use `server` in HOST)
- `PORT=<PORT> HOST=<HOST> docker compose -f docker-compose.yml up --build -d client` (Use `server` in HOST)

**Remeber the client container name!** It will be shown.

<img width="933" alt="image" src="https://github.com/user-attachments/assets/e718d21a-750a-4f7a-9c2d-2367bc1da40b" />

Like before, we need to attach to the container proccess
Do one of the commands:

- `sh ./attach.sh <Container Name>`
- `docker attach <Container Name>`

Then you can use the client normally, it will be connected to the server running on the container we set earlier.

<img width="812" alt="image" src="https://github.com/user-attachments/assets/77c6c8f4-7899-4c99-b9a3-c32293094727" />

## Features

- **URL Blacklisting**: Uses a Bloom Filter to store, check and delete blacklisted URLs. Using an Array of bits with Hash manipulation algorithms.
- **Portable**: Easily deployable in a Docker container with a easy to start script.

## CLI Commands (In Client)

### Add a URL to the Blacklist

To add a URL to the blacklist, use the following command:

```
POST <URL>
```

- `201 Created` - The url was added
- `400 Bad Request` - The url isn't valid

### Check if a URL is in the Blacklist

To check if a URL is in the blacklist, use the following command:

```
GET <URL>
```

- `200 OK` - The url is valid, and is in the blacklist.
  It will print `true true` (since it's in the array and blacklist)
<br>
- `404 Not Found`
  And it will print in this : `<BloomFIlter Array Bits Response Boolean> <Verified Answer After False Positive Check Boolean>`
<br>
- `400 Bad Request` - The url isn't valid

### Delete URL from the Blacklist
To delete a URL from the blacklist, use the following command:
```
DELETE <URL>
```
- `204 No Content`
  The URL is deleted from the DataBase.
- `404 Not Found`
  The URL isn't in the blacklist.
- `400 Bad Request`
  The URL isn't valid.


## Database

The filter array will be stored in a file named `filter_array` under the folder `data`.

The blacklist will be stored in a file named `blacklist` under the folder `data`.

It will be connected to the docker aswell.


## Q/A

- **Q: Is the fact that the command's names has been changed made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**
  **A:** No. As demonstrated in the lecture, we designed our main.cpp so that each command is mapped to a specific input string using a dictionary like structure (map). When a command’s name changes, we only need to update the corresponding key in this mapping, not the underlying command logic itself.
	This design aligns with the open to expansion and closed to changes, since we didn’t modify existing command implementations; we merely updated the configuration that connects input strings to commands. All command logic remains encapsulated in their respective classes, which were untouched.

	

- **Q: Is the fact that new commands has been added made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**
  A: No. We followed good design practices by defining an interface for all commands. Every new command simply inherits from this interface and implements its required behavior.
Additionally, we expanded the BloomFilter class with any needed functionality, which was a natural and modular process due to its structure.
This pattern lets us extend the functionality without modifying code that we wrote earlier, which is following the "Closed for modifications and open to expansion".
	

- **Q: Is the fact that the output of the commands has been changed made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**
  A: Yes. Initially, in Part 1, we thought that each response should be handled with a dedicated method, which led us to output results directly inside the commands themselves. This turned out to be a mistake, as it tightly coupled the output logic to the command logic.
What we needed was an abstraction for the response, allowing a single method of output to handle various messages in a more flexible way.
To address this, we created new Request and Response classes. Each command now returns a Response object containing all the relevant data. The App class is then responsible for sending that response to the client.
We believe this new structure provides better tools for future expansion, such as supporting multiple parameters, new attributes, or additional headers, without modifying existing command logic.

- **Q: Is the fact that the Input/Output comes from sockets instead of the console made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**
  A: Yes. In the previous part, we abstracted the Input/Output using interfaces that each class had to implement. However, our core design still didn’t allow the kind of extensibility we needed.
So we restructured the system into a Request/Response model, as described in the previous answer.
Now, input classes implement a method to receive a request from the client and construct a Request object, which contains all the data we need (method, parameters, etc.).
Output classes implement a method to send a Response object back to the client, making it easier for the commands to return a result without handling the I/O directly.
Going forward, to implement a new form of Input/Output, all we need to do is create classes that implement the existing interfaces. The App class remains unchanged, it simply receives a Request and outputs a Response, more over, the commands are totally isolated from the I/O, only getting Request and returning Response.
We believe this gives us the tools to handle future changes such as new input/output types, or support for more complex data (images, binary files, etc.). 


## Handling Invalid Input

Any input that does not comply with the expected format will be ignored. This includes:

- Incorrect configuration in the first line (Placing non positive integers as well).

Ensure all inputs follow the specified format to avoid being disregarded by the program.

Example:

PORT=8080 HOST=server

<img width="667" alt="image" src="https://github.com/user-attachments/assets/f6c7764f-4ab1-4e28-b1df-d71398401e40" />

<img width="667" alt="image" src="https://github.com/user-attachments/assets/47e5c50b-aaa7-4f43-81d6-f266ead7ee2b" />




