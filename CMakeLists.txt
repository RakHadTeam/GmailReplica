cmake_minimum_required(VERSION 3.10)

# Project name and version
project(MyProject VERSION 1.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the source files from src/
file(GLOB_RECURSE SOURCES "src/*.cpp" "src/*.c")

# Add the test files from tests/
file(GLOB_RECURSE TEST_SOURCES "tests/*.cpp" "tests/*.c")

# Create a library for the source files
add_library(MyProjectLib ${SOURCES})
target_include_directories(MyProjectLib PUBLIC src)  # Add include path for headers

# Add executable for main project
add_executable(MyProjectExecutable src/main.cpp)
target_link_libraries(MyProjectExecutable MyProjectLib)

# Enable testing
enable_testing()

# Add GoogleTest via FetchContent
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/heads/main.zip
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE 
)

# Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Add test executable
add_executable(MyProjectTests ${TEST_SOURCES})
target_link_libraries(MyProjectTests MyProjectLib gtest gtest_main)

# Discover tests automatically
include(GoogleTest)
gtest_discover_tests(MyProjectTests)
