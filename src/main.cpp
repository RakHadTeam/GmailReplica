#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include "BloomFilter.h"
#include "STDHash.h"

// Function to check if a given string represents a positive integer
bool isPositiveInteger(const std::string& str)
{
	if (str.empty())
	{
		return false; // An empty string is not a valid positive integer
	}
	for (char c : str)
	{
		if (!std::isdigit(c))
		{
			return false; // If any character is not a digit, it's not a valid positive integer
		}
	}
	return std::stoll(str) > 0; // Ensure the number is greater than zero
}

// Function to read and validate a list of positive integers from the user
void inputParametersForBloomFilter(std::vector<int>& numbers)
{
	std::string line;             // To store the input line
	std::getline(std::cin, line); // Read the entire line of input

	std::istringstream iss(line); // Create a string stream for parsing the input
	std::string token;            // To store each token (number) from the input

	while (iss >> token)
	{ // Extract tokens from the input
		if (!isPositiveInteger(token))
		{
			numbers.clear();                        // Clear the vector if invalid input is detected
			inputParametersForBloomFilter(numbers); // Recursively prompt for valid input
			return;                                 // Exit the current function call
		}
		numbers.push_back(std::stoi(token)); // Convert the token to an integer and add it to the vector
	}

	if (numbers.size() < 2) // If less than 2 numbers are provided
	{
		inputParametersForBloomFilter(numbers); // Prompt for valid input again
		return;                                 // Exit the current function call
	}
}

bool CheckURL(const std::string& url)
{
	return true;
}

int main()
{
	std::vector<int> numbers;

	inputParametersForBloomFilter(numbers);

	// Remove the front element and store it in bitArraySize
	int bitArraySize = numbers.front();
	numbers.erase(numbers.begin());

	// Construct the hash array:
	std::vector<IHashFunction*> hashFunctions;
	for (auto num : numbers)
	{
		STDHash* hashFunction = new STDHash(num);
		hashFunctions.push_back(hashFunction); // Store the hash function in the vector
	}

	// Print the hash functions:
	for (auto hashFunction : hashFunctions)
	{
		hashFunction->hash("www.example.com0");
	}

	// Construct bloom filter:
	BloomFilter bloomFilter(bitArraySize, hashFunctions);

	
}