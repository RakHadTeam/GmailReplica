# Use gcc base image
FROM gcc:latest

# Install only runtime dependencies (if needed)
RUN apt-get update && apt-get install -y cmake && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . /usr/src/APProject
WORKDIR /usr/src/APProject

# Build the project
RUN if [ ! -d "/build" ]; then mkdir /build; fi
WORKDIR /usr/src/APProject/build

# Install build dependencies
RUN cmake .. && make

# Set working directory to build output
WORKDIR /usr/src/APProject/build

# Run the compiled binary
CMD ["./MyProjectExecutable"]
