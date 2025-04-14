cmake_minimum_required(VERSION 3.10)

# Project name and version
project(MyProject VERSION 1.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the source files from src/
file(GLOB_RECURSE SOURCES "src/*.cpp" "src/*.c" "src/*.h")

# Add the test files from tests/
file(GLOB_RECURSE TEST_SOURCES "tests/*.cpp" "tests/*.c")

# Add executable for main project
add_executable(MyProjectExecutable ${SOURCES})

# Enable testing
enable_testing()

# Add GoogleTest
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/heads/main.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Add test executable
add_executable(MyProjectTests ${TEST_SOURCES} ${SOURCES})

# Link GoogleTest to the test executable
target_link_libraries(MyProjectTests gtest_main)

# Discover tests
include(GoogleTest)
gtest_discover_tests(MyProjectTests)
