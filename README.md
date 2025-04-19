# APProject

### Project Contributors

This project was proudly developed by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**APProject** is a command-line interface (CLI) tool designed to efficiently manage a blacklist of URLs using a Bloom Filter.

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

## Features

- **URL Blacklisting**: Uses a Bloom Filter to store and check blacklisted URLs. Using an Array of bits with Hash manipulation algorithms.
- **Portable**: Easily deployable in a Docker container with a easy to start script.

## CLI Commands

### Add a URL to the Blacklist

To add a URL to the blacklist, use the following command:

```
1 <URL>
```
### Check if a URL is in the Blacklist

To check if a URL is in the blacklist, use the following command:

```
2 <URL>
```

- The response will be in this format: `<BloomFIlter Array Bits Response> <Verified Answer After False Positive Check>`

## Running the Application in Docker

To run the application inside a Docker container, execute the provided script:

```bash
./run-container.sh
```

## Handling Invalid Input

Any input that does not comply with the expected format will be ignored. This includes:

- Incorrect configuration in the first line (Placing non positive integers as well).
- Invalid input during the loop phase.
- Malformed or invalid URLs.

Ensure all inputs follow the specified format to avoid being disregarded by the program.