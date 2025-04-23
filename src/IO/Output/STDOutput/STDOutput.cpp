#include <iostream>
#include <IO/Output/IOutput.h>
#include <IO/Output/STDOutput/STDOutput.h>

// Implement the display method to show result based on bloom filter and real blacklist
void STDOutput::displayCheckURLResult(bool arrayBitResult, bool URLBlacklistResult) {
	if (arrayBitResult) {
		if (URLBlacklistResult) {
			std::cout << "true true" << std::endl; // False positive case
		}
		else {
			std::cout << "true false" << std::endl; // URL definitely in blacklist
		}
	}
	else {
		std::cout << "false" << std::endl; // Definitely not in blacklist
	}
}
