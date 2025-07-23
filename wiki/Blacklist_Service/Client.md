# Client for the Bloom Filter URL Blacklist Service

## Running Client (In Docker)
Firstly, we need to build and start the server container.
- `docker compose up --build blacklist_server`
- `docker compose up --build blacklist_client`

## Running Client (In Docker) Without Default Configuration

Firstly, we need to build and start the client container.

- `docker compose run --build blacklist_client <HOST> <PORT>` (HOST is the server container's name, by default we set it to `server-container`)

Then you can run the commands.

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
