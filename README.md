# APProject

[![CMake Tests](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml/badge.svg)](https://github.com/RakHadTeam/APProject/actions/workflows/cmake-tests.yml)

### Creators

This project was proudly created by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**APProject** is a command-line interface (CLI) tool designed to efficiently manage a blacklist of URLs using a Bloom Filter.

## Running Server (In Docker)

Firstly, run the server (The port argument will be the port that the server will listen on, the rest will be for the bloom filter configuration)
- `docker compose run --build --name server-container server <PORT> <BloomFilter array size> <Number of times to run hash 1> <...>`

`--name server-container` will set the docker container's name to be `server-container`, you will need to pass it to the client.

Then the server will be up and running.

## Running Tests (In Docker)

Run the following command:
- `docker compose run --build tests`

## Configure the Bloom Filter

The arguments after the port are used to configure the parameters of the Bloom Filter:

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

- `docker compose run --build client <HOST> <PORT>` (HOST is the server container's name, by default we set it to `server-container`)

Then you can run the commands.

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

- **Q: Is the fact that the command's names has been changed made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**<br>**A:** No. As demonstrated in the lecture, we designed our main.cpp so that each command is mapped to a specific input string using a dictionary like structure (map). When a command’s name changes, we only need to update the corresponding key in this mapping, not the underlying command logic itself.
	This design aligns with the open to expansion and closed to changes, since we didn’t modify existing command implementations; we merely updated the configuration that connects input strings to commands. All command logic remains encapsulated in their respective classes, which were untouched.

	

- **Q: Is the fact that new commands has been added made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**<br>**A:** No. We followed good design practices by defining an interface for all commands.<br>Every new command simply inherits from this interface and implements its required behavior.<br>Additionally, we expanded the BloomFilter class with any needed functionality, which was a natural and modular process due to its structure.<br>This pattern lets us extend the functionality without modifying code that we wrote earlier, which is following the "Closed for modifications and open to expansion".
	

- **Q: Is the fact that the output of the commands has been changed made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**<br>**A:** Yes. Initially, in Part 1, we thought that each response should be handled with a dedicated method, which led us to output results directly inside the commands themselves.<br>This turned out to be a mistake, as it tightly coupled the output logic to the command logic. What we needed was an abstraction for the response, allowing a single method of output to handle various messages in a more flexible way.<br>To address this, we created new Request and Response classes. Each command now returns a Response object containing all the relevant data. The App class is then responsible for sending that response to the client.<br>We believe this new structure provides better tools for future expansion, such as supporting multiple parameters, new attributes, or additional headers, without modifying existing command logic.

- **Q: Is the fact that the Input/Output comes from sockets instead of the console made us touch the code that was supposed to be "Closed for modifications and open to expansion"?**<br>**A:** Yes. In the previous part, we abstracted the Input/Output using interfaces that each class had to implement. However, our core design still didn’t allow the kind of extensibility we needed.<br>So we restructured the system into a Request/Response model, as described in the previous answer.<br>Now, input classes implement a method to receive a request from the client and construct a Request object, which contains all the data we need (method, parameters, etc.).<br>Output classes implement a method to send a Response object back to the client, making it easier for the commands to return a result without handling the I/O directly.<br>Going forward, to implement a new form of Input/Output, all we need to do is create classes that implement the existing interfaces. The App class remains unchanged, it simply receives a Request and outputs a Response, more over, the commands are totally isolated from the I/O, only getting Request and returning Response.<br>We believe this gives us the tools to handle future changes such as new input/output types, or support for more complex data (images, binary files, etc.). 


## Handling Invalid Input

Any input that does not comply with the expected format will be ignored. This includes:

- Incorrect configuration in the first line (Placing non positive integers as well).

Ensure all inputs follow the specified format to avoid being disregarded by the program, and will return `400 Bad Request`

Example:

PORT=`4545` HOST=container name=`server-api` Bloom Filter Arguments: `16 1 2`

![image](https://github.com/user-attachments/assets/991aa453-3849-4031-9524-fd7a591bd216)
