#include <iostream>
#include "IOutput.h"
#include "STDOutput.h"

// Implement the display method to show result based on bloom filter and real blacklist
void STDOutput::displayCheckURLResult(bool arrayBitResult, bool falsePositiveResult) {
	if (arrayBitResult) {
		if (falsePositiveResult) {
			std::cout << "true false" << std::endl; // False positive case
		}
		else {
			std::cout << "true true" << std::endl; // URL definitely in blacklist
		}
	}
	else {
		std::cout << "false" << std::endl; // Definitely not in blacklist
	}
}
