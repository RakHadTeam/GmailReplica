# URL Blacklist Server

## Running Server (In Docker)

- `docker compose up --build blacklist_server`
- This command starts the server container, which will listen on port 4545 by default.

## Running Server (In Docker) - Without default Configuration

Make sure that the working directory is in `src/BlacklistServer`

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

## Features

- **URL Blacklisting**: Uses a Bloom Filter to store, check and delete blacklisted URLs. Using an Array of bits with Hash manipulation algorithms.
- **Portable**: Easily deployable in a Docker container with a easy to start script.

## Socket Communication

### Add a URL to the Blacklist

To add a URL to the blacklist, send the following message through the socket:

```
POST <URL>
```

The response will be:
- `201 Created` - The url was added
- `400 Bad Request` - The url isn't valid

### Check if a URL is in the Blacklist

To check if a URL is in the blacklist, send the following message through the socket:

```
GET <URL>
```

The response will be:
- `200 OK` - The url is valid, and is in the blacklist.
  It will respond with another line, `true true` (since it's in the array and blacklist)
<br>
- `404 Not Found`
  And it will respond with: `<BloomFIlter Array Bits Response Boolean> <Verified Answer After False Positive Check Boolean>`
<br>
- `400 Bad Request` - The url isn't valid

### Delete URL from the Blacklist
To delete a URL from the blacklist, send the following message through the socket:
```
DELETE <URL>
```

The response will be:
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


## Handling Invalid Input

Any input that does not comply with the expected format will be ignored. This includes:

- Incorrect configuration in the first line (Placing non positive integers as well).

Ensure all inputs follow the specified format to avoid being disregarded by the program, and will return `400 Bad Request`

Example:

PORT=`4545` HOST=container name=`server-api` Bloom Filter Arguments: `16 1 2`

![image](https://github.com/user-attachments/assets/991aa453-3849-4031-9524-fd7a591bd216)
