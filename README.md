# APProject
## Contributers

The project was developed by:

- **Yoav Sinai**
- **David Goldstein**
- **Yahel Cohen**

**APProject** is a command-line interface (CLI) tool designed to efficiently manage a blacklist of URLs using a Bloom Filter.

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
- The tool automatically prefixes the URL with `'0'` before adding it to the Bloom Filter.

## Running the Application in Docker

To run the application inside a Docker container, execute the provided script:

```bash
./run-container.sh
```
